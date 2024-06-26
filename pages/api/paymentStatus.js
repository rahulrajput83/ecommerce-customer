import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import Insta from "@/Utils/InstamojoConfig"
import PaymentRequestModel from "@/Model/PaymentRequest"
import CartModel from "@/Model/Cart"
import JWTAuth from "@/Utils/JWTAuth"


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' })
  }
  try {
    const { id, request, time } = req.body.data;
    await MongoDBConnect();
    Insta.getPaymentDetails(request, id, async function (error, response) {
      if (error) {
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ status: 'Error' }), process.env.JWT).toString();
        res.status(400).json({ message: 'Success', value: ciphertext })
      } else {
        if (response.message && response.message.startsWith('Not found')) {
          let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ status: 'Not Found' }), process.env.JWT).toString();
          res.json({ message: 'Success', value: ciphertext })
        }
        else {
          const { status, failure } = response.payment_request.payment;
          if (status === 'Credit') {
            await PaymentRequestModel.updateOne({ paymentID: request }, { $set: { paymentStatus: true, paymentDate: response.payment_request.modified_at, deliveryDate: time, orderId: response.payment_request.payment.payment_id } })
            await CartModel.updateMany({ userId: req.user.id }, { $set: { paid: true } })
            let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ status: 'Paid', payment: response.payment_request.modified_at }), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
          }
          else {
            let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ status: 'failed', failedMessage: failure }), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext })
          }
        }
      }
    });

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error, please try again...' })
  }
}


export default JWTAuth(handler);