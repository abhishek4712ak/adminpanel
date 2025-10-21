import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb+srv://abhishek4712ak_db_user:TZbpuE6htfJYVZ6J@zest.k8zstju.mongodb.net/?retryWrites=true&w=majority&appName=zest");
        console.log("database connected successfully")
    }catch(error){
        console.log("error in db.js", error)
    }
}

export default connectDB;
