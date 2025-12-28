# Task Collaboration Platform

A real-time task management system built with **Node.js**, **Express**, **MongoDB**, and **Socket.io** for seamless team collaboration.

## 🚀 Features

- **User Authentication** – Register, login, and role-based access control (Admin, Manager, Developer)
- **Task Management** – Create, update, and track tasks with priority levels and status transitions
- **Real-time Updates** – Socket.io integration for instant task creation/update notifications
- **Role-based Permissions** – Different access levels based on user roles
- **Task Filtering** – Filter tasks by status, priority, and assigned user
- **Pagination** – Efficient task list loading with page and limit parameters
- **Responsive Frontend** – React-based UI with Redux state management
- **Comprehensive Validation** – Input validation, enum checks, date validation
- **Status State Machine** – Enforced task status transitions

## 📦 Project Structure

```
task-collaboration-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   └── task.controller.js    # Task CRUD operations
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT verification & role check
│   │   ├── models/
│   │   │   ├── Task.js               # Task schema
│   │   │   └── User.js               # User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   └── task.routes.js        # Task endpoints
│   │   ├── sockets/
│   │   │   └── task.socket.js        # Socket.io real-time events
│   │   └── server.js                 # Express server setup
│   ├── package.json
│   └── .env                          # Environment variables (not in repo)
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # API client
│   │   ├── components/               # React components
│   │   ├── pages/
│   │   │   └── Dashboard.js          # Main dashboard
│   │   └── store/
│   │       ├── store.js              # Redux store
│   │       └── taskSlice.js          # Redux slice for tasks
│   ├── package.json
│   └── public/
├── README.md
└── .gitignore
```

## 🔧 Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn**

## ⚙️ Installation

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-collaboration-db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get tasks with filtering & pagination | ✅ All roles |
| POST | `/api/tasks` | Create a new task | ✅ Admin/Manager |
| PUT | `/api/tasks/:id` | Update task | ✅ All roles (role-based) |

## 🔐 Authentication & Authorization

### User Roles & Permissions

| Action | Admin | Manager | Developer |
|--------|-------|---------|-----------|
| Create Task | ✅ | ✅ | ❌ |
| Assign User | ✅ | ✅ | ❌ |
| Update Any Task | ✅ | ✅ | ❌ |
| Update Assigned Task | ✅ | ✅ | ✅ |
| View All Tasks | ✅ | ✅ | ❌ (Only assigned) |
| Reassign Task | ✅ | ✅ | ❌ |

### JWT Token

After login/register, the response includes a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Include this token in the `Authorization` header for protected routes:

```
Authorization: Bearer <token>
```

## 📋 Task Status Transitions

Valid status transitions (enforced state machine):

```
Todo ──→ In Progress ──→ Blocked ──→ In Progress
         ↓
        Done ──→ (no transitions)
```

- `Todo` → `In Progress` ✅
- `In Progress` → `Blocked` ✅
- `In Progress` → `Done` ✅
- `Blocked` → `In Progress` ✅
- `Done` → (locked, no transitions) ❌

## ✅ Validation Rules

### Creating Tasks

**Required Fields:**
- `title` – Task name
- `priority` – Enum: `Low`, `Medium`, `High`

**Optional Fields:**
- `description` – Task details
- `status` – Default: `Todo`; Enum: `Todo`, `In Progress`, `Blocked`, `Done`
- `assignedUser` – MongoDB ObjectId (must be valid user)
- `dueDate` – ISO 8601 format, must be in the future

**Rules:**
- Only **Admin** or **Manager** can assign users
- Due date cannot be in the past
- All enum values must match allowed values

### Updating Tasks

**Developer Restrictions:**
- Can only update tasks assigned to them
- Cannot reassign tasks to other users
- Cannot change `assignedUser` field

**All Users:**
- Status transitions must follow state machine rules
- Priority and due date must match validation rules
- Cannot assign invalid user IDs

## 🧪 Testing with Postman

### Quick Setup

1. **Register 3 Users** (different roles):
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "Pass123!",
     "role": "Admin"
   }
   ```

2. **Save Environment Variables**:
   - `baseUrl` = `http://localhost:5000/api`
   - `adminToken` = (from register/login)
   - `managerToken` = (from register/login)
   - `devToken` = (from register/login)
   - `taskId` = (from create task)

3. **Test Scenarios**:
   - ✅ Create task (Manager/Admin)
   - ✅ Update task status (valid transitions)
   - ✅ Test invalid transitions (should fail)
   - ✅ Get tasks with pagination
   - ✅ Filter by status
   - ✅ Test role-based restrictions
   - ✅ Test developer task restrictions

## 🔄 Real-time Features (Socket.io)

When a task is created or updated, all connected clients receive:

- **`taskCreated`** – Emitted when a new task is created
- **`taskUpdated`** – Emitted when a task is modified

Socket connection is established automatically; no manual action required.

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend Runtime** | Node.js | v14+ |
| **Framework** | Express.js | v4+ |
| **Database** | MongoDB | 4.4+ |
| **ODM** | Mongoose | v6+ |
| **Authentication** | JWT + bcryptjs | - |
| **Real-time** | Socket.io | v4+ |
| **Frontend** | React.js | v17+ |
| **State Management** | Redux | v4+ |

## 📝 Environment Variables

Backend `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/task-collaboration-db
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=1d

# Optional: Logging
LOG_LEVEL=debug
```

## 📊 Database Indexes

The `Task` model includes these indexes for performance:

```javascript
TaskSchema.index({ status: 1 });
TaskSchema.index({ assignedUser: 1 });
```

## 🚀 Deployment

### Backend Deployment (Heroku, AWS, etc.)

```bash
# Set environment variables on your hosting platform
git push heroku main
```

### Frontend Deployment (Vercel, Netlify, etc.)

```bash
npm run build
# Deploy the build folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Sameer Khan**  
GitHub: [@SameerKhan5114](https://github.com/SameerKhan5114)  
Project: [project-management-system](https://github.com/SameerKhan5114/project-management-system)

## 🐛 Issues & Support

Found a bug? Have a suggestion? Please open an [issue](https://github.com/SameerKhan5114/project-management-system/issues) on GitHub.

## 🎓 Architecture Highlights

- **Modular MVC** – Separation of concerns (Models, Controllers, Routes)
- **Middleware-based** – Authentication and authorization as middleware
- **State Machine** – Enforced task status transitions
- **Real-time** – Socket.io for instant updates
- **Database Indexing** – Optimized queries for common filters
- **Error Handling** – Consistent error responses with meaningful messages

---

**Happy Coding!** 🎉
