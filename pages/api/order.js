import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import PaymentRequestModel from "@/Model/PaymentRequest"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await PaymentRequestModel.find({ userId: req.user.id, paymentStatus: true })
        const data = responseData.map((e) => {
            const { _id, userId, paymentStatus, products, deliveryDate, orderId, paymentDate } = e;
            return {
                id: _id,
                userId: userId,
                paymentStatus: paymentStatus,
                products: products,
                deliveryDate: deliveryDate,
                orderId: orderId,
                paymentDate: paymentDate,
            }
        })
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext })

    } catch (error) {
        res.json({ message: 'Error, please try again...', error: error })
    }
}


export default JWTAuth(handler);