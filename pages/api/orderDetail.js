import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import PaymentRequestModel from "@/Model/PaymentRequest"


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await PaymentRequestModel.findOne({ _id: req.body.data.id, paymentStatus: true })
        const { _id, userId, tax, receivedBy, fullName, deliveredBy, deliveredDate, paymentURL, grandTotal, deliveryStatus, shippingCharges, paymentID, subTotal, DeliveryAddress, mobileNumber, email, paymentStatus, products, deliveryDate, orderId, paymentDate } = responseData;
        const data = {
            id: _id,
            userId: userId,
            paymentStatus: paymentStatus,
            products: products,
            email: email,
            mobileNumber: mobileNumber,
            DeliveryAddress: DeliveryAddress,
            deliveryDate: deliveryDate,
            orderId: orderId,
            paymentDate: paymentDate,
            paymentID: paymentID,
            subTotal: subTotal,
            shippingCharges: shippingCharges,
            tax: tax,
            fullName: fullName,
            grandTotal: grandTotal,
            deliveryStatus: deliveryStatus,
            paymentURL: paymentURL,
            deliveredDate: deliveredDate,
            deliveredBy: deliveredBy,
            receivedBy: receivedBy,
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext })

    } catch (error) {
        console.log(error)
        res.json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);