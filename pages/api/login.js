import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import jwt from 'jsonwebtoken'


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' })
  }
  try {
    await MongoDBConnect();
    let responseData = await RegisterModel.find({})
    let newData = await responseData.map(element => {
      let bytesEmail = CryptoJS.AES.decrypt(element.email, process.env.JWT);
      let decryptEmail = bytesEmail.toString(CryptoJS.enc.Utf8);
      let bytesPassword = CryptoJS.AES.decrypt(element.password, process.env.JWT);
      let decryptPassword = bytesPassword.toString(CryptoJS.enc.Utf8);
      let bytesType = CryptoJS.AES.decrypt(element.type, process.env.JWT);
      let decryptType = bytesType.toString(CryptoJS.enc.Utf8);
      let bytesCity = CryptoJS.AES.decrypt(element.city, process.env.JWT);
      let decryptCity = bytesCity.toString(CryptoJS.enc.Utf8);
      return { _id: element._id, email: decryptEmail, password: decryptPassword, type: decryptType, city: decryptCity };
    });
    let findEmail = await newData.find((e) => e.email === req.body.email);
    if (findEmail !== -1) {
      if (findEmail.password === req.body.password) {
        const token = await jwt.sign({ id: findEmail._id, email: findEmail.email, type: findEmail.type, city: findEmail.city }, process.env.JWT);
        res.json({ message: 'Successfully Login...', token: token })
      }
      else {
        res.json({ message: 'Invalid Email/Password...' })
      }

    }
    else {
      res.json({ message: 'No Account Found...' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error, please try again...' })
  }
}


export default handler;