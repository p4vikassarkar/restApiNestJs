import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateProductDto {

  @IsEmpty({ message: 'You cannot pass code' })
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly imageUrl: string;

  @IsNotEmpty()
  @IsString()
  readonly imageName: string;

  readonly archive: boolean;

  @IsEmpty({ message: 'You cannot pass creator id' })
  readonly createdBy: User;

  @IsEmpty({ message: 'You cannot pass editor id' })
  readonly editedBy: User;

}
