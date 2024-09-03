import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';


export enum Role{
    ADMIN = "admin",
    CUSTOMER = "customer"
} 

export class UserDetailsDto {

  @Expose()
 _id: ObjectId;

  @Exclude()
  password:string;
  
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
