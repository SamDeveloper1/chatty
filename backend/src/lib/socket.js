import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", ENV.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.use(socketAuthMiddleware);

const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId?.toString()];
}

io.on("connection", (socket) => {
  const userId = socket.userId;
  const userName = socket.user?.fullName || "Unknown";

  console.log(`[Socket] Connected: ${userName} (${userId})`);

  if (userSocketMap[userId]) {
    console.log(`[Socket] Replacing old socket for ${userName}`);
  }
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ─── Typing Indicator (Feature 1) ─────────────────────────────────────────

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId: userId });
    }
  });

  // ─── Read Receipts (Feature 2) ────────────────────────────────────────────
  // No new socket events needed here!
  // The HTTP route PUT /api/messages/read/:senderId handles the DB update
  // and emits "messagesRead" to the sender directly from the controller.
  // This keeps socket.js clean — sockets are only for real-time forwarding,
  // not for DB operations.

  // ──────────────────────────────────────────────────────────────────────────

  socket.on("error", (err) => {
    console.error(`[Socket] Error for ${userName}:`, err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket] Disconnected: ${userName} — ${reason}`);
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };