// /routes/users.ts

import express, {NextFunction, Request, Response} from 'express';
import { newUserParser, passwordResetParser, updateRoleParser, updateUserParser } from './../middlewares/validateRequest';
import { newUserData, updateUserData, updateRole, emailVerification, resetPassword } from '../types/user';
import { addUser, getAllUsers, removeUser, updateRoleOfUser, updateUser, verifyUserEmail } from '../services/users';
import { Types } from 'mongoose';
import { adminStatus, userExtractor } from '../middlewares/auth';
import { AuthRequest } from '../middlewares/auth';
import { requestPasswordReset, resetUserPassword } from "../services/users";

const router = express.Router();

// GET /api/users/:id — get all users for an organization
router.get('/:id', adminStatus, userExtractor, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const orgId = req.params.id;
  const { search } = req.query;

  if (!Types.ObjectId.isValid(orgId)) {
    return res.status(400).json({ error: 'Invalid organization ID' });
  }

  if (req.user!.organizationId.toString() !== orgId) {
    return res.status(403).json({ error: 'You can only view users of your organization' });
  }

  try {
    const allUsers = await getAllUsers(orgId, typeof search === "string" ? search : undefined);
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

        return res.status(201).json(result);
    } catch (error) {
        return next(error);
    }
});

// this route is for handling email verification while signing up
// GET /api/users/verify/:token
router.get("/verify/:token", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const result = await verifyUserEmail(token);

    if (!result) {
      return res.status(400).json({ error: "User not found." });
    }

    return res.json(result);
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

// Request password reset (send email)
router.post("/request-reset", async (req: AuthRequest<emailVerification>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Password reset email sent." });
  } catch (error) {
    return next(error);
  }
});

// Reset password using token
router.post("/reset-password/:token", passwordResetParser, async (req: AuthRequest<resetPassword>, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const result = await resetUserPassword(token, password);

    if (!result) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    return res.json({ message: "Password reset successful." });
  } catch (error) {
    return next(error);
  }
});


export default router;