| Date          | Task                          | Time Spent |
|---------------|-------------------------------|------------|
| 24.07  | Setting up server with TypeScript | 1 h |
| 24.07  | Adding models Organization, Project, User | 3.5 h |
| 24.07  | Lint erros fixing on models  | 0.5 h |
| 27.07  | Establishing mongodb connection  | 0.5 h |
| 27.07  | Refactoring mongodb connection into its own file  | 0.5 h |
| 27.07  | Designing POST /api/organization route with middlewares | 1 h |
| 28.07  | Designing post and get /api/users with requests validation | 1 h |
| 28.07  | Assigned role during user creation based on organization | 1 h |
| 28.07  | Designing POST /api/login with zod validation, login schemas and new loginData types | 2h |
| 30.07  | Designing PUT, DELETE for users and PUT, DELETE, GET for organization with authMIddleware for restriction control | 3h |
| 31.07  | Error handling middleware updated with more error hadnlers | 0.5h |
| 31.07  | Designing GET, POST, PUT & DELETE routes for projects with error handling | 2.5h |
| 03.08  | Testing via Postman for all organization, users, login routes with updating errorHandler, DELETE /api/organization route  | 3h |
| 03.08  | Testing via Postman for all projects route, adding more restrictions to route handlers and adding PATCH /api/users/:id/role to users  | 3h |
| 03.08  | Fixing lint errors related to 'any' type | 0.5h |
| 04.08  | Creating Task model | 1h |
| 04.08  | Designing POST /api/tasks | 1h |
| 04.08  | Designing GET /api/tasks?projectId=xxx, GET /api/tasks/:id, PATCH /api/tasks/:id, DELETE /api/tasks/:id | 4h |
| 12.08  | Updating GET /api/tasks?projectId=xxx, with GET /api/tasks?projectId="projectId"&status="Status"&priority="Priority"&assignedTo="userId"  | 3.5h |
| 12.08  | Testing all 'tasks' routes with update on routes/services and adding user-restrictions on some routes and updating task types  | 4h |
| 13.08  | Designing Comment model and creating API endpoints for POST /api/comments, GET /api/comments?taskId=xxxx, and DELETE /api/comments/:id with minor adjustment on updateTask function and Task model | 6.5h |
| 13.08  | Updating /services/ removeProject, removeOrganization, removeTask functions for allowing cascading delete operations and also adding organization restriction while adding a new user in addUser function | 1h |
| 13.08  | Testing via postman all comments API endpoints and making minor changes to existing services and routes folder | 1h |
| 20.08 | Setup Socket.IO in backend for real-time comments, emit commentAdded on comment creation, and tested using Postman's socket.io environment | 5.5h |
| 21.08 | Setup Notifications model & controller, implemented GET /api/notifications and PATCH /api/notifications/:id/read, and added triggers for task assignment, comment creation, and task updates | 7.5h |
| 21.08 | Testing via Postman Notifications routes and using socket.io functionality for checking real-time notifications | 1.5h |
| 22.08 | Creating an endpoint for grouping tasks by status (todo, in-progress, done) for a given project. Implemented GET /api/projects/:id/kanban| 3h |
| 27.08 | Implementing real-time task status updates with Socket.IO (backend only, tested via Postman) | 4h |
| 30.08 | Setup React + TypeScript project with Vite, install React Router and Axios, and prepare basic folder structure | 2h |
| 30.08 | Implement login page with Redux-based notification system, integrate API error handling, configure store, reducers, and custom dispatch typing, debug TypeScript thunk errors, and test notification flow. | 8h |
| 31.08 | Implement signup page with form validation and API integration, create signup service, update backend routes for improved error handling, connect frontend to backend signup flow, and test end-to-end user registration. | 7h |
| 31.08 | Created reusable FormLayout component for consistent styling and alert placement across all forms, built AddOrganization page, split Landing page into separate Login/Signup/Organization routes, and modernized existing Signup and Login pages for improved UX and maintainability. | 5h |
| 02.09 | Fixinf lint errors. | 1h |
| 02.09 | Deploying backend to Render. Faced issues with devDependencies and TypeScript compilation. Debugging the build process was time-consuming due to differences between local and production environments.| 3h |
| 03.09 | Deploying frontend to Vercel. Configured environment variables for production, connected to Render backend, and resolved API base URL and CORS issues. Tested local production build to ensure proper API integration. | 2h |
| 03.09 | Set up GitHub Actions pipeline for frontend deployment to Vercel. Added linting and build steps to ensure code quality before release, configured Vercel project ID and secrets for secure deployment, and verified that deployments only trigger after successful CI checks. | 3h |
| 04.09 | Set up GitHub Actions pipeline for backend deployment to Render. Added linting step to ensure code quality, configured Render service ID and API key secrets for secure deployment, and verified that deployments trigger automatically only when backend code changes. | 2h |
| 05.09 | Backend: Implemented user email verification system. Added isVerified field to User model/types, updated signup service to hash password, assign role, and generate JWT verification token. Created reusable sendVerificationEmail utility using Nodemailer. Added /api/users/verify/:token route with service-layer business logic and error handling. Configured environment secrets for secure email sending. | 5h |
| 05.09 | Frontend: Integrated verification flow. Updated signup to show VerifyNotice page after registration instead of logging in directly. Built VerifyEmail.tsx page to handle token verification and display user info once verified. Refactored to keep business logic in services/signup.ts. UX discussion on flow after verification (closing tab vs redirect). | 3h |
| 05.09 | Fixed Vercel production issue where `/verify-email/:token` returned 404. Added `vercel.json` rewrite to ensure React Router handles dynamic routes. Verified working in production. | 1h |
| 06.09 | Backend: Implemented password reset flow. Added `POST /request-reset` to send reset email and `POST /reset-password/:token` to update password. Built service logic for token generation, email sending, password hashing, and error handling. Tested endpoints via Postman and verified payload handling. | 4h |
| 06.09 | Frontend: Built `RequestReset.tsx` and `ResetPassword.tsx` pages using modern `FormLayout`. Added password/confirm fields, visibility toggles, loading states, and Redux alert messages. Integrated with backend, handled errors on form, and redirect to `/login` after successful reset. | 3h |
| 07.09 | Built `DashboardLayout.tsx` with sidebar, topbar, and main content area. Added dynamic sidebar for admin and regular users. | 2h |
| 07.09 | Added avatar with initials and dropdown menu containing Profile, Logout, Account settings and Help links. | 1.5h |
| 07.09 | Connected Redux `loggedUserReducer` to store current user. Handled setting and clearing user in localStorage. | 2h |
| 07.09 | Implemented Logout functionality to clear Redux and localStorage, then redirect to `/login`. | 1h |
| 07.09 | Tested dashboard UI, sidebar active link, avatar dropdown, and Logout behavior. | 0.5h |
| 11.09 | Built `ProjectModal` and `Project.tsx` for creating/updating projects on frontend using all service functions (`fetchProjectsByOrg`, `fetchAssignedProjects`, `fetchProject`, `createProject`, `updateProject`, `deleteProject`) and `authHeader` helper; updated backend `Project` schema with name, description, start/end date validations, pre-save hooks to prevent past dates or end-before-start, enhanced error handling middleware, integrated frontend API calls, handled server errors in modal, added `/projects/assigned` route for authenticated user, and tested full create/update project flows. | 9h |
| 12.09 | Built `ProjectPage` for single project view and updated `Projects.tsx` to make project cards clickable with improved UI. | 4h |
| 12.09 | Enhanced `Projects.tsx` by adding status filter (Active/Completed) and status badges for each project card. Updated `Project.tsx` with task board improvements, including per-status counts (To Do, In Progress, Done) and clickable task cards. | 3h |
| 13.09 | Added task services (`fetchTasksByProject`, `fetchTask`, `createTask`, `updateTask`, `deleteTask`). Built `TaskModal` for creating/updating tasks with title, description, status, priority, due date, and user assignment (autocomplete search). Updated backend to support assigned users.| 6h |
| 14.09 | Fixed cold start issue on Vercel | 0.5h |
| 14.09 | Built `Tasks.tsx` with listing, filters, TaskModal integration, and role-based restrictions. | 4h |
| 15.09 | Fixed cold vercel start with uptime , updated task update flow to support multiple assignees, resolved due date bug, and migrated MongoDB data. | 2h |
| 15.09  | TaskModal edit features fixed with assignee replacement, instant frontend update via populated task on backend. | 1.5h |
| 15.09  | Added task search by assignee and dueDates filter in Tasks.tsx with improved placeholder UX and responsive input sizing. | 1h |
| 16.09  | Built `Task.tsx` with styling added to existing pages to make them look modern and enhance UX. | 3.5h |
| 16.09  | Added database seeding scripts for projects, users, and tasks with realistic data for demo purposes. | 4h |
| 16.09  | Implemented backend + frontend pagination for tasks (org-wide and assigned tasks) to improve scalability and UX. | 3h |
| 17.09 | Switched Brevo integration from SMTP to HTTPS to stay compatible with Render’s free tier. | 1h |
| 21.09 | Added real-time comments for tasks using Socket.IO with add/delete functionality, auto-scroll, and selected comment highlighting. | 5h |
| 22.09 | Implemented real-time notifications feature with notificationReducer and bell icon badge. | 5h |
| 22.09 | Debugging real-time notifications sicket.io issues. | 2h |
| 23.09 | `Users.tsx` created for admins to manage users (change roles between 'member' and 'admin', delete users). `PersonalProfile.tsx` modal created for viewing personal information with update password and delete account features implemented. | 4h |
| 23.09 | Developed the initial dashboard featuring a Kanban-style board with drag-and-drop functionality for managing tasks efficiently. | 5h |
| 24.09  | Total hours | 186.5h |

