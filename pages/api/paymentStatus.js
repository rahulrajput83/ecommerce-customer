import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import Insta from "@/Utils/InstamojoConfig"
import PaymentRequestModel from "@/Model/PaymentRequest"


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
  }
  try {
    const { id, request, time } = JSON.parse(req.body);
    await MongoDBConnect();
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
            res.json({ message: 'Success', status: 'Paid', payment: response.payment_request.modified_at })
          }
          else {
            res.json({ message: 'Failed', status: 'failed', failedMessage: failure })
          }
        }
      }
    });

  } catch (error) {
    res.json({ message: 'Error, please try again...' })
  }
}


export default handler;