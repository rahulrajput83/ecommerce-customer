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
    deliveryDate: String,
    paymentDate: String,
    orderId: String,
    subTotal: String,
    shippingCharges: String,
    tax: String,
    grandTotal: String,
    packedStatus: Boolean,
    packedOn: String,
    deliveryStatus: Boolean,
    deliveredDate: String,
    deliveredBy: String,
    receivedBy: String,
    city: String,
});

const PaymentRequestModel = mongoose.models.Order || mongoose.model('Order', PaymentRequest);

export default PaymentRequestModel;