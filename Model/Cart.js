import mongoose from "mongoose";

const Cart = new mongoose.Schema({
    product: Object,
    productId: String,
    userId: String,
    paid: Boolean,
});

const CartModel = mongoose.models.Cart || mongoose.model('Cart', Cart);

export default CartModel;