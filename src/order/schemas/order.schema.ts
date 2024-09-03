import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { CartDetails } from "src/cart/schemas/cart.details.schema";

export enum Status {
  CREATED = "created",
  IN_PROGRESS = "in_progress",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  status: Status;

  @Prop({ required: true })
  customerFullname: string;

  @Prop({ required: true })
  cartData: CartDetails[];

  @Prop({ required: true })
  orderPrice: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId})
  editedBy: User;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
