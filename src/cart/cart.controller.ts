import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CartService } from './cart.service';
import { Cart } from './schemas/cart.schema';
import { AddCartDto } from './dto/add-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartDetails } from './schemas/cart.details.schema';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) { }

    @Get()
    @UseGuards(AuthGuard())
    public async getAllCartItems(@Query() query: ExpressQuery, @Req() req): Promise<CartDetails[]> {
      return this.cartService.findAll(query, req.user);
    }
  
    @Get(':id')
    @UseGuards(AuthGuard())
    public async getCart(@Param('id') id: string): Promise<CartDetails> {
      return this.cartService.findById(id);
    }
  
    @Post()
    @UseGuards(AuthGuard())
    public async createCart(@Body() cart: AddCartDto , @Req() req): Promise<Cart> {
      return this.cartService.create(cart, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    public async editCart( @Param('id') id: string, @Body() cart: UpdateCartDto, @Req() req): Promise<Cart> {
      return this.cartService.updateById(id, cart, req.user);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard())
    public async deleteCartItem( @Param('id')id: string): Promise<Cart> {
      return this.cartService.deleteById(id);
    }

}
