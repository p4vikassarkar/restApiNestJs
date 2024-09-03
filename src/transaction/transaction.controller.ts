import {Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import {TransactionService} from "./transaction.service";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transaction')
export class TransactionController {
    constructor(transactionService: TransactionService) {}

    @Get()
    async getTransactionsByRange(@Query() query: ExpressQuery){
        // getAll
    }

    @Get("id")
    async getCustomersTransaction(@Query() query:ExpressQuery){
        //getByCustomerId
    }

    @Post()
    @UseGuards(AuthGuard())
    async createTransaction(@Body() body:CreateTransactionDto, @Req() req){
        //create
    }

    @Put(":id")
    async editTransaction(@Query() query: ExpressQuery, @Body() body:any){
        //updateById
    }

}

// add transaction
// edit status of transaction
// get transaction for customer -- date wise or all
// get monthly transaction history