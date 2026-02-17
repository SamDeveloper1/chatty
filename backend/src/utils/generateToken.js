import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId}, ENV.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: ENV.NODE_ENV!="development"
    });
    return token;

}
export default generateTokenAndSetCookie;