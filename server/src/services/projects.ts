import Project from "../models/project";
import { newProjectData, ReturnedIProject} from "../types/project";
import { IUser } from "../types/user";
import { Document } from "mongoose";


export const fetchProjectsByOrg = async(orgId: string): Promise<(Document<unknown, {}, ReturnedIProject> & ReturnedIProject)[]> => {
    const projects = await Project.find({organizationId: orgId});

    return projects;
};

export const addProject = async(data: newProjectData, authenticatedUser: (IUser & Document))  => {

    const orgId = authenticatedUser.organizationId.toString();

    const creator = authenticatedUser.id;

    //add role field manually to database
    return await Project.create({
        ...data,
        organizationId: orgId,
        createdBy: creator
    });
};

export const removeProject = async(id: string, user: (IUser & Document)) => {
    const project = await Project.findById(id);

    if (!project) return null;

    if (project.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized';
    }

    return await project.deleteOne();
};

export const updateProject = async (projectId: string, updates: newProjectData, user: (IUser & Document)) => {
    const { name, description, startDate, endDate  } = updates;

    const project = await Project.findById(projectId);

    if (!project) return null;

    if (project.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized';
    }
  
    if (name) project.name = name;
    if (description) project.description = description;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
  
    return await project.save();
};

export const fetchProject = async(projectId: string, user: (IUser & Document)) => {
    
    const project = await Project.findById(projectId);

    if (!project) return null;

    if (project.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized';
    } 

    return project;
};

