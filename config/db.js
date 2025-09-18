import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("database connected successfully")
    }catch(error){
        console.log("error in db.js", error)
    }
}

export default connectDB;