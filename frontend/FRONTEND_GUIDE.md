# Frontend Setup & Components Guide

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   ├── TaskForm.js         ✨ NEW
│   │   ├── TaskList.js         ✨ NEW
│   │   └── TaskCard.js         ✨ NEW
│   ├── pages/
│   │   ├── Login.js            ✨ NEW - Beautiful login page
│   │   ├── Signup.js           ✨ NEW - User registration page
│   │   └── Dashboard.js        ✨ UPDATED - Main task management page
│   ├── store/
│   │   ├── store.js
│   │   └── taskSlice.js
│   ├── styles/
│   │   ├── Auth.css            ✨ NEW - Login/Signup styling
│   │   ├── Dashboard.css       ✨ NEW - Dashboard styling
│   │   ├── TaskForm.css        ✨ NEW - Task form styling
│   │   ├── TaskList.css        ✨ NEW - Kanban board styling
│   │   ├── TaskCard.css        ✨ NEW - Task card styling
│   │   └── Global.css          ✨ NEW - Global styles & utilities
│   ├── App.js                  ✨ NEW - App router
│   ├── index.js
│   └── index.css
├── package.json                ✨ UPDATED - Added react-router-dom
└── README.md
```

## 🎨 Features & Design

### Authentication Pages
- **Login Page** (`/login`)
  - Email & password input with icons
  - Clean, modern design with gradient background
  - Animated decorative shapes
  - Responsive layout
  - Error handling & loading states

- **Signup Page** (`/signup`)
  - Name, email, password, role selection
  - Three role options: Developer, Manager, Admin
  - Same modern design as login
  - Smooth animations

### Dashboard (`/dashboard`)
- **Header**
  - Branded logo "TaskFlow"
  - User profile display with avatar
  - Logout button

- **Sidebar**
  - Task status filters (All, Todo, In Progress, Blocked, Done)
  - Statistics cards showing task counts
  - Active filter highlighting

- **Main Area**
  - Create new task button
  - Kanban board layout with 4 columns (status-based)
  - Task cards with drag-friendly design
  - Empty state messaging

### Task Components

**TaskForm.js**
- Create new tasks
- Edit existing tasks
- Fields: Title, Description, Priority, Status, Due Date
- Form validation
- Error alerts
- Loading states

**TaskList.js**
- Kanban board view (4 columns by status)
- Responsive grid layout
- Task count badges per column
- Collapsible columns on mobile

**TaskCard.js**
- Expandable task cards
- Priority indicator with color coding
- Assigned user display
- Due date with overdue highlighting
- Status change dropdown
- Edit & Delete buttons
- Task description preview

## 🎯 Color Scheme & Design System

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #3b82f6 | Buttons, active states |
| Secondary | #10b981 | Success actions |
| Danger | #ef4444 | Delete, warnings |
| Warning | #f59e0b | Medium priority |
| Light BG | #f8fafc | Page background |
| Card BG | #ffffff | Cards, containers |
| Border | #e2e8f0 | Dividers |
| Text | #1e293b | Primary text |
| Muted | #64748b | Secondary text |

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

This will install:
- React 18.3.1
- React Router 6.20.0
- Redux & Redux Toolkit
- Axios
- Socket.io Client

### 2. Configure API Base URL
The frontend expects the backend at `http://localhost:5000`

Update in components if needed:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

### 3. Run Development Server
```bash
npm start
```

App runs at `http://localhost:3000`

## 🔄 User Flow

```
Login / Signup
     ↓
  Dashboard (protected)
     ├→ View all tasks (Kanban board)
     ├→ Create new task
     ├→ Edit task
     ├→ Delete task
     ├→ Change task status
     ├→ Filter by status
     └→ Logout
```

## 🔐 Authentication

### Login/Signup Flow
1. User submits credentials
2. Backend returns JWT token
3. Token saved to `localStorage`
4. Token included in all API requests: `Authorization: Bearer <token>`
5. Protected routes redirect to login if no token

### Token Management
```javascript
// Save token
localStorage.setItem('token', data.token);

// Use token
const token = localStorage.getItem('token');
headers: { 'Authorization': `Bearer ${token}` }

// Clear on logout
localStorage.removeItem('token');
```

## 🎨 Styling Details

### CSS Architecture
- **Global CSS** - Base styles, variables, utilities
- **Component CSS** - Modular styles for each component
- **CSS Variables** - Consistent colors & spacing
- **Responsive Design** - Mobile-first approach

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 768px
- **Desktop**: 1024px+
- **Large**: 1600px+

### Animations
- Fade in/out
- Slide up/down/left/right
- Bounce
- Spin (loading)
- Smooth transitions on all interactive elements

## 🖥️ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Mobile Features

- Responsive Kanban board (stacks on mobile)
- Touch-friendly buttons & inputs
- Mobile-optimized forms
- Full-width layouts on small screens

## 🔌 API Integration

### Endpoints Used

**Auth**
```
POST /api/auth/register
POST /api/auth/login
```

**Tasks**
```
GET /api/tasks?page=1&limit=10&status=<status>
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

### Request Example
```javascript
const response = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Task',
    description: '...',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-01-31T23:59:59Z'
  })
});
```

## 🎯 Key Features Implemented

✅ User authentication (login/signup)
✅ JWT token management
✅ Protected routes
✅ Task CRUD operations
✅ Kanban board view
✅ Task status transitions
✅ Priority levels with color coding
✅ Due date management
✅ Assigned user display
✅ Task filtering by status
✅ Create/Edit/Delete tasks
✅ Responsive design
✅ Error handling
✅ Loading states
✅ Empty state messaging
✅ User profile display
✅ Logout functionality

## 🐛 Error Handling

Components include error handling for:
- Network errors
- Invalid credentials
- Failed API calls
- Validation errors
- Missing required fields

Errors displayed in alert boxes with user-friendly messages.

## 🚀 Performance Optimizations

- Lazy loading of components (React code-splitting ready)
- Efficient re-renders with proper state management
- CSS transitions instead of JavaScript animations
- Debounced API calls
- Optimized images and assets

## 📝 Code Quality

- Clean, well-organized component structure
- Consistent naming conventions
- Comprehensive comments
- Modular CSS
- Responsive design patterns
- Accessibility considerations (semantic HTML, ARIA labels)

## 🔗 Important Files to Know

| File | Purpose |
|------|---------|
| `App.js` | Main router configuration |
| `pages/Dashboard.js` | Main task management page |
| `components/TaskForm.js` | Create/edit task form |
| `components/TaskList.js` | Kanban board container |
| `components/TaskCard.js` | Individual task card |
| `styles/Dashboard.css` | Layout styles |
| `styles/Auth.css` | Authentication page styles |

## 🎓 Learning Resources

The codebase demonstrates:
- React Hooks (useState, useEffect)
- React Router (navigation, protected routes)
- Fetch API for HTTP requests
- CSS Grid & Flexbox for layouts
- Responsive design patterns
- Form handling
- State management
- Error handling

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Ensure all dependencies are installed
4. Check network tab for API calls

---

**Happy Building!** 🚀
