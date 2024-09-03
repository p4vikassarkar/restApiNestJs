import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import _ from "lodash";
import { Product } from "./schemas/product.schema";

import { Query } from "express-serve-static-core";
import { User } from "../auth/schemas/user.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: mongoose.Model<Product>
  ) {}

  private async checkProductDuplication(product: CreateProductDto): Promise<boolean> {
    const productDetails = await this.productModel.find({
      $or: [{ name: product.name }, { description: product.description }],
    });
    const productExist = _.isEmpty(productDetails) ? false : true;
    return productExist;
  }

  public async findAll(query: Query): Promise<Product[]> {
    const resPerPage = Number(query.page) ? 10 : 1;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: "i",
          },
        }
      : {};

    const products =
      resPerPage !== 1
        ? await this.productModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip)
        : await this.productModel.find({ ...keyword });
    return products;
  }

  public async create(product: CreateProductDto, user: User): Promise<Product> {
    const isDuplicateData = await this.checkProductDuplication(product);
    if (!isDuplicateData) {
      const data = Object.assign(product, {
        createdBy: user._id,
        editedBy: user._id,
        archive: false,
      });
      const res = await this.productModel.create(data);
      return res;
    } else {
      throw new NotFoundException(
        "Product already exist with same code or description."
      );
    }
  }

  public async findById(id: string): Promise<Product> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException("Please enter correct id.");
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found.");
    }
    return product;
  }

  public async updateById(id: string, product: UpdateProductDto, user: User): Promise<Product> {
    const productDetails = await this.productModel.findById(id);
    const data = Object.assign(product, { editedBy: user._id, code: productDetails.code });
    return this.productModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  public async deleteById(id: string): Promise<Product> {
    // return await this.productModel.findByIdAndDelete(id);
    const product = this.productModel.findById(id);
    const data = Object.assign(product, { archive: true });
    return this.productModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
}
