import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb+srv://abhishek4712ak1_db_user:2mBJMySRZVGT9ohw@cluster0.t5tthny.mongodb.net/ADMIN?appName=Cluster0");
        console.log("database connected successfully")
    }catch(error){
        console.log("error in db.js", error)
    }
}

export default connectDB;
