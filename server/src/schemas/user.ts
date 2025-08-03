// /schemas/user.ts

import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string(),
    email: z.email('Invalid email format.'),
    password: z
        .string()
        .min(6)
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower, number'
        ),
    organizationId: z.string(),
});

export const updateUserSchema = z.object({
    name: z.string(),
    email: z.email('Invalid email format.'),
    password: z
        .string()
        .min(6)
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower, number'
        ),
});

export const updateRoleSchema = z.object({
    role: z.enum(['admin', 'member'])
});