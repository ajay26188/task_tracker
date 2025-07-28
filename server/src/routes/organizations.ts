// /routes/organizations.ts

import express, {Request, Response} from 'express';

const router = express.Router();

import { IOrganization, ReturnedIOrganization } from '../types/organization';
import { newOrganizationParser } from '../middlewares/validateRequest';
import { addOrganization } from '../services/organizations';

//post /api/organization
router.post('/', newOrganizationParser, async(req: Request<unknown, unknown, IOrganization>, res: Response<ReturnedIOrganization>) => {
    const newOrg = await addOrganization(req.body);
    res.status(201).json(newOrg);
});

export default router;