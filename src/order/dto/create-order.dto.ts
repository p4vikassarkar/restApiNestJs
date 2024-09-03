import {
  IsArray,
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { CartDetails } from 'src/cart/schemas/cart.details.schema';

  export enum Status {
    CREATED = "created",
    IN_PROGRESS = "in_progress",
    FULFILLED = "fulfilled",
    CANCELLED = "cancelled",
  }
    
  export class CreateOrderDto {
  
    @IsNotEmpty()
    @IsString()
    readonly customerId: string;
    
    @IsNotEmpty()
    @IsString()
    readonly customerFullname: string;

    @IsArray()
    @IsNotEmpty()
    readonly cartData: CartDetails[];
  
  }
  