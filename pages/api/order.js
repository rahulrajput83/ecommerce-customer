import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import PaymentRequestModel from "@/Model/PaymentRequest"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await PaymentRequestModel.find({ userId: req.user.id, paymentStatus: true })
        if(responseData.length > 0) {
            responseData = responseData.reverse();
        }
        const data = responseData.map((e) => {
            const { _id, userId, paymentStatus, products, deliveryDate, orderId, paymentDate, grandTotal, deliveredDate, deliveryStatus } = e;
            return {
                id: _id,
                userId: userId,
                paymentStatus: paymentStatus,
                products: products,
                deliveryDate: deliveryDate,
                orderId: orderId,
                paymentDate: paymentDate,
                deliveredDate: deliveredDate,
                deliveryStatus: deliveryStatus,
                grandTotal: grandTotal
            }
        })
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);