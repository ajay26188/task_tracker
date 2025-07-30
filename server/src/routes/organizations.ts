// /routes/organizations.ts

import express, {Request, Response, NextFunction} from 'express';

const router = express.Router();

import { IOrganization, ReturnedIOrganization } from '../types/organization';
import { newOrganizationParser } from '../middlewares/validateRequest';
import { addOrganization, getOrganization, removeOrganization, updateOrganization } from '../services/organizations';
import { adminStatus } from '../middlewares/auth';

//fetching an organization based on their id
router.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
    try {
        const organization = await getOrganization(req.params.id);

        if (!organization) {
            return res.status(404).json({error: 'Invalid organization ID.'})
        }
        return res.json(organization);
    } catch (error) {
        return next(error);
    }
});

//POST /api/organization
router.post('/', newOrganizationParser, async(req: Request<unknown, unknown, IOrganization>, res: Response<ReturnedIOrganization>) => {
    const newOrg = await addOrganization(req.body);
    res.status(201).json(newOrg);
});

// Deleting an organization only possible by the admin
router.delete('/:id', adminStatus, async(req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await removeOrganization(req.params.id);

        if (!result) {
            return res.status(404).json({error: 'Organization not found.'})
        }
        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
});

//updating organization's info 
router.put('/:id', adminStatus, newOrganizationParser, async(req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedOrganization = await updateOrganization(req.params.id, req.body);

      if (!updatedOrganization) {
        return res.status(404).json({error: 'Invalid organization.'})
      }
      return res.json(updatedOrganization);
      
    } catch (error) {
      return next(error);
    }
});

export default router;