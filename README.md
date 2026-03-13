# 🌐 SocialSphere — Full Stack Social Media Application

<div align="center">

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

A modern, full-stack social media platform built with **Java Spring Boot** and **React.js** — featuring user authentication, image posting, personalized feeds, and social connections.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Endpoints](#-api-endpoints) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure registration and login with session management |
| 📸 **Image Posts** | Create posts with drag-and-drop image upload and captions |
| 📰 **Personalized Feed** | See posts from people you are connected with |
| 🤝 **Connections** | Send and remove connections with other users |
| 👤 **User Profile** | View and edit your profile information and photo |
| 📱 **Responsive UI** | Works seamlessly on desktop and mobile |
| 🌙 **Dark Theme** | Modern dark UI with glassmorphism design |

---

## 🛠 Tech Stack

### Backend
- **Java 17** — Core programming language
- **Spring Boot 3.2** — Backend framework
- **Spring Data JPA / Hibernate** — ORM and database layer
- **MySQL** — Relational database
- **Spring MVC** — REST API and MVC architecture
- **Thymeleaf** — Server-side templating (original)
- **Maven** — Build and dependency management

### Frontend
- **React 18** — UI library
- **React Router v6** — Client-side routing with protected routes
- **Axios** — HTTP client for API calls
- **Vite** — Fast frontend build tool with dev proxy
- **Lucide React** — Icon library
- **CSS3** — Custom design system with variables and animations
- **Context API** — Global auth state management

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [Maven](https://maven.apache.org/download.cgi)
- [Node.js v20+](https://nodejs.org/en/download)
- [MySQL](https://dev.mysql.com/downloads/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/darshanmn2001/SocialSphere.git
cd socialsphere
```

---

### 2️⃣ Set Up the Database

Open MySQL and create the database:

```sql
CREATE DATABASE social_db;
```

---

### 3️⃣ Configure the Backend

Open `src/main/resources/application.properties` and update your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/social_db
spring.datasource.username=root
spring.datasource.password=your_password
server.port=8084
```

---

### 4️⃣ Run the Spring Boot Backend

```bash
./mvnw spring-boot:run
```

Backend will start at → **http://localhost:8084**

---

### 5️⃣ Run the React Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at → **http://localhost:3000**

> 💡 The Vite dev server automatically proxies all `/api/*` requests to the Spring Boot backend — no extra configuration needed.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/api/auth/logout` | Logout and invalidate session |
| `GET` | `/api/auth/me` | Get current logged-in user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Get all posts |
| `POST` | `/api/posts` | Create a new post with image |
| `GET` | `/api/posts/my` | Get current user's posts |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/connections` | Get connections and available users |
| `POST` | `/api/connections/connect` | Connect with a user |
| `POST` | `/api/connections/disconnect` | Remove a connection |

### Feed
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/feeds` | Get personalized feed from connections |

---

## 📁 Project Structure

```
socialsphere/
│
├── src/main/java/com/project/techm/
│   ├── api/                        ← REST API Controllers
│   │   ├── AuthApiController.java
│   │   ├── PostApiController.java
│   │   ├── ConnectionApiController.java
│   │   └── FeedsApiController.java
│   │
│   ├── controller/                 ← Original Thymeleaf Controllers
│   ├── model/                      ← JPA Entity classes (User, Post, Connection)
│   ├── repository/                 ← Spring Data JPA Repositories
│   ├── service/                    ← Business Logic Layer
│   └── config/                     ← CORS and app configuration
│
├── src/main/resources/
│   ├── templates/                  ← Thymeleaf HTML templates (original)
│   ├── static/                     ← CSS, images, uploaded posts
│   └── application.properties
│
└── frontend/                       ← React Application
    ├── src/
    │   ├── api/api.js              ← Centralized API calls (Axios)
    │   ├── context/AuthContext.jsx ← Global auth state
    │   ├── components/Sidebar.jsx  ← Navigation sidebar
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── FeedPage.jsx
    │   │   ├── PostPage.jsx
    │   │   ├── ConnectionsPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── App.jsx                 ← Routes and auth guards
    │   └── index.css               ← Full CSS design system
    ├── vite.config.js              ← Dev proxy config
    └── package.json
```

---

## 🗄️ Database Schema

```
user_details        post                connection
────────────        ────────────        ────────────
id (PK)             id (PK)             id (PK)
name (unique)       UserId (FK)         user_id (FK)
email               caption             connected_user_id (FK)
phoneNumber         imageAddress
password
photo (BLOB)
```

---

## 🔒 Authentication Flow

```
User Login → POST /api/auth/login
          → Session created on server (userId stored)
          → User data stored in localStorage (React)
          → Protected routes accessible via React Router
          → Logout clears both session and localStorage
```

---

## 🎨 UI Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Sign in with email and password |
| Register | `/register` | Create a new account with photo |
| Home | `/home` | Welcome dashboard with recent posts |
| Feed | `/feeds` | Posts from your connections |
| New Post | `/post` | Upload image with drag-and-drop |
| Connections | `/connections` | Manage your social network |
| Profile | `/profile` | View and edit your profile |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


## 👨‍💻 Author

**Darshan MN**

