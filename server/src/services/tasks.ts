import Project from "../models/project";
import Task from "../models/task";
import User from "../models/user";
import { newTaskData } from "../types/task";
import { IUser } from "../types/user";
import { Document } from "mongoose";

export const addTask = async(authenticatedUser: (IUser & Document), data: newTaskData) => {
    const project = await Project.findById(data.projectId);

    if (!project) return null;

    const assignedToUser = await User.findById(data.assignedTo);

    if (!assignedToUser) return null;

    if (assignedToUser.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    const orgId = authenticatedUser.organizationId;

    const creator = authenticatedUser._id;

    return await Task.create({
        ...data,
        organizationId: orgId,
        createdBy: creator
    });
};