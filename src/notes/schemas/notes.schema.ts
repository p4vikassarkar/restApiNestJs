import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
  FICTION = 'Fiction',
}

@Schema({
  timestamps: true,
})
export class Cart {

  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  totalPrice: number;

  @Prop()
  imageUrl: string;

  @Prop()
  imageName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
