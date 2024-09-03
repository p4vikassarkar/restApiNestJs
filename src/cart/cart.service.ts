import {
    BadRequestException,
    HttpException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Cart } from "./schemas/cart.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import _ from "lodash";
import { Query } from "express-serve-static-core";
import { User } from "src/auth/schemas/user.schema";
import { CartDetails } from "./schemas/cart.details.schema";
import { ProductService } from "../product/product.service";

export enum productStatus {
    AVAILABLE = "available",
    NOTAVAILABLE = "notavailable",
    OUTOFSTOCK = "outofstock",
}

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: mongoose.Model<Cart>,
        private productService: ProductService
    ) { }

    private async checkProductStatus(cartItem: Cart): Promise<productStatus> {
        const productData = await this.productService.findById(cartItem.productId);
        if (productData) {
            if (productData.archive) {
                return productStatus.OUTOFSTOCK;
            } else {
                return productStatus.AVAILABLE;
            }
        }
        return productStatus.NOTAVAILABLE;
    }

    private async getAllCartItemsDetail(cartItem: Cart): Promise<CartDetails> {
        const productData = await this.productService.findById(cartItem.productId);
        if (!_.isEmpty(productData)) {
            const ItemTotalPrice = cartItem.quantity * productData.price;
            const cartItemDetails = {
                productId: cartItem.productId,
                code: productData.code,
                description: productData.description,
                name: productData.name,
                quantity: cartItem.quantity,
                price: productData.price,
                totalPrice: ItemTotalPrice,
                imageUrl: productData.imageUrl,
                imageName: productData.imageName,
                archive: productData.archive,
                createdBy: cartItem.createdBy,
            };
            return cartItemDetails;
        } else {
            throw new NotFoundException("Some products in cart are not available");
        }
    }

    // TODO search carts by keyword and pagination

    public async findAll(query: Query, user: User): Promise<CartDetails[]> {
        const cartDetailsSet = new Set<CartDetails>();
        const resPerPage = Number(query.page) ? 10 : 1;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        const idQuery = {
            createdBy: user._id,
        };
        const carts =
            resPerPage !== 1
                ? await this.cartModel.find(idQuery).limit(resPerPage).skip(skip)
                : await this.cartModel.find(idQuery);

        for (const item of carts) {
            try {
                const itemDetails = await this.getAllCartItemsDetail(item);
                cartDetailsSet.add(itemDetails);
            } catch (error) {
                console.error("Error fetching items of cart:", error);
            }
        }
        const cartDetails = Array.from(cartDetailsSet);
        return cartDetails;
    }

    public async findById(id: string): Promise<CartDetails> {
        const item = await this.cartModel.findById(id);
        if (!item) {
            throw new NotFoundException("Item not available in cart.");
        }
        const cartItem = await this.getAllCartItemsDetail(item);
        return cartItem;
    }

    public async create(cart: Cart, user: User): Promise<Cart> {
        const itemStatus = await this.checkProductStatus(cart);
        if (itemStatus === productStatus.AVAILABLE) {
            const existingCartProduct = await this.cartModel.find({
                productId: cart.productId,
            });
            if (!_.isEmpty(existingCartProduct)) {
                const res = this.updateById(existingCartProduct[0].id, cart, user);
                return res;
            } else {
                const data = Object.assign(cart, { createdBy: user._id });
                const res = await this.cartModel.create(data);
                return res;
            }
        } else if (itemStatus === productStatus.OUTOFSTOCK) {
            throw new NotFoundException("Product out of stock.");
        } else {
            throw new NotFoundException("Product not available.");
        }
    }

    public async updateById(id: string, cart: Cart, user: User): Promise<Cart> {
        const itemStatus = await this.checkProductStatus(cart);
        if (itemStatus === productStatus.AVAILABLE) {
            const existingCartProduct = await this.cartModel.find({
                productId: cart.productId,
            });
            // update or delete item if already exist
            if (!_.isEmpty(existingCartProduct) && existingCartProduct.length === 1) {
                const data = Object.assign(cart, {
                    createdBy: user._id,
                });
                // delete item if quantity is 0
                if (cart.quantity === 0) {
                    const res = this.deleteById(existingCartProduct[0].id);
                    return res;
                }
                // update  item if quantity is not 0
                else {
                    const res = await this.cartModel.findByIdAndUpdate(id, data, {
                        new: true,
                        runValidators: true,
                    });
                    return res;
                }
            } else if (
                !_.isEmpty(existingCartProduct) &&
                existingCartProduct.length > 1
            ) {
                throw new NotFoundException("Multiple items of same product in cart");
            } else {
                throw new NotFoundException("Item do not exist in cart");
            }
        } else if (itemStatus === productStatus.OUTOFSTOCK) {
            throw new NotFoundException("Product out of stock.");
        } else {
            throw new NotFoundException("Product not available.");
        }
    }

    public async deleteById(id: string): Promise<Cart> {
        try {
            const deletedItem = await this.cartModel.findByIdAndDelete(id);
            return deletedItem;
        } catch {
            throw new NotFoundException("Product not found.");
        }
    }

    public async deleteOrderedCart(
        orderedCart: CartDetails[],
        user: User
    ): Promise<Cart[]> {
        let orderedItemsExistInCart = true;
        const orderedItemCartId = [];
        const deletedItemArray = [];
        const cartItems = await this.cartModel.find({ createdBy: user._id });
        try {
            orderedCart.forEach((orderedItem) => {
                const itemExistInCart =
                    cartItems.filter(
                        (item) =>
                            item.productId === orderedItem.productId &&
                            item.quantity === orderedItem.quantity
                    ).length > 0;
                if (!itemExistInCart) {
                    orderedItemsExistInCart = false;
                } else {
                    orderedItemCartId.push(itemExistInCart[0].id);
                }
            });
            if (orderedItemsExistInCart) {
                orderedItemCartId.forEach(async (itemId) => {
                    const deletedItem = await this.cartModel.findByIdAndDelete(itemId);
                    deletedItemArray.push(deletedItem);
                });
            } else {
                throw new NotFoundException("Problem in deleting items from cart");
            }
            return deletedItemArray;
        } catch {
            throw new NotFoundException("Problem in deleting items from cart");
        }
    }
}
