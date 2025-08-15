# 📌 DevChat — Full Stack Developer Chat Platform

**DevChat** is a complete **developer community platform** built with **Spring Boot** (backend) and **React.js** (frontend), featuring authentication, role-based access control, thread discussions, messaging, voting, and an admin panel.

---

## 🚀 Features

### 🔹 Common
- 🔐 **JWT Authentication**
- 🛡 **Role-based Access Control** — `USER`, `DEV`, `ADMIN`, `SUPERADMIN`
- 📝 Thread discussions with search
- 💬 Messaging system with replies
- 👍 Voting system on messages
- 🛠 Admin panel for user management
- 📱 Responsive design

### 🔹 Backend (Spring Boot)
- Secure token-based authentication
- Role & permission enforcement
- MySQL database with JPA & Hibernate
- Admin verification system
- Global exception handling & logging

### 🔹 Frontend (React.js)
- Login/Register UI with JWT
- Role-based protected routes
- Thread creation, viewing, and searching
- Message posting for verified users
- Admin dashboard for verifying users
- Real-time updates & toast notifications

---

## 🏗 Tech Stack

| Layer      | Technologies |
|------------|--------------|
| **Frontend** | React 18.2, React Router 6.11, React Hook Form 7.45, Axios, React Toastify, CSS3 |
| **Backend** | Java 17+, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL 8+, Maven |
| **Database** | MySQL |
| **Build Tools** | Maven (backend), npm/yarn (frontend) |

---

## 📂 Project Structure

<details>
<summary>📦 Backend (Spring Boot)</summary>

```
src/
 ├── main/
 │   ├── java/com/devchat/backend/
 │   │   ├── controller/      # REST Controllers
 │   │   ├── service/         # Business Logic Layer
 │   │   ├── repository/      # Data Access Layer
 │   │   ├── entity/          # JPA Entities
 │   │   ├── dto/             # Data Transfer Objects
 │   │   ├── security/        # Security Configuration
 │   │   ├── enums/           # Enumerations
 │   │   └── exception/       # Exception Handling
 │   └── resources/
 │       ├── application.properties
 │       └── application-example.properties

🎨 Frontend (React.js
src/
 ├── components/       # UI Components
 ├── pages/            # Page Views (Login, Dashboard, Threads, etc.)
 ├── hooks/            # Custom Hooks
 ├── services/         # API Calls (Axios)
 ├── App.js            # Main App Component
 ├── index.js          # Entry Point
 └── styles/           # CSS Styling
⚙️ Getting Started
✅ Prerequisites

Java 17+ (Backend)
MySQL 8+ (Backend)
Maven 3.6+ (Backend)
Node.js 16+ & npm/yarn (Frontend)

📥 Backend Setup
1️⃣ Clone the repository
git clone <repository-url>
cd devchat-backend


2️⃣ Create MySQL Database
CREATE DATABASE devchat;


3️⃣ Configure Database
cp src/main/resources/application-example.properties src/main/resources/application.properties
Update:
spring.datasource.url=jdbc:mysql://localhost:3306/devchat
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
superadmin.email=admin@devchat.com
superadmin.password=your_secure_password


4️⃣ Run Backend
mvn clean install
mvn spring-boot:run


Backend runs at: http://localhost:8080

🎨 Frontend Setup
1️⃣ Navigate to frontend
cd devchat-frontend
2️⃣ Install dependencies
npm install
3️⃣ Run frontend
npm start
Frontend runs at: http://localhost:3000

| Role           | Permissions                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| **USER**       | Basic registration, view/search threads, read-only messages                          |
| **DEV**        | Post messages, vote on messages, create/manage threads (requires admin verification) |
| **ADMIN**      | Verify DEV users, view pending users, all DEV permissions                            |
| **SUPERADMIN** | Manage all users, verify all roles, full system access                               |

📌 API Endpoints
🔑 Authentication

POST /api/auth/register — Register

POST /api/auth/login — Login

🛠 Admin

GET /api/admin/pending-users — View pending users

POST /api/admin/verify-user/{userId} — Verify user

GET /api/admin/all-users — List all users (SUPERADMIN only)

📝 Threads

GET /api/threads — Get all threads

GET /api/threads/{id} — Get thread by ID

POST /api/threads — Create thread

PUT /api/threads/{id} — Update thread

DELETE /api/threads/{id} — Delete thread

GET /api/threads/search?keyword={keyword} — Search threads

💬 Messages

GET /api/messages/thread/{threadId} — Get messages

POST /api/messages — Post message

PUT /api/messages/{id} — Update message

DELETE /api/messages/{id} — Delete message

👍 Voting

POST /api/votes — Vote on message

GET /api/votes/{messageId} — Get vote counts

🔐 Security Features

JWT-based authentication

Role-based access with Spring Security

BCrypt password encryption

CORS configuration

Method-level security (@PreAuthorize)

🛡 Error Handling

UserNotFoundException

ThreadNotFoundException

Generic exception handling

📜 Logging

DEBUG level logging for Spring Web, Spring Security, and Hibernate SQL

Custom application logs for debugging
