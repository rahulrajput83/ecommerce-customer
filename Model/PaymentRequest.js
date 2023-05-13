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
    packedBy: String,
    city: String,
    deliveryStatus: Boolean,
    deliveredDate: String,
    deliveredBy: String,
    receivedBy: String,
    acceptStatus: Boolean,
    acceptBy: String,
    acceptOn: String,
});

const PaymentRequestModel = mongoose.models.Order || mongoose.model('Order', PaymentRequest);

export default PaymentRequestModel;