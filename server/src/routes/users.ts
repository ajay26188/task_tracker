// /routes/users.ts

import express, {NextFunction, Request, Response} from 'express';
import { newUserParser } from './../middlewares/validateRequest';
import { newUserData } from '../types/user';
import { addUser, getAllUsers, removeUser, updateUser } from '../services/users';
import { Types } from 'mongoose';
import { adminStatus, userExtractor } from '../middlewares/auth';
import { AuthRequest } from '../middlewares/auth';

const router = express.Router();

// GET /api/users/:id — get all users for an organization
router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
    const orgId = req.params.id;

    if (!Types.ObjectId.isValid(orgId)) {
        return res.status(400).json({error: 'Invalid organization ID'});
    }

    try {
        const allUsers = await getAllUsers(orgId);
        return res.json(allUsers);
    } catch (err) {
        return next(err);
    }
});

//POST /api/users
router.post('/', newUserParser, async(req: Request<unknown, unknown, newUserData>, res: Response, next: NextFunction) => {
    try {
        const newUser = await addUser(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        return next(error);
    }
});

// Deleting a user only possible by the admin
router.delete('/:id', adminStatus, async(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await removeUser(req.params.id);

        if (!result) {
            return res.status(404).json({error: 'User not found.'});
        }
        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
});

//updating user's info 
router.put('/:id', userExtractor, newUserParser, async(req: AuthRequest<newUserData>, res: Response, next: NextFunction) => {
    try {
      if (req.user?.id !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized to perform this operation.' });
      }
  
      const updatedUser = await updateUser(req.user, req.body);
      return res.json(updatedUser);
      
    } catch (error) {
      return next(error);
    }
});

export default router;