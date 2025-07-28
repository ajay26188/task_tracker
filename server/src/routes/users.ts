import { newUserParser } from './../middlewares/validateRequest';
// /routes/users.ts

import express, {NextFunction, Request, Response} from 'express';
import { newUserData } from '../types/user';
import { addUser, getAllUsers } from '../services/users';
import { Types } from 'mongoose';

const router = express.Router();

// GET /api/users/:id — get all users for an organization
router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const orgId = req.params.id;

    if (!Types.ObjectId.isValid(orgId)) {
        return res.status(400).json({error: 'Invalid organization ID'})
    }

    try {
        const allUsers = await getAllUsers(orgId);
        return res.json(allUsers);
    } catch (err) {
        return next(err);
    }
});

router.post('/', newUserParser, async(req: Request<unknown, unknown, newUserData>, res: Response) => {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
});

export default router;