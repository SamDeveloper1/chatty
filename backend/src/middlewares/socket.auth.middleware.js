import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // ─── Extract JWT from http-only cookie ──────────────────────────────────
    // Socket.IO sends cookies via the handshake headers, not via document.cookie
    const rawCookie = socket.handshake.headers.cookie || "";

    // ✅ FIX: More robust cookie parser — handles URL-encoded values and edge cases
    const parseCookie = (cookieString, name) => {
      const match = cookieString
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${name}=`));
      if (!match) return null;
      return decodeURIComponent(match.substring(name.length + 1));
    };

    const token = parseCookie(rawCookie, "jwt");

    if (!token) {
      console.warn(
        `[SocketAuth] Rejected connection from ${socket.handshake.address}: No JWT cookie`
      );
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // ─── Verify Token ────────────────────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (jwtError) {
      // Differentiate between expired and invalid tokens for better debugging
      if (jwtError.name === "TokenExpiredError") {
        console.warn(`[SocketAuth] Rejected: Token expired`);
        return next(new Error("Unauthorized - Token Expired"));
      }
      console.warn(`[SocketAuth] Rejected: Invalid token — ${jwtError.message}`);
      return next(new Error("Unauthorized - Invalid Token"));
    }

    if (!decoded?.userId) {
      console.warn(`[SocketAuth] Rejected: Token payload missing userId`);
      return next(new Error("Unauthorized - Malformed Token"));
    }

    // ─── Load User from DB ───────────────────────────────────────────────────
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn(`[SocketAuth] Rejected: User not found for id ${decoded.userId}`);
      return next(new Error("Unauthorized - User Not Found"));
    }

    // ─── Attach to Socket ────────────────────────────────────────────────────
    // ✅ FIX: Always store userId as a plain string to ensure consistent
    // map lookups in userSocketMap (avoids ObjectId vs string mismatch)
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `[SocketAuth] Authenticated: ${user.fullName} (${socket.userId})`
    );

    next();
  } catch (error) {
    console.error("[SocketAuth] Unexpected error:", error.message);
    next(new Error("Unauthorized - Authentication Failed"));
  }
};