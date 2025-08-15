# 📌 DevChat Backend

A **Spring Boot** powered backend for a developer community chat platform, featuring **role-based access control**, **thread management**, **messaging**, and **voting system**.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization** using **JWT**
- 🛡 **Role-based Access Control** (`USER`, `DEV`, `ADMIN`, `SUPERADMIN`)
- 📝 **Thread Management** — create, read, update, and delete threads
- 💬 **Messaging System** — reply to threads with messages
- 👍 **Voting System** — upvote/downvote messages
- 🛠 **Admin Panel** — verify and manage users
- 🔍 **Search Functionality** — search threads by keywords
- 🗄 **MySQL Database Integration**

---

## 🏗 Tech Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** with JWT Authentication
- **Spring Data JPA** (Hibernate)
- **MySQL 8+**
- **Maven** for dependency management

---

## 📂 Project Structure

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


## ⚙️ Getting Started

### ✅ Prerequisites
- **Java 17** or higher
- **MySQL 8** or higher
- **Maven 3.6+**

### 📥 Installation

1️⃣ **Clone the repository**
```bash
git clone <repository-url>
cd devchat-backend
2️⃣ Create MySQL database

CREATE DATABASE devchat;


3️⃣ Configure database connection
Copy the example configuration file:

cp src/main/resources/application-example.properties src/main/resources/application.properties

DevChat Backend
Setup Instructions
Copy application-example.properties to application.properties
Update the database credentials in application.properties:
spring.datasource.url
spring.datasource.username
spring.datasource.password
Set superadmin credentials:
superadmin.email
superadmin.password
Environment Variables (Alternative)
You can also use environment variables:

DB_URL
DB_USERNAME
DB_PASSWORD
SUPERADMIN_EMAIL
SUPERADMIN_PASSWORD


Update:

spring.datasource.url=jdbc:mysql://localhost:3306/devchat
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

superadmin.email=admin@devchat.com
superadmin.password=your_secure_password


4️⃣ Build and run the application

mvn clean install
mvn spring-boot:run


The app runs on: http://localhost:8080
| Role           | Permissions                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| **USER**       | Basic registration (auto-verified), limited platform access                          |
| **DEV**        | Create/manage threads, post messages, vote on messages (requires admin verification) |
| **ADMIN**      | Verify DEV users, view pending DEV users, all DEV permissions                        |
| **SUPERADMIN** | Manage all users, verify all roles, full access                                      |

📌 API Endpoints

🔑 Authentication
POST /api/auth/register — Register user

POST /api/auth/login — Login

🛠 Admin

GET /api/admin/pending-users — Get pending users (ADMIN/SUPERADMIN)

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

GET /api/messages/thread/{threadId} — Get messages by thread

POST /api/messages — Post message

PUT /api/messages/{id} — Update message

DELETE /api/messages/{id} — Delete message

👍 Voting

POST /api/votes — Vote on message

GET /api/votes/{messageId} — Get vote counts

🔐 Security Features

JWT Authentication for secure token-based login

Role-based Authorization using Spring Security

BCrypt Password Encryption

CORS Configuration for cross-origin access

Method-level Security with @PreAuthorize

🛡 Error Handling

Custom global exception handling for:

UserNotFoundException

ThreadNotFoundException

Generic runtime exceptions

📜 Logging

DEBUG logging for Spring Web, Spring Security, and Hibernate SQL

Application-specific logs for easy debugging
