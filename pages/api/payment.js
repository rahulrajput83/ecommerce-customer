import PaymentRequestModel from '@/Model/PaymentRequest';
import MongoDBConnect from '@/Utils/MongoDB';

const Insta = require('instamojo-nodejs');
Insta.setKeys(process.env.INSTA_API_KEY, process.env.INSTA_SECRET_KEY)
Insta.isSandboxMode(true);


const payment = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'Only POST requests allowed' })
            return
        }
        await MongoDBConnect();
        const { amount, purpose, redirect, email, number, name, product, id, address } = JSON.parse(req.body);
        const data = new Insta.PaymentData();
        data.purpose = purpose;
        data.amount = amount;
        data.buyer_name = name;
        data.email = email;
        data.phone = number;
        data.send_sms = false;
        data.send_email = true;
        data.allow_repeated_payments = false;
        data.webhook = 'https://rahulrajput83-ecommerce.vercel.app/api/paymentStatus';
        data.redirect_url = redirect;
        Insta.createPayment(data, async(err, instaResponse) => {
            if (err) {
                res.json({ message: 'Error, please try again...' })
            }
            else {
                let paymentResponse = await JSON.parse(instaResponse)
                if(paymentResponse.success){
                    const newPayment = new PaymentRequestModel({
                        paymentStatus: false,
                        userId: id,
                        fullName: name,
                        email: email,
                        mobileNumber: number,
                        DeliveryAddress: address,
                        products: product,
                        paymentURL: paymentResponse.payment_request.longurl,
                        paymentID: paymentResponse.payment_request.id,
                    })
                    await newPayment.save();
                    res.json({ message: 'Success', data: paymentResponse.payment_request.longurl })
                }
                else{
                    res.json({ message: 'Error, please try again...' })
                }
                
            }
        });


    } catch (error) {
        console.log(error)
        res.json({ message: 'Error, please try again...' })
    }
}

export default payment