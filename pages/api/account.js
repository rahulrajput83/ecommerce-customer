import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await RegisterModel.findOne({ _id: req.user.id })
        let bytesEmail = responseData.email ? CryptoJS.AES.decrypt(responseData.email, process.env.JWT) : '';
        let decryptEmail = bytesEmail ? bytesEmail.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesType = responseData.type ? CryptoJS.AES.decrypt(responseData.type, process.env.JWT) : '';
        let decryptType = bytesType ? bytesType.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesFullName = responseData.fullName ? CryptoJS.AES.decrypt(responseData.fullName, process.env.JWT) : '';
        let decryptFullName = bytesFullName ? bytesFullName.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesNumber = responseData.mobileNumber ? CryptoJS.AES.decrypt(responseData.mobileNumber, process.env.JWT) : '';
        let decryptNumber = bytesNumber ? bytesNumber.toString(CryptoJS.enc.Utf8) : 'Empty';
        let bytesAddress = responseData.DeliveryAddress ? CryptoJS.AES.decrypt(responseData.DeliveryAddress, process.env.JWT) : '';
        let decryptAddress = bytesAddress ? bytesAddress.toString(CryptoJS.enc.Utf8) : 'Empty';
        /* Construct Account Data */
        const data = [{
            name: decryptFullName,
            email: decryptEmail,
            type: decryptType,
            number: decryptNumber,
            address: decryptAddress
        }]
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext})

    } catch (error) {
        console.log(error)
        res.json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);