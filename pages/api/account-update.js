import MongoDBConnect from "@/Utils/MongoDB"
import RegisterModel from "@/Model/User"
import CryptoJS from 'crypto-js'
import JWTAuth from "@/Utils/JWTAuth"


const handler = async (req, res) => {
    if (req.method !== 'PUT') {
        res.json({ message: 'Only PUT requests allowed.' })
    }
    try {
        const { field, data } = req.body;
        await MongoDBConnect();
        let updateField = field === 'name' ? 'fullName' : field === 'email' ? 'email' : field === 'number' ? 'mobileNumber' : 'DeliveryAddress';
        
        let update = CryptoJS.AES.encrypt(data ? data : 'Empty', process.env.JWT).toString();
        await RegisterModel.updateOne({ _id: req.user.id }, { $set: { [updateField]: update } })
        res.json({ message: 'Success' })

    } catch (error) {
        res.json({ message: 'Error, please try again...' })
    }
}


export default JWTAuth(handler);