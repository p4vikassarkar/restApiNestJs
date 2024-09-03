import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Product } from './schemas/product.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    public async getAllProducts(@Query() query: ExpressQuery): Promise<Product[]> {
      return this.productService.findAll(query);
    }
  
    @Get(':id')
    async getProduct(@Param('id') id: string): Promise<Product> {
      return this.productService.findById(id);
    }
  
    // @Post('create')
    // @UseInterceptors(FileInterceptor('image'))
    // async createProduct(@UploadedFile() file, @Body() createProductDto: CreateProductDto, @Request() req) {
    //   const product = {
    //     ...createProductDto,
    //     imageUrl: file.path,
    //     imageName: file.originalname,
    //   };
    //   const createdProduct = await this.productsService.create(product, req.user._id);
    //   return createdProduct;
    // }

    @Post()
    @UseGuards(AuthGuard())
    public async createProduct(@Body() product: CreateProductDto , @Req() req): Promise<Product> {
      return this.productService.create(product, req.user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    public async updateProduct( @Param('id') id: string, @Body() product: UpdateProductDto, @Req() req): Promise<Product> {
      return this.productService.updateById(id, product, req.user);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard())
    public async deleteProduct( @Param('id')id: string): Promise<Product> {
      return this.productService.deleteById(id);
    }
}
