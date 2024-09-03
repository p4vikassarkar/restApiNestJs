import {BadRequestException, Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import { Query } from 'express-serve-static-core';
import { Transaction } from './schemas/transaction.schema';
import mongoose from "mongoose";
import { User } from 'src/auth/schemas/user.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import _ from 'lodash';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction.name) private transactionModel:mongoose.Model<Transaction>) {}

    async findAll(query: Query):Promise<Transaction[]>{
        return [];
    }

    async findById(id:string):Promise<Transaction>{
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
          throw new BadRequestException("Please enter correct id.");
        }
        const transaction = await this.transactionModel.findById(id);
        if (!transaction) {
          throw new NotFoundException("Product not found.");
        }
        return transaction;
    }

    async create(transaction: Transaction, user: User):Promise<CreateTransactionDto>{
        const existingTransaction = await this.transactionModel.find({orderId: transaction.orderId});
        if(_.isEmpty(existingTransaction)){
            
        } else {
            throw new NotAcceptableException('Transaction already exist with same orderId')
        }
        return;
    }

    async updateById(id:string):Promise<Transaction>{
        // if transaction id exist
            // add amount already paid amount paid    and payment type
        return;
    }
}
