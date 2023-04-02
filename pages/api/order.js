import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"
import PaymentRequestModel from "@/Model/PaymentRequest"


const handler = async (req, res) => {
    if (req.method !== 'GET') {
        res.json({ message: 'Only GET requests allowed.' })
    }
    try {
        await MongoDBConnect();
        let responseData = await PaymentRequestModel.findOne({ _id: req.user.id })
        /* Construct Account Data */
        const data = {
            name: decryptFullName,
            email: decryptEmail,
            type: decryptType,
            number: decryptNumber,
            address: decryptAddress,
            id: responseData._id
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.json({ message: 'Success', value: ciphertext})

    } catch (error) {
        console.log(error)
        res.json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);