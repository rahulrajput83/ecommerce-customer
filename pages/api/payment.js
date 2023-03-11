const Insta = require('instamojo-nodejs');
Insta.setKeys(process.env.INSTA_API_KEY, process.env.INSTA_SECRET_KEY)
Insta.isSandboxMode(true);


const payment = (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'Only POST requests allowed' })
            return
        }
        const { amount, purpose, redirect, email, number, name } = JSON.parse(req.body);
        console.log(amount)
        const data = new Insta.PaymentData();
        data.purpose = purpose;
        data.amount = amount;
        data.buyer_name = name;
        data.email = email;
        data.phone = number;
        data.send_sms = false;
        data.send_email = false;
        data.allow_repeated_payments = false;
        data.webhook = redirect;
        data.redirect_url = redirect;
        Insta.createPayment(data, (err, instaResponse) => {
            if (err) {
                res.json({ message: 'Error, please try again...' })
            }
            else {
                res.json({ message: 'Success', data: JSON.parse(instaResponse) })
            }
        });


    } catch (error) {
        res.json({ message: 'Error, please try again...' })
    }
}

export default payment