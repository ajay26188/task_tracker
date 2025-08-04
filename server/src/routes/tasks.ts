// /routes/tasks.ts

import express, { Response, NextFunction } from 'express';
import { adminStatus, AuthRequest, userExtractor } from '../middlewares/auth';
import { newTaskData } from '../types/task';
import { newTaskParser } from '../middlewares/validateRequest';
import { addTask } from '../services/tasks';

const router = express.Router();

// POST /api/tasks
router.post('/', adminStatus, userExtractor, newTaskParser, async(req: AuthRequest<newTaskData>, res: Response, next:NextFunction) => {
    try {
        const result = await addTask(req.user!, req.body);

        if (!result) {
            return res.status(404).json({error: 'Invalid project Id or assignedTo Id'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can assign task to a member of your organization.'});
        }

        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

export default router;