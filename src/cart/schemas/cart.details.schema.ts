import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema({
    timestamps: true,
})
export class CartDetails {
    @Prop()
    productId: string;

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

    @Prop()
    archive: boolean;

    @Prop()
    createdBy: User;
}

export const CartDetailsSchema = SchemaFactory.createForClass(CartDetails);
