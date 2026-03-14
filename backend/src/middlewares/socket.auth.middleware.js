import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {

    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      console.log("Socket connection rejected: No cookies found");
      return next(new Error("Unauthorized - No cookies"));
    }

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No token provided"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("Unauthorized - User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName}`);

    next();

  } catch (error) {
    console.log("Socket authentication error:", error.message);
    next(new Error("Unauthorized"));
  }
};