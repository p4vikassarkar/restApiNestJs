import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';


@Schema({
  timestamps: true,
})
export class Cart {

  @Prop()
  productId: string;

  @Prop()
  quantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
