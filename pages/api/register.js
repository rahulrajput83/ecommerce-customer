import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'


const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests allowed.' })
  }
  try {
    await MongoDBConnect();
    let responseData = await RegisterModel.find({})
    let newData = await responseData.map(element => {
      let bytes = CryptoJS.AES.decrypt(element.email, process.env.JWT);
      let descryptEmail = bytes.toString(CryptoJS.enc.Utf8);
      return { email: descryptEmail };
    });
    let findEmail = await newData.findIndex((e) => e.email === req.body.email);
    if (findEmail !== -1) {
      res.json({ message: 'Email already registered...' })
    }
    else {
      let email = CryptoJS.AES.encrypt(req.body.email, process.env.JWT).toString();
      let password = CryptoJS.AES.encrypt(req.body.password, process.env.JWT).toString();
      let type = CryptoJS.AES.encrypt(req.body.type, process.env.JWT).toString();
      let city = CryptoJS.AES.encrypt(req.body.city, process.env.JWT).toString();
      const createNewUser = new RegisterModel({
        email: email,
        password: password,
        type: type,
        city: city,
      });
      await createNewUser.save();
      res.json({ message: 'Successfully registered...' })
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error, please try again...' })
  }
}


export default handler;