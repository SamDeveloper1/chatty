import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";
const protectRoute = async(req,res,next)=>{
    try {
      const token = req.cookies.jwt;
      if(!token){
        return res.status(401).json({message: "Unauthorized- No Token provided"})
      }
      const decoded = jwt.verify(token,ENV.JWT_SECRET);
      if(!decoded){
        return res.status(401).json({message: "Unauthorized- Invalid Token"})
      }
      const user = await User.findById(decoded.userId).select("-password");
      if(!user){
        return res.status(401).json({message: "User not found"})
      }
      req.user = user;
      next();
      
    
    } catch (error) {
        console.log("Error in protect Route Controller",error);
        res.status(500).json({message: "Internal Server error"})
    }
};
export default protectRoute;