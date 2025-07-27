import express, {Request, Response} from 'express';

const router = express.Router();

import { IOrganization, ReturnedIOrganization } from '../types/organization.types';
import { newOrganizationParser } from '../middlewares/validateRequest';
import Organization from '../models/organization';

//post /api/organization
router.post('/', newOrganizationParser, async(req: Request<unknown, unknown, IOrganization>, res: Response<ReturnedIOrganization>) => {
    const newOrg = await Organization.create(req.body);
    res.json(newOrg);
});

export default router;