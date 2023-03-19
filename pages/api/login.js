import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.json({ message: 'Only POST requests allowed.' })
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
      return { email: decryptEmail, password: decryptPassword, type: decryptType };
    });
    let findEmail = await newData.find((e) => e.email === req.body.email);
    
    console.log(newData)
    if (findEmail !== -1) {
      res.json({ message: 'Email already registered...' })
    }
    else {
      res.json({ message: 'No Account Found...' })
    }

  } catch (error) {
    console.log(error)
    res.json({ message: 'Error, please try again...' })
  }
}


export default handler;