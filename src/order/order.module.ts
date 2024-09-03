import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schemas/order.schema';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    CartModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}

// while creating an order 
// add customer_id, full_name, and created_at
// and full array of cart
// and calculated price to pay and discount if applicable 
// once done clear cart
// 