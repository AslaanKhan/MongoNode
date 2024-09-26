import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { ProductDocument } from "./product.model";

export interface OrderDocument extends mongoose.Document {
  user: UserDocument["_id"];
  userAgent: string;
  amount: number;
  paymentMode: string;
  paymentId: string;
  paymentStatus: string;
  paymentResult: string;
  orderStatus: string;
  products: [{ id: ProductDocument["_id"], quantity: number }];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userAgent: { type: String },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: { type: String },
    paymentResult: { type: String },
    orderStatus: { type: String, default: "pending" },
    products: [{
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }],
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);

export default OrderModel;