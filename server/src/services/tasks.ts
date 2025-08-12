import Project from "../models/project";
import Task from "../models/task";
import User from "../models/user";
import { newTaskData, TaskFilter, updateTaskData } from "../types/task";
import { IUser } from "../types/user";
import { Document } from "mongoose";

//fetch all tasks in a project with req.query
export const fetchAllTasks = async(filter: TaskFilter, authenticatedUser: (IUser & Document)) => {
    const project = await Project.findById(filter.projectId);

    if (!project) return null;

    if (project.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    const tasks = await Task.find(filter);

    return tasks;
};

//Fetching a single task 
export const fetchSingleTask = async(taskId: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(taskId);

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    return task;
};

export const addTask = async(authenticatedUser: (IUser & Document), data: newTaskData) => {
    const project = await Project.findById(data.projectId);

    console.log('project found!');

    if (!project) return null;

    let assignedToUser;

    if (data.assignedTo) {
        assignedToUser = await User.findById(data.assignedTo);

        if (!assignedToUser) return null;

        if (assignedToUser.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
            return 'unauthorized';
        }
    }

    if (project.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    const orgId = authenticatedUser.organizationId;

    const creator = authenticatedUser._id;

    const newTask = await Task.create({
        ...data,
        organizationId: orgId,
        createdBy: creator
    });

    await Project.findByIdAndUpdate(data.projectId, {
        $push: {tasks: newTask._id}
    });

    return newTask;
};

export const updateTask = async (user: (IUser & Document), updates: updateTaskData, taskId: string) => {
    const task = await Task.findById(taskId);

    if (!task) return null;

    if (user.organizationId.toString() !== task.organizationId.toString()) {
        return 'unauthorized';
    }

    const { title, description, assignedTo, status, priority, dueDate } = updates;
  
    if (title) task.title = title;
    if (description) task.description = description;

    if (assignedTo) {
        const assignedToUser = await User.findById(assignedTo);

        if (!assignedToUser) return null;

        if (assignedToUser.organizationId.toString() !== user.organizationId.toString()) {
            return 'unauthorized'
        }

        task.assignedTo = assignedTo;

    } 
    
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
  
    return await task.save();
};

export const removeTask = async(id: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(id);

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    //Remove task from project before deletion
    await Project.updateOne(
        { _id: task.projectId },
        { $pull: { tasks: task._id} }
    );

    return await task.deleteOne();
};

