// /routes/projects.ts

import express,{ Response, NextFunction } from 'express';
import { adminStatus, userExtractor, AuthRequest } from '../middlewares/auth';
import { newProjectParser } from '../middlewares/validateRequest';
import { newProjectData } from '../types/project';
import { addProject, fetchProject, fetchProjectsByOrg, removeProject, updateProject } from '../services/projects';

const router = express.Router();

//fetch all projects belonging to an organization 'id' param is organization's ID
router.get('/:id', adminStatus, userExtractor, async(req: AuthRequest, res, next) => {
    try {
        if (req.user?.organizationId.toString() !== req.params.id) {
            return res.status(401).json({error: 'Unauthorozed to perform this operation.'});
        }

        const projects = await fetchProjectsByOrg(req.params.id);
        
        if (projects.length === 0) {
            return res.status(404).json({ error: 'No projects found for this organization.' });
        }
          
        return res.json(projects);
    } catch (error) {
        return next(error);
    }
});

// POST /api/projects
router.post('/', adminStatus, userExtractor, newProjectParser, async(req: AuthRequest<newProjectData>, res: Response, next: NextFunction) => {
    try {
        const newProject = await addProject(req.body, req.user!);
        return res.status(201).json(newProject);

    } catch (error) {
        return next(error);
    }
});

//Deleting an organization only possible by admin of the organization
router.delete('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await removeProject(req.params.id, req.user!);

        if (!result) {
            return res.status(404).json({error: 'Project not found.'});
        }

        if (result === 'unauthorized') {
            return res.status(403).json({error: 'You can only delete projects from your own organization.'});
        }
        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
});

//Fetching single project with their id
router.get('/:id', adminStatus, userExtractor, async(req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await fetchProject(req.params.id, req.user!);

        if (result === 'unauthorized') {
            return res.status(403).json({error: `You can only fetch your organization's projects.`});
        }

        if (!result) {
            return res.status(404).json({error: 'Invalid project id.'});
        }
        return res.json(result);
        
        } catch (error) {
        return next(error);
    }
});

//updating project's info
router.put('/:id', adminStatus, userExtractor, newProjectParser, async(req: AuthRequest<newProjectData>, res: Response, next: NextFunction) => {
    try {
        const result = await updateProject(req.params.id, req.body, req.user!);

        if (result === 'unauthorized') {
            return res.status(403).json({error: `You can only update your own organization's project information.`});
        }

        if (!result) {
            return res.status(404).json({error: 'Invalid project id.'});
        }
        return res.json(result);
        
        } catch (error) {
        return next(error);
    }
});

export default router;