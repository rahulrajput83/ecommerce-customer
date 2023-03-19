import mongoose from "mongoose";

const Register = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    type: String,
    mobileNumber: Number,
    DeliveryAddress: String,
    
});

const RegisterModel = mongoose.models.UserData || mongoose.model('UserData', Register);

export default RegisterModel;