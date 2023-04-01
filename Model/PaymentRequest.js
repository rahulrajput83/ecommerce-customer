import mongoose from "mongoose";

const PaymentRequest = new mongoose.Schema({
    paymentStatus: Boolean,
    fullName: String,
    userId: String,
    email: String,
    mobileNumber: String,
    DeliveryAddress: String,
    products: Array,
    paymentURL: String,
    paymentID: String,
});

const PaymentRequestModel = mongoose.models.PaymentRequest || mongoose.model('PaymentRequest', PaymentRequest);

export default PaymentRequestModel;