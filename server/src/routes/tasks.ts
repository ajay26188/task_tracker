// /routes/tasks.ts

import express, { Response, NextFunction } from 'express';
import { adminStatus, AuthRequest, userExtractor } from '../middlewares/auth';
import { newTaskData, updateTaskData } from '../types/task';
import { newTaskParser, updateTaskParser } from '../middlewares/validateRequest';
import { addTask, fetchAssignedTasks, fetchSingleTask, fetchTasksByOrg, removeTask, updateTask } from '../services/tasks';

const router = express.Router();

//fetch all tasks belonging to an organization. 'id' param is organization's ID
router.get('/org/:id', adminStatus, userExtractor, async(req: AuthRequest, res, next) => {
    try {

        const result = await fetchTasksByOrg(req.params.id, req.user!);

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You are not allowed to view tasks for this organization.'});
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'No tasks found for this organization.' });
        }
          
        return res.json(result);
    } catch (error) {
        return next(error);
    }
});

// Fetch projects task to the authenticated user
router.get("/assigned", userExtractor, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tasks = await fetchAssignedTasks(req.user!);
      return res.json(tasks);
    } catch (error) {
      return next(error);
    }
});

// GET /api/tasks/:id
// Viewing a single task and it's details
router.get('/task/:id', userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
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
router.patch('/:id', userExtractor,  updateTaskParser, async (req: AuthRequest<updateTaskData>, res: Response, next: NextFunction) => {
    try {
      const result = await updateTask( req.user!, req.body, req.params.id);

      if (!result) {
        return res.status(404).json({error: "Task not found or AssignedTo user not found."});
      }

      if (result === 'unauthorized') {
        return res.status(403).json({error: 'You can only update task of your organization and assign task to a member of your organization.'});
      }

      if (result === 'forbidden') {
        return res.status(403).json({error: 'You are not allowed to update these fields.'});
      }

      if (result === 'duplicate user') {
        return res.status(400).json({error: 'User is already assigned to this task.'});
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
        
        if (result === 'deleted') {
            return res.status(204).end();
        }
        
        
    } catch (error) {
        return next(error);
    }
});

export default router;