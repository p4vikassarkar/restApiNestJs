import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';


export enum Role{
    ADMIN = "admin",
    CUSTOMER = "customer"
} 

export class UserDto {
  
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly role: Role;
}
