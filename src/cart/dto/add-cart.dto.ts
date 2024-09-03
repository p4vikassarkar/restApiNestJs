import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class AddCartDto {

  @IsNotEmpty()
  @IsString()
  readonly productId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;
  
  @IsEmpty({ message: 'You cannot pass creator id' })
  readonly createdBy: User;

}
