import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export enum PaymentStatus {
    DONE = 'done',
    PARTIAL = 'partial',
    PENDING = 'pending'
}

export enum DeliveryStatus {
    DONE = 'done',
    INPROGRESS = 'inprogress',
    PENDING = 'pending'
}

export enum PaymentType{
    CASH = "cash",
    UPI = "upi",
    PAY_LATER="pay_later",
}

// admin can add transaction on later payment. 
// will be added against customer paying in cash or UPI only

@Schema()
export class Transaction extends Document {

    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true })
    customerFullname: string;

    @Prop()
    orderId: string;

    @Prop()
    totalAmount: number;

    @Prop({ required: true })
    paidAmount: number;

    @Prop({ required: true })
    paymentType:PaymentType;

    @Prop({ required: true })
    paymentStatus:PaymentStatus;

    @Prop({ required: true })
    deliveryStatus:DeliveryStatus;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    createdBy: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User"  })
    editedBy: User;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
