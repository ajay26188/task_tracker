// types/project.ts
export interface Project {
    id: string;            
    name: string;
    description: string;
    organizationId: string;
    startDate: string;
    endDate: string;
    tasks?: (string | {id: string, title: string})[];
    createdBy: string | { name: string; email: string } | null;
    createdAt?: string;
    updatedAt?: string;
}
  