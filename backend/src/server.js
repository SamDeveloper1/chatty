import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.routes.js";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // to parse incoming requests with json payloads (from req.body)
app.use(cookieParser());
app.use(cors({ origin:[ ENV.CLIENT_URL, "http://localhost:5173"], credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
