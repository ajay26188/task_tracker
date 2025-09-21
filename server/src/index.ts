import cors from 'cors';
import connectDB from './config/db';
import { PORT } from './config/env';
import express, { Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { createServer } from 'http';
import { Server } from 'socket.io';

import organizationRouter from './routes/organizations';
import userRouter from './routes/users';
import loginRouter from './routes/logins';
import projectRouter from './routes/projects';
import taskRouter from './routes/tasks';
import commentRouter from './routes/comments';
import notificationRouter from './routes/notifications';
import { tokenExtractor } from './middlewares/auth';
import { ReturnedIComment } from './types/comment';
import { ReturnedINotification } from './types/notification';
import { ReturnedITask } from './types/task';

const app = express();

app.use(cors({
  origin: ['http://localhost:4173', 'https://task-tracker-seven-green.vercel.app'], // 4173 is for testing frontend prod loccaly and other for vercel prod
  credentials: true,  
}));

//HTTP server for both Express + Socket.Io
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'https://task-tracker-seven-green.vercel.app'], // two origins for dev and prod 
      methods: ["GET", "POST"],
      credentials: true,
    },
    
});

//use void to silence lint warning as error is handled by connectDB function
void connectDB();

app.use(express.json());

// health check endpoint
app.get('/ping', (_req, res: Response) => {
    res.send('pong');
});

// another health check endpoint for render
app.get('/', (_req, res: Response) => {
  res.send('TaskTracker server is running');
});


app.use(tokenExtractor);

app.use('/api/organization', organizationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/comments', commentRouter);
app.use('/api/notifications', notificationRouter);

app.use(errorHandler);

// SOCKET.IO CONNECTION
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    // Join task room (so only viewers of that task get updates)
    socket.on('joinTask', (taskId: string) => {
      void socket.join(taskId); // `void` to ignore returned Promise
      console.log(`User ${socket.id} joined task ${taskId} line 76`);
    });

    // Leave task room
    socket.on('leaveTask', (taskId: string) => {
      void socket.leave(taskId);
      console.log(`User ${socket.id} left task ${taskId}`);
    });

    // Join room to receive notifications
    socket.on('loggedInUser', (userId: string) => {
      void socket.join(userId); // `void` to ignore returned Promise
      console.log(`User ${socket.id} loggen in.`);
    });

    // Join project dashboard where all tasks are seen in kanban form (so only viewers of that project get updates)
    socket.on('joinProject', (projectId: string) => {
      void socket.join(projectId); // `void` to ignore returned Promise
      console.log(`User ${socket.id} joined project ${projectId}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
});

//Helper function to emit comment updates
export const emitCommentAdded = (taskId: string, comment: ReturnedIComment) => {
    io.to(taskId).emit('commentAdded', comment);
};

//Helper function to emit comment deletion
export const emitCommentDeleted = (taskId: string, commentId: string) => {
  io.to(taskId).emit('commentDeleted', commentId);
};

//Helper function to emit new notification
export const emitNewNotification = (userId: string, notification: ReturnedINotification) => {
  io.to(userId).emit('newNotification', notification);
};

//Helper function to emit task status updates
export const emitTaskStatusUpdate = (projectId: string, task: ReturnedITask) => {
  io.to(projectId).emit('taskStatusUpdated', task);
};

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

