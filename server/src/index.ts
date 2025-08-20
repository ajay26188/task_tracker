import connectDB from './config/db';
import { PORT } from './config/env';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { createServer } from 'http';
import { Server } from 'socket.io';

import organizationRouter from './routes/organizations';
import userRouter from './routes/users';
import loginRouter from './routes/logins';
import projectRouter from './routes/projects';
import taskRouter from './routes/tasks';
import commentRouter from './routes/comments';
import { tokenExtractor } from './middlewares/auth';
import { ReturnedIComment } from './types/comment';

const app = express();

//HTTP server for both Express + Socket.Io
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
      origin: "*", // update this with frontend URL in production for security
      methods: ["GET", "POST"],
    },
  });

//use void to silence lint warning as error is handled by connectDB function
void connectDB();

app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.use(tokenExtractor);

app.use('/api/organization', organizationRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/comments', commentRouter);

app.use(errorHandler);

// SOCKET.IO CONNECTION
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
  
    // Join task room (so only viewers of that task get updates)
    socket.on('joinTask', (taskId) => {
      socket.join(taskId);
      console.log(`User ${socket.id} joined task ${taskId}`);
    });
  
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
});

//Helper function to emit comment updates
export const emitCommentAdded = (taskId: string, comment: ReturnedIComment) => {
    io.to(taskId).emit('commentAdded', comment);
};

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

