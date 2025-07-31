// /schemas/project.ts

import { z } from 'zod';

export const createProjectSchema = z.object({
    name: z.string(),
    description: z.string(),
    // this allows to send string dates from Postman or frontend (like "2025-08-01") and have them converted to Date objects automatically
    startDate: z.string().transform(val => new Date(val)),
    endDate: z.string().transform(val => new Date(val)),
});
