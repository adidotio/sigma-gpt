🚀 Sigma-GPT

A fully hand-coded MERN stack ChatGPT clone featuring a custom frontend and backend, real-time AI-powered conversations, and a scalable, production-ready architecture.

📌 Overview

Sigma-GPT is a full-stack AI chat application inspired by ChatGPT, built completely from scratch using the MERN stack.
The project focuses on clean architecture, real-world backend patterns, and a custom UI, making it ideal for learning, experimentation, and real-world scalability.

Unlike template-based clones, every component — frontend, backend, APIs, and logic — is hand-written.

🛠 Tech Stack
Frontend

React (Vite)

Context API for state management

Custom UI Components

CSS Modules

Backend

Node.js

Express.js

MongoDB + Mongoose

REST APIs

Session & Thread Management

AI Integration

AI response generation using a custom utility layer (Gemini/OpenAI-style abstraction)

✨ Features

🔹 Real-time chat interface

🔹 Thread-based conversation system

🔹 Persistent chat history (MongoDB)

🔹 Custom-built frontend UI

🔹 Clean API separation

🔹 Scalable backend architecture

🔹 Fully hand-coded (no boilerplates)

📁 Project Structure
sigma-gpt/
│
├── Backend/
│   ├── models/
│   │   └── Thread.js
│   ├── routes/
│   │   └── chat.js
│   ├── utils/
│   │   └── geminiRes.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MyContext.jsx
│   │   └── assets/
│   ├── index.html
│   └── vite.config.js
│
└── .gitignore

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/TsTarK85/sigma-gpt.git
cd sigma-gpt

2️⃣ Backend Setup
cd Backend
npm install


Create a .env file inside Backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string


Run backend:

npm start

3️⃣ Frontend Setup
cd Frontend
npm install
npm run dev

🔗 API Flow (High Level)

Frontend sends user message

Backend processes request

AI utility generates response

Chat thread saved in MongoDB

Response returned to frontend

🧠 Learning Objectives

Full-stack MERN architecture

Backend API design

State management in React

Database modeling for chat systems

Clean Git workflow

Real-world project structuring

🚧 Future Improvements

🔹 Authentication (JWT / OAuth)

🔹 Custom theme

🔹 User profiles + Settings Page

🔹 Message search

🔹 Deployment (Docker + CI/CD)

📜 License

This project is open-source and available for learning and experimentation.

👤 Author

Aditya Vinayak Singh

Full-Stack Developer (MERN)

AI & Systems Enthusiast

⭐ If you find this project useful, consider giving it a star on GitHub!
