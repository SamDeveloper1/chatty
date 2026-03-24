# 🚀 Streamchat – Real-Time Full-Stack Chat Application

<h1 align="center">💬 Streamchat – Connect Instantly, Chat Seamlessly</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socket.io" />
</p>

---



## ✨ Features

* 🔐 **Secure JWT Authentication** (No third-party auth)
* ⚡ **Real-Time Messaging** powered by Socket.io
* 🟢 **Online / Offline Presence Tracking**
* 🔔 **Typing Indicators & Notification Sounds**
* 📨 **Automated Welcome Emails** on signup
* 🖼️ **Image Uploads** via Cloudinary
* 🧰 **RESTful API** using Node.js & Express
* 🧱 **MongoDB Database** for persistence
* 🚦 **Rate Limiting & Security** with Arcjet
* 🎨 **Modern UI** with React, Tailwind CSS & DaisyUI
* 🧠 **Global State Management** using Zustand
* 🧑‍💻 **GitHub Workflow Ready** (PRs, branches, merges)
* 🚀 **Deployment Friendly** (works on free-tier platforms)

---

## 🏗️ Tech Stack

### Frontend

* ⚛️ React
* 🎨 Tailwind CSS + DaisyUI
* 🧠 Zustand

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🔌 Socket.io

### Database & Services

* 🍃 MongoDB
* ☁️ Cloudinary (media uploads)
* 📧 Resend (email service)
* 🛡️ Arcjet (rate limiting & protection)

---

## 📂 Project Structure

```
streamchat/
│
├── backend/        # Express server & APIs
├── frontend/       # React client app
├── README.md
└── ...
```

---

## ⚙️ Environment Setup

### 📌 Backend (`/backend`)

Create a `.env` file inside the backend folder:

```
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

---

## ▶️ Running the Project

### 🔧 Start Backend

```
cd backend
npm install
npm run dev
```

---

### 💻 Start Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

You can deploy this project easily using:

* 🟣 Vercel (Frontend)
* 🟢 Render / Railway (Backend)
* 🍃 MongoDB Atlas (Database)

---

💡 **Streamchat** is built to demonstrate scalable real-time communication with modern full-stack technologies.
