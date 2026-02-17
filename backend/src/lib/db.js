import mongoose from "mongoose";
import { ENV } from "./env";
export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(ENV.MONGO_URI)
    console.log("MONGODB CONNECTED");

    } catch(err){
        console.error("Error connection to MONGODB",err);
        process.exit(1); // 1 status code means fail 0 means success
    }
    
}