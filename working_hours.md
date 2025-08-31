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
| 31.08  | Total hours | 89h |

