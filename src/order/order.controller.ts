import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {OrderService} from "./order.service";
import { Order } from './schemas/order.schema';
import { QueryDto } from './dto/query-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { EditOrderStatusDto } from './dto/edit-order-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get()
    @UseGuards(AuthGuard())
    public getAllOrderByCustomer(@Req() req): Promise<Order[]>{
        return this.orderService.findCustomerAllOrder(req.user);
    }

    @Get('/allOrder')
    @UseGuards(AuthGuard())
    public getAllOrders(@Query() query:QueryDto, @Req() req): Promise<Order[]>{
        return this.orderService.findAll(query, req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    public getOrderById(@Param('id') id:string): Promise<Order>{
        return this.orderService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    public createNewOrder(@Body() body: CreateOrderDto, @Req() req): Promise<Order>{
        return this.orderService.create(body, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    public editOrderStatusById(@Param('id') id:string, @Body() body: EditOrderStatusDto, @Req() req): Promise<Order>{
        return this.orderService.updateStatusById(id, body, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    public cancelOrderById(@Param('id') id:string):Promise<Order>{
       return this.orderService.deleteById(id);
    }
}
