<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=Welcome+to+StreamChat+%F0%9F%9A%80;Real-Time+Chat+%E2%80%A2+Built+with+%E2%9D%A4%EF%B8%8F;Fast+%E2%80%A2+Secure+%E2%80%A2+Beautiful" alt="Typing SVG" />

<br/>

<h1>💬 StreamChat — Real-Time Messaging, Reimagined</h1>

<p align="center">
  <strong>A full-stack, production-ready chat application built from the ground up with modern web technologies.</strong><br/>
  Authentication, real-time messaging, image sharing, and beautiful UI — all in one place.
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white" />
</p>

<br/>

> *"Built not just to work — but to impress."*

</div>

---

## 🖼️ App Preview

<div align="center">
  <img src="/frontend/public/readme image.png" alt="StreamChat Preview" width="90%" style="border-radius: 12px;" />
</div>

---

## 🌟 Why StreamChat?

I built **StreamChat** because I wanted to go beyond tutorials — this is a **real-world, production-grade** application. Every feature was deliberately chosen to mirror what modern chat platforms offer, from JWT-secured auth to WebSocket-powered real-time updates.

Whether you're a developer exploring the codebase or a recruiter evaluating my skills — **this project speaks for itself.** 🙌

---

## ✨ Features at a Glance

| 🚀 Feature | 📝 Description |
|---|---|
| 🔐 **Custom JWT Auth** | Secure login/signup with no 3rd-party dependencies |
| ⚡ **Real-Time Messaging** | Instant message delivery via Socket.io |
| 🟢 **Online Presence** | See who's online or offline in real-time |
| 🔔 **Smart Notifications** | Sound alerts for messages & typing — with mute toggle |
| 📨 **Welcome Emails** | Beautiful onboarding emails via Resend |
| 🖼️ **Image Uploads** | Cloudinary-powered media sharing |
| 🚦 **Rate Limiting** | Arcjet-powered API protection |
| 🎨 **Modern UI** | React + Tailwind CSS + DaisyUI for a stunning interface |
| 🧠 **State Management** | Clean global state with Zustand |
| 🗄️ **Persistent Storage** | MongoDB for reliable data management |

---

## 🏗️ Tech Stack

```
📦 StreamChat
├── 🖥️  Frontend     → React, Tailwind CSS, DaisyUI, Zustand
├── 🔧  Backend      → Node.js, Express.js, REST API
├── 🗄️  Database     → MongoDB (Mongoose ODM)
├── 🔌  Real-Time    → Socket.io (WebSockets)
├── 🔐  Auth         → Custom JWT (no 3rd-party auth)
├── 📨  Email        → Resend API
├── 🖼️  Media        → Cloudinary
└── 🛡️  Security    → Arcjet Rate Limiting
```

---

## 📁 Project Structure

```bash
streamchat/
│
├── 📂 backend/
│   ├── 📂 controllers/       # Route logic
│   ├── 📂 models/            # Mongoose schemas
│   ├── 📂 routes/            # Express routes
│   ├── 📂 middleware/        # Auth & error handlers
│   ├── 📂 lib/               # Socket.io, DB, utils
│   └── 📄 server.js          # Entry point
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable UI components
│   │   ├── 📂 pages/         # App pages/views
│   │   ├── 📂 store/         # Zustand state stores
│   │   └── 📂 lib/           # Axios, helpers
│   └── 📄 index.html
│
└── 📄 README.md
```

---

## ⚙️ Getting Started

### 📋 Prerequisites

- Node.js `v18+`
- MongoDB URI (local or Atlas)
- Cloudinary account
- Resend account
- Arcjet account

---

### 🔧 Backend Setup

**1. Navigate to backend & install dependencies**
```bash
cd backend
npm install
```

**2. Create a `.env` file in `/backend`**
```env
PORT=3000
MONGO_URI=your_mongo_uri_here
NODE_ENV=development

JWT_SECRET=your_super_secret_key

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=you@yourdomain.com
EMAIL_FROM_NAME=StreamChat

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

**3. Start the server**
```bash
npm run dev
```

> 🟢 Backend running at `http://localhost:3000`

---

### 💻 Frontend Setup

**1. Navigate to frontend & install dependencies**
```bash
cd frontend
npm install
```

**2. Start the dev server**
```bash
npm run dev
```

> 🟢 Frontend running at `http://localhost:5173`

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/messages/:id` | Fetch messages with a user |
| `POST` | `/api/messages/send/:id` | Send a message |

---

## 🚀 Deployment

StreamChat is optimized for **free-tier friendly deployment** via [Sevalla](https://sevalla.com).

```bash
# Build the frontend
cd frontend
npm run build

# The backend serves the built frontend in production
NODE_ENV=production npm start
```

> Set all environment variables in your hosting dashboard before deploying.

---

## 🛡️ Security Highlights

- 🔐 Passwords hashed with **bcrypt**
- 🎟️ **JWT tokens** stored in HTTP-only cookies
- 🚦 **Arcjet** rate-limits all API endpoints to prevent abuse
- 🔒 Protected routes on both client and server

---

## 🧑‍💻 Author

<div align="center">

**Built with 💜 and a lot of ☕ by [Your Name](https://github.com/yourusername)**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yourportfolio.com)

</div>

---

## ⭐ Show Some Love

If you found this project useful or impressive, a **star** goes a long way! ⭐

```
It took blood, sweat, and tears to build this.
A star takes 1 second — and means the world. 🙏
```

<div align="center">

[![Star History](https://img.shields.io/github/stars/yourusername/streamchat?style=social)](https://github.com/yourusername/streamchat)

<br/>

*Made with ❤️ — open to feedback, contributions, and coffee chats!*

</div>
