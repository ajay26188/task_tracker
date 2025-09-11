// types/project.ts
export interface Project {
    id: string;            
    name: string;
    description: string;
    organizationId: string;
    startDate: string; // ISO date string ("2025-09-07T00:00:00.000Z")
    endDate: string;
    tasks?: string[]; // array of task IDs
    createdBy: string; // user ID
    createdAt?: string;      // optional timestamps if your schema has them
    updatedAt?: string;
  }
  