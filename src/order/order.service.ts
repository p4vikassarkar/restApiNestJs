import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, Status } from "./schemas/order.schema";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import _ from "lodash";
import { EditOrderStatusDto } from "./dto/edit-order-status.dto";
import { QueryDto } from "./dto/query-order.dto";
import { CartDetails } from "src/cart/schemas/cart.details.schema";
import { CartService } from "src/cart/cart.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: mongoose.Model<Order>, private cartService: CartService
  ) {}

  private getOrderPrice(cartItems:CartDetails[]):number{
    let orderPrice = 0;
    cartItems.forEach(cartData => {
        orderPrice = orderPrice + cartData.totalPrice
    });
    return orderPrice;
  }

  public async findAll(query: QueryDto, user: User): Promise<Order[]> {
    if (user.role === "admin") {
      // query : status / customerId / startDate / endDate
      const orders = await this.orderModel.find({ query });
      return orders;
    }
    throw new UnauthorizedException("You are not authorized to view details.");
  }

  public async findCustomerAllOrder(user: User): Promise<Order[]> {
    const orders = await this.orderModel.find({ customerId: user._id });
    return orders;
  }

  public async findById(id: string): Promise<Order> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException("Please enter correct id.");
    }
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException("Order not found.");
    }
    return order;
  }

  public async create(order: CreateOrderDto, user: User): Promise<Order> {
    const cartItems = order.cartData;
    if (!_.isEmpty(cartItems)) {
      const orderPrice = this.getOrderPrice(cartItems);
      const data = Object.assign(order, {
        createdBy: user._id,
        editedBy: user._id,
        archive: false,
        status: Status.CREATED,
        orderPrice
      });
      try {
        await this.cartService.deleteOrderedCart(cartItems, user);
      } catch (error) {
        throw new NotFoundException('Some of the items added in order do not exist in cart');
      }
      return  await this.orderModel.create(data);
    } else {
      throw new NotFoundException("Order with empty cart data not excepted.");
    }
  }

  public async updateStatusById(id: string, order: EditOrderStatusDto, user: User): Promise<Order> {
    const orderDetails = await this.orderModel.findById(id);
    const data = Object.assign(orderDetails, {
      editedBy: user._id,
      status: order.status,
    });
    return this.orderModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  public async deleteById(id: string): Promise<Order> {
    // return await this.orderModel.findByIdAndDelete(id);
    const order = this.findById(id);
    const data = Object.assign(order, { status: Status.CANCELLED });
    return this.orderModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
}
