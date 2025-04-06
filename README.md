# 🧠 AI-Powered Interview Preparation Platform

A full-stack web application to simulate job interviews using AI, track your performance, and improve over time with real-time feedback and detailed analytics.

---

## 🚀 Features

- ✅ **AI-Powered Interview Simulation**
- 🔐 Secure **Authentication** using JWT
- 📊 Personalized **Dashboard** with performance metrics
- 🧠 Real-time **Feedback and Scoring** from Gemini AI
- 📂 **History Page** with past interviews, scores, and insights
- ✨ Smooth, responsive **UI** built with React + Tailwind
- 🔁 Protected Routes, Error Handling, and Notifications

---

## 🛠️ Tech Stack

### Frontend
- **React** (with React Router, Hooks)
- **Tailwind CSS**
- **React Query**
- **React Hot Toast**

### Backend
- **Node.js** + **Express.js**
- **JWT Authentication**
- **Gemini AI API** integration
- **MongoDB** with **Mongoose**

---

## 🧱 Architecture

### Client-Side (React)
- App → Layout → Pages → Components Global state → AuthContext
- Local state → UI Interactions
  
### Server-Side (Express)
- Request → Auth Middleware → Route → Controller → Response

### Database
- **User Schema**: email, password (hashed), interview history
- **Interview Schema**: question, answer, feedback, score, timestamp

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/adarsh-naik-2004/interview-platform.git
cd interview-prep-platform
```
### 2. Setup the Backend
```bash
cd server
npm install
# Create a .env file and add:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key
# FRONTEND_URL=your_frontend_url
npm start
```
### 3. Setup the Frontend
```bash 
cd client
npm install
npm run dev
```
## 🧪 Future Enhancements
- 🎙️ Voice input with Speech-to-Text

- 📊 Company-specific questions

- 🏆 Leaderboard & user profiles

- ⏱️ Time tracking per question
