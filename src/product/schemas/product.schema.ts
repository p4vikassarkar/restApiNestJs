import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/auth/schemas/user.schema";
import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop()
  code: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  imageUrl: string;

  @Prop()
  imageName: string;

  @Prop({ required: true })
  archive: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  editedBy: User;
}

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = uuidv4();
  }
  next();
});

export { ProductSchema };
