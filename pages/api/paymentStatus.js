import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'
import Insta from "@/Utils/InstamojoConfig"


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
  }
  try {
    const { id, request } = req.body;
    await MongoDBConnect();
    Insta.getPaymentDetails(request, id, function (error, response) {
      if (error) {
        res.json({ message: error })
      } else {
        res.json({ message: response })
      }
    });

  } catch (error) {
    res.json({ message: 'Error, please try again...' })
  }
}


export default handler;