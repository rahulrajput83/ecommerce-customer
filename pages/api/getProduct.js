import MongoDBConnect from "@/Utils/MongoDB"
import CryptoJS from 'crypto-js'
import ProductModel from "@/Model/Products";


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'Only POST requests allowed.' })
    }
    try {
        await MongoDBConnect();
        const { title, Category, Price, productOrder } = JSON.parse(req.body);
        console.log(title, Category, Price, productOrder)
        let data = await ProductModel.find({})
        if (title) {
            data = data.filter((e) => { return (e.category.toLowerCase().includes(title.toLowerCase()) || e.brand.toLowerCase().includes(title.toLowerCase()) || e.title.toLowerCase().includes(title.toLowerCase())) })
        }
        if (Category) {
            data = data.filter((e) => e.category == Category)
        }
        if (Price) {
            if (Price === 'Under ₹1,000') {
                data = data.filter((e) => e.price <= 1000)
            }
            else if (Price === '₹1,000 - ₹5,000') {
                data = data.filter((e) => 1000 <= e.price && e.price <= 5000)
            }
            else if (Price === '₹5,000 - ₹10,000') {
                data = data.filter((e) => 5000 <= e.price && e.price <= 10000)
            }
            else {
                data = data.filter((e) => e.price >= 10000)
            }
        }
        if (productOrder) {
            if (productOrder === 'Low to High') {
                data = data.sort((a, b) => a.price - b.price)
            }
            else{
                data = data.sort((a, b) => b.price - a.price)
            }
        }
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.JWT).toString();
        res.status(200).json({ message: 'Success', value: ciphertext })
    } catch (error) {
        res.status(400).json({ message: 'Error, please try again...' })
    }
}


export default handler;