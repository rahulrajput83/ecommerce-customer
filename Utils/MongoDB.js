import mongoose from "mongoose";

const MongoDBConnect = async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_DB);
}

export default MongoDBConnect;