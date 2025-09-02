// /routes/users.ts

import express, {NextFunction, Request, Response} from 'express';
import { newUserParser, updateRoleParser, updateUserParser } from './../middlewares/validateRequest';
import { newUserData, updateUserData, updateRole } from '../types/user';
import { addUser, getAllUsers, removeUser, updateRoleOfUser, updateUser } from '../services/users';
import { Types } from 'mongoose';
import { adminStatus, userExtractor } from '../middlewares/auth';
import { AuthRequest } from '../middlewares/auth';

const router = express.Router();

// GET /api/users/:id — get all users for an organization
router.get('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    const orgId = req.params.id;

    if (!Types.ObjectId.isValid(orgId)) {
        return res.status(400).json({error: 'Invalid organization ID'});
    }

    if (req.user!.organizationId.toString() !== orgId) {
      return res.status(403).json({error: 'You can only view users of your organization'});
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
        const result = await addUser(req.body);

        if (!result) {
          return res.status(400).json({error: 'Organization not found.'});
        }

        // remove password from response
        //const { password, ...safeUser } = result.toObject();

        return res.status(201).json(result);
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

//updating user's info as an user
router.put('/:id', userExtractor, updateUserParser, async(req: AuthRequest<updateUserData>, res: Response, next: NextFunction) => {
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

//To change role of an user
// PATCH /api/users/:id/role
router.patch('/:id/role', adminStatus, userExtractor,  updateRoleParser, async (req: AuthRequest<updateRole>, res: Response, next: NextFunction) => {
    try {
      const result = await updateRoleOfUser(req.params.id, req.body, req.user!);

      if (!result) {
        return res.status(404).json({error: "User not found."});
      }

      if (result === 'unauthorized') {
        return res.status(403).json({error: 'YOu can only update role status of your organization user.'});
      }

      return res.json(result);

    } catch (error) {
      return next(error);
    }
  });
  

export default router;