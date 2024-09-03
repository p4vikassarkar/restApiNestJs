import {
    IsEmpty,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { DeliveryStatus, PaymentStatus } from '../schemas/transaction.schema';

export enum PaymentType{
    CASH = "cash",
    UPI = "upi",
    PAY_LATER="pay_later",
}
  export class CreateTransactionDto {
  
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsNotEmpty()
    @IsString()
    customerFullname: string;

    @IsNotEmpty()
    @IsString()
    orderId: string;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @IsNotEmpty()
    @IsNumber()
    paidAmount: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(PaymentType)
    paymentType:PaymentType;

    @IsEmpty({ message: 'You cannot pass payment status while creating order' })
    paymentStatus:PaymentStatus;

    @IsEmpty({ message: 'You cannot pass delivery status while creating order' })
    deliveryStatus:DeliveryStatus;

    @IsEmpty({ message: 'You cannot pass creator id' })
    createdBy: User;

    @IsEmpty({ message: 'You cannot pass editor id' })
    editedBy: User;

  }
  