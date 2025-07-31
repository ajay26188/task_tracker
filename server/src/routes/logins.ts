// /routes/login.ts

import express, {Request, Response} from 'express';
import { loginParser } from '../middlewares/validateRequest';
import { loginService } from '../services/logins';
import { LoginData } from '../types/user';

const router = express.Router();

//POST /api/login route
router.post('/', loginParser, async(req: Request<unknown, unknown, LoginData>, res: Response) => {
    const { email, password } = req.body;
    const result = await loginService(email, password);

    if (!result) {
        return res.status(401).json({error: 'Invalid login credentials.'});
    };

    return res.json(result); //returns {email, name, token}
});

export default router;