import PaymentRequestModel from '@/Model/PaymentRequest';
import Insta from '@/Utils/InstamojoConfig';
import JWTAuth from '@/Utils/JWTAuth';
import MongoDBConnect from '@/Utils/MongoDB';
import CryptoJS from 'crypto-js'


const payment = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'Only POST requests allowed' })
            return
        }
        await MongoDBConnect();
        const { amount, purpose, redirect, email, tax, grandTotal, subTotal, number, name, product, id, address, shippingCharges } = req.body.data;
        const data = new Insta.PaymentData();
        data.purpose = purpose;
        data.amount = amount;
        data.buyer_name = name;
        data.email = email;
        data.phone = number;
        data.send_sms = false;
        data.send_email = true;
        data.allow_repeated_payments = false;
        data.redirect_url = redirect;
        Insta.createPayment(data, async (err, instaResponse) => {
            if (err) {
                res.json({ message: 'Error, please try again...' })
            }
            else {
                let paymentResponse = await JSON.parse(instaResponse)
                if (paymentResponse.success) {
                    let nameEncrypt = CryptoJS.AES.encrypt(name, process.env.JWT).toString();
                    let emailEncrypt = CryptoJS.AES.encrypt(email, process.env.JWT).toString();
                    let mobileEncrypt = CryptoJS.AES.encrypt(number, process.env.JWT).toString();
                    let deliveryEncrypt = CryptoJS.AES.encrypt(address, process.env.JWT).toString();
                    const newPayment = new PaymentRequestModel({
                        paymentStatus: false,
                        userId: id,
                        fullName: nameEncrypt,
                        email: emailEncrypt,
                        mobileNumber: mobileEncrypt,
                        DeliveryAddress: deliveryEncrypt,
                        products: product,
                        paymentURL: paymentResponse.payment_request.longurl,
                        paymentID: paymentResponse.payment_request.id,
                        shippingCharges: shippingCharges,
                        tax: tax,
                        grandTotal: grandTotal,
                        subTotal: subTotal,
                        deliveryStatus: false

                    })
                    await newPayment.save();
                    let ciphertext = CryptoJS.AES.encrypt(JSON.stringify({link: paymentResponse.payment_request.longurl}), process.env.JWT).toString();
                    res.json({ message: 'Success', value: ciphertext})
                }
                else {
                    res.json({ message: 'Error, please try again...' })
                }

            }
        });


    } catch (error) {
        res.json({ message: 'Error, please try again...' })
    }
}

export default JWTAuth(payment)