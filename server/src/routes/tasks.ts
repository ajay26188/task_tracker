// /routes/tasks.ts

import express, { Response, NextFunction } from 'express';
import { adminStatus, AuthRequest, userExtractor } from '../middlewares/auth';
import { newTaskData, Priority, Status, TaskFilter, TaskQueryParams, updateTaskData } from '../types/task';
import { newTaskParser, updateTaskParser } from '../middlewares/validateRequest';
import { addTask, fetchAllTasks, fetchSingleTask, removeTask, updateTask } from '../services/tasks';
import { isValidObjectId, Types } from 'mongoose';

const router = express.Router();

// GET /api/tasks?projectId="projectId"&status="Status"&priority="Priority"&assignedTo="userId"
// fetch all tasks in a project
router.get('/', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId, status, priority, assignedTo, dueDate } = req.query as TaskQueryParams;

        if (!projectId || typeof projectId !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid projectId' });
        }

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ error: 'Invalid projectId format' });
        }

        const filter: TaskFilter = {};

        filter.projectId = new Types.ObjectId(projectId);

        if (status && typeof status === 'string') {
            filter.status = status as Status;
        }

        if (priority && typeof priority === 'string') {
            filter.priority = priority as Priority;
        }

        if (assignedTo && typeof assignedTo === 'string' && isValidObjectId(assignedTo)) {
            filter.assignedTo = new Types.ObjectId(assignedTo);
        }
      
        if (dueDate && typeof dueDate === 'string') {
            const parsedDate = new Date(dueDate);
            if (!isNaN(parsedDate.getTime())) {
                filter.dueDate = { $lte: parsedDate }; //before or equal to date
            }
        }
        
        const result = await fetchAllTasks(filter, req.user!);
        
        if (!result) {
            return res.status(404).json({error: 'Project not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only view tasks of projects that belongs to your organization.'});
        }
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

// GET /api/tasks/:id
// Viewing a single task and it's details
router.get('/:id', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
       const result = await fetchSingleTask(req.params.id, req.user!);
        
        if (!result) {
            return res.status(404).json({error: 'Task not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only view task that belongs to your organization.'});
        }
        
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
});

// POST /api/tasks
router.post('/', adminStatus, userExtractor, newTaskParser, async(req: AuthRequest<newTaskData>, res: Response, next:NextFunction) => {
    try {
        const result = await addTask(req.user!, req.body);

        if (!result) {
            return res.status(404).json({error: 'Invalid project Id or assignedTo Id'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only add task to a project of your organization and assign task to a member of your organization'});
        }

        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

// PATCH /api/tasks/:id
router.patch('/:id', adminStatus, userExtractor,  updateTaskParser, async (req: AuthRequest<updateTaskData>, res: Response, next: NextFunction) => {
    try {
      const result = await updateTask( req.user!, req.body, req.params.id);

      if (!result) {
        return res.status(404).json({error: "Task not found or AssignedTo user not found."});
      }

      if (result === 'unauthorized') {
        return res.status(403).json({error: 'You can only update task of your organization and assign task to a member of your organization.'});
      }

      return res.json(result);

    } catch (error) {
      return next(error);
    }
  });

// DELETE /api/tasks/:id
router.delete('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await removeTask(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Task not found.'});
        }
        if (result === 'unauthorized') {
            return res.status(403).json({error: 'Unauthorized to perform this operation.'});
        }
        return res.status(204).end();
        
        
    } catch (error) {
        return next(error);
    }
});

export default router;