import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";

import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { plainToInstance } from "class-transformer";
import { UserDto } from "./dto/user.dto";
import { UserDetailsDto } from "./dto/user-details.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) { }

  public async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10); //one more salt conversion
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  public async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  public async findUserDetail(user: User): Promise<UserDetailsDto> {
    if (user) {
      const { password, ...safeUser } = user.toObject();
      const newUser =  plainToInstance(UserDetailsDto, safeUser);
      newUser._id=user._id;
      return newUser;
    }
    throw new NotFoundException("User data not found");
  }

  public async findAllCustomer(user: User): Promise<UserDto[]> {
    if (user.role === "admin") {
      const customerData = await this.userModel
        .find({ role: "customer" })
        .select("-password")
        .lean();
      return customerData;
    }
    throw new UnauthorizedException("User not authorized to view details.");
  }
}
