import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
// import { TransactionModule } from './transaction/transaction.module';
// import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    ProductModule,
    // MulterModule.register({
    //   dest: './uploads', // Or specify your custom storage engine
    // }),
    // NotesModule,
    CartModule,
    OrderModule,
    // TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
