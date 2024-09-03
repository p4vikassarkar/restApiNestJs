import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'transaction', schema: TransactionSchema }])
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}



// payment through wizard or just to record
// Table transaction{
//   id : number
//   user_id:string
//   customer_id:number
//   customer_fullname:string
//   type:enum [cash, ol, paylater]
//   payment_status:enum [success, success/failure, inprogess]
//   amount:float
//   created_at: timestamp
// }
