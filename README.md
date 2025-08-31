# TaskTracker 🗂️

**TaskTracker** is a modern, full-stack project management app designed for teams to collaborate, assign tasks, and track progress — built with a focus on scalability and clean architecture.

---

## Project Status: In Progress

> Backend development is currently **in progress** (~90 hours logged so far).  
> Auth system, organization-specific task/project APIs, and role-based access are functional.

You can track my development log here: [working_hours.md](./working_hours.md)

---

## 🔧 Features Built So Far

- Auth system with JWT + role-based middleware
- Organizations: data isolation per company
- Project creation APIs
- Task creation routes
- Query-based filtering (e.g., `GET /api/tasks?projectId=...`)
- Zod validation schemas
- Error handling & response conventions

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript  
- **State Management:** Redux Toolkit (typed store, slices, and a global notification system for login/signup)  
- **Backend:** Node.js, Express  
- **Database:** MongoDB + Mongoose  
- **Validation:** Zod (schema-based input validation on signup/login)  
- **Authentication:** JWT (with access control for protected routes)  
- **Error Handling:** Centralized backend error middleware + Redux-powered frontend alerts  
- **Dev Tools:** ESLint, TypeScript, Nodemon  


## Next Up (Roadmap)

- [ ] Connect frontend (React) to backend API  
- [ ] Build Kanban-style task board  
- [ ] Task completion tracking & history  
- [ ] Team dashboards with charts  
- [ ] File uploads for tasks  

---

## 📌 Why I Built This

I'm building TaskTracker as a **real-world, production-style web project** to:

- Deepen my understanding of full-stack development
- Practice clean API design and scalable backend patterns
- Simulate company-like development (tickets, role-based control, etc.)
- Showcase a complete project to potential employers and recruiters

---

## 📬 Contact

Built by **Ajay Sah**  


