import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  public signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  public login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }


  @Get('/userDetail')
  @UseGuards(AuthGuard())
  public getUserDetail(@Req() req):Promise<UserDto>{
    return this.authService.findUserDetail(req.user);
  }

  @Get('/allCustomer')
  @UseGuards(AuthGuard())
  public getAllCustomer(@Req() req):Promise<UserDto[]>{
    return this.authService.findAllCustomer(req.user);
   }
  
}