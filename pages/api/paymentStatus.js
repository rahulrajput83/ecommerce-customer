import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import Insta from "@/Utils/InstamojoConfig"
import PaymentRequestModel from "@/Model/PaymentRequest"
import moment from "moment"


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
  }
  try {
    const { id, request } = JSON.parse(req.body);
    await MongoDBConnect();
    Insta.getPaymentDetails(request, id, async function (error, response) {
      if (error) {
        res.json({ message: error })
      } else {
        const { status } = response.payment_request.payment;
        console.log(status)
        if (status === 'Credit') {
          const date = moment().add(5, 'days').format('dddd, Do MMMM.');
          await PaymentRequestModel.updateOne({ paymentID: request }, { $set: { paymentStatus: true, deliveryDate: date } })
          res.json({ message: 'Success', status: 'Paid' })
        }
        else {
          res.json({ message: 'Success', status: 'Failed' })
        }
        res.json({ message: response })
      }
    });

  } catch (error) {
    res.json({ message: 'Error, please try again...' })
  }
}


export default handler;