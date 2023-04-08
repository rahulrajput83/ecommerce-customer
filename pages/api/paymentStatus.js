import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import Insta from "@/Utils/InstamojoConfig"
import PaymentRequestModel from "@/Model/PaymentRequest"
import CartModel from "@/Model/Cart"
import JWTAuth from "@/Utils/JWTAuth"


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
  }
  try {
    const { id, request, time } = req.body.data;
    await MongoDBConnect();
    console.log(req.body)
    Insta.getPaymentDetails(request, id, async function (error, response) {
      if (error) {
        res.json({ message: error })
      } else {
        if (response.message === 'Not found') {
          response.status = 'Invalid'
          res.json(response)
        }
        else {
          const { status, failure } = response.payment_request.payment;
          if (status === 'Credit') {
            await PaymentRequestModel.updateOne({ paymentID: request }, { $set: { paymentStatus: true, paymentDate: response.payment_request.modified_at, deliveryDate: time, orderId: response.payment_request.payment.payment_id} })
            await CartModel.updateMany({ userId: req.user.id }, { $set: { paid: true} })
            let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({status: 'Paid', payment: response.payment_request.modified_at}), process.env.JWT).toString();
            res.json({ message: 'Success', value: ciphertext})
          }
          else {
            let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({status: 'failed', failedMessage: failure}), process.env.JWT).toString();
            res.json({ message: 'Failed', value: ciphertext })
          }
        }
      }
    });

  } catch (error) {
    console.log(error)
    res.json({ message: 'Error, please try again...' })
  }
}


export default JWTAuth(handler);