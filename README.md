# TaskTracker 🗂️

**TaskTracker** is a modern, full-stack project management app designed for teams to collaborate, assign tasks, and track progress — built with a focus on scalability and clean architecture.

---

## Project Status: In Progress

- **Backend**: Development is well underway (~120 hours logged so far).  
  - Authentication system implemented  
  - Organization-specific task/project APIs functional  
  - Role-based access control active  
  - Project creation/updating with start/end date validation, past date prevention, and robust error handling

- **Frontend**: Live and integrated with backend authentication.  
  - Secure login enabled  
  - Users can access backend data through the UI
  - Admins can create/update projects with fields, validations, loading states, and Redux alert messages  

- **CI/CD**: Automated pipelines configured.  
  - Backend deployed on **Render**  
  - Frontend deployed on **Vercel**  
  - Deployments only trigger after successful CI checks

You can track my development log here: [working_hours.md](./working_hours.md)

---

## 🚀 Deployment

- **Backend API (Render):** [https://tasktracker-fr5h.onrender.com](https://tasktracker-fr5h.onrender.com)  
  - Healthcheck endpoint: [https://tasktracker-fr5h.onrender.com/ping](https://tasktracker-fr5h.onrender.com/ping) → returns `"pong"`  

- **Frontend (Vercel):** [https://task-tracker-seven-green.vercel.app/](https://task-tracker-seven-green.vercel.app/)
---

## 🔧 Features Built So Far

- Auth system with JWT + role-based middleware
- Organizations: data isolation per company
- Project creation APIs
- Task creation routes
- Query-based filtering (e.g., `GET /api/tasks?projectId=...`)
- Zod validation schemas
- Error handling & response conventions
- Email verification: send verification link on signup, verify token to activate user
- Password reset: request reset link via email, reset password using secure token

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript  
- **State Management:** Redux Toolkit (typed store, slices, and a global notification system for login/signup)  
- **Backend:** Node.js, Express  
- **Database:** MongoDB + Mongoose  
- **Validation:** Zod (schema-based input validation on signup/login)  
- **Authentication:** JWT (with access control for protected routes)  
- **Email Service:** Nodemailer (for sending verification and password reset emails)  
- **Error Handling:** Centralized backend error middleware + Redux-powered frontend alerts  
- **Dev Tools:** ESLint, TypeScript, Nodemon  
  

Built by **Ajay Sah**  


