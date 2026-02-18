import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.routes.js";
import { ENV } from "./lib/env.js";
import {connectDB} from "./lib/db.js";

const PORT = ENV.PORT || 3000;

const __dirname = path.resolve();

const app = express();


app.use(express.json())// to parse incoming requests with json payloads (from req.body)
app.use(cookieParser());
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);
if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.use("*", (_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
})