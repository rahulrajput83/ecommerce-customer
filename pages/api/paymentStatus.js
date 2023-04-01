import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
  }
  try {
    const params = req.query;
    await MongoDBConnect();
    console.log(params)
    res.json({mess: req.body})

  } catch (error) {
    res.json({ message: 'Error, please try again...' })
  }
}


export default handler;