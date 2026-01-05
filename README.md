# Auro REST API Backend

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Hey there! 👋 This is the backend API that powers the **Auro** personal productivity application. If you're working on the Auro project or just curious about how we built the server-side magic, you're in the right place!

## DEMO LINK
 -**https://rest-api-for-auro-production.up.railway.app/api-docs

Auro is all about helping people organize their lives, track their habits, and achieve their goals. This REST API handles everything from user authentication to storing journal entries, managing tasks, and tracking personal progress. Think of it as the brain behind the Auro app that keeps all your productivity data safe and accessible.

## ✨ What Makes Auro Special

The Auro project was born from a simple idea: what if managing your life could actually be enjoyable? We wanted to create something that goes beyond basic to-do lists and calendar apps. Here's what our API enables in the Auro app:

- **Smart Authentication** - Secure user accounts with JWT tokens (because nobody wants their personal data floating around)
- **Task Management That Actually Works** - Create tasks with priorities, due dates, and track your progress without the overwhelm
- **Habit Building & Breaking** - Monitor both the good habits you want to build and the bad ones you want to kick
- **Digital Journaling** - Write about your day and track your moods (it's like having a conversation with yourself)
- **Flexible Note-Taking** - Jot down thoughts, link related notes, and attach files when you need them
- **Goal Planning** - Set big plans, break them into milestones, and actually achieve them
- **Personal Memory Bank** - Store important info and preferences that make your Auro experience uniquely yours
- **Progress Tracking** - See how you're doing over time (spoiler: you're probably doing better than you think!)
- **Full Customization** - Make Auro look and feel exactly how you want it
- **Developer-Friendly Docs** - Interactive API documentation because we know you want to tinker

## 🚀 Getting Started with the Auro Backend

Ready to run the Auro API on your machine? Let's get you set up! Don't worry, it's easier than you might think.

### What You'll Need First

- **Node.js** (version 18 or newer) - This is what runs our JavaScript on the server
- **MongoDB** - Either install it locally or grab a free account on MongoDB Atlas
- **npm or yarn** - For managing our dependencies (npm comes with Node.js)

### Setting Everything Up

**1. Get the Code**
   ```bash
   git clone https://github.com/YoussefReaper/Auro_REST_Database.git
   cd "REST Database"
   ```

**2. Install the Dependencies**
   ```bash
   npm install
   ```
   This grabs all the packages we need to make Auro work.

**3. Set Up Your Environment**
   
   Create a `.env` file in the root folder and add these variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string_here
   KEY=your_super_secret_jwt_key_here
   ```
   
   **Pro tip**: Make your JWT key something long and random. Your users' security depends on it!

**4. Fire It Up**
   ```bash
   # For development (auto-restarts when you make changes)
   npm run dev
   
   # For production
   npm start
   ```

**5. Check If Everything's Working**
   - **Main API**: `http://localhost:3000/api`
   - **Interactive Docs**: `http://localhost:3000/api-docs` (this is pretty cool, check it out!)
   - **Health Check**: `http://localhost:3000/health` (just to make sure the server is alive)

project**  
*Node.js + Express + MongoDB = A powerful foundation for personal productivity*
