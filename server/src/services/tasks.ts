import Project from "../models/project";
import Task from "../models/task";
import User from "../models/user";
import { newTaskData, TaskFilter, updateTaskData } from "../types/task";
import { IUser } from "../types/user";
import { Document, Types } from "mongoose";
import Comment from '../models/comment';
import Notification from "../models/notification";
import { emitNewNotification } from "..";

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

    if (data.assignedTo) {
        const message = `A task titled ${data.title} has been assigned to you.`;

        const savedNotification = await Notification.create({
            message,
            userId: data.assignedTo
        });

        emitNewNotification(data.assignedTo.toString(), savedNotification);
    }

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

    // Notifications list to send
    let notifications: { message: string; userId: string }[] = [];

    if (user.role === 'admin') {

        if (title) {
            const oldTitle = task.title; // store old title
            task.title = title;
        
            task.assignedTo.forEach(uid => {
                notifications.push({
                  message: `Task "${oldTitle}" has been renamed to "${title}".`,
                  userId: uid.toString()
                });
            });
        }
         

        if (description) {
            task.description = description;
            task.assignedTo.forEach(uid => {
                notifications.push({
                  message: `Task ${task.title} description has been updated.`,
                  userId: uid.toString()
                });
            });
        };
        
        if (assignedTo) {
            const assignedToUser = await User.findById(assignedTo);

            if (!assignedToUser) return null;

            if (assignedToUser.organizationId.toString() !== user.organizationId.toString()) {
                return 'unauthorized'
            }

            if (task.assignedTo.map(id => id.toString()).includes(assignedTo.toString())) {
                return 'duplicate user';
            }

            task.assignedTo.push(assignedTo);

            //notifying the new assignee
            notifications.push({
                message: `A task titled ${task.title} has been assigned to you.`,
                userId: assignedTo.toString()
            });

            //Notifying existing assignee new member has been assigned
            task.assignedTo.forEach(uid => {
                if (uid.toString() !== assignedTo.toString()) {
                  notifications.push({
                    message: `A new member has been assigned to ${task.title}.`,
                    userId: uid.toString()
                  });
                }
            });
        } 

        if (priority) {
            task.priority = priority;
            task.assignedTo.forEach(uid => {
              notifications.push({
                message: `Task "${task.title}" priority changed to ${priority}.`,
                userId: uid.toString()
              });
            });
        };
        
        if (dueDate) {
            task.dueDate = dueDate;
            task.assignedTo.forEach(uid => {
              notifications.push({
                message: `Task "${task.title}" due date changed to ${dueDate.toDateString()}.`,
                userId: uid.toString()
              });
            });
        }

    }

    if (task.assignedTo.includes(user.id) || user.role === 'admin') {
        if (status) {
            task.status = status;
            task.assignedTo.forEach(uid => {
                if (uid.toString() !== user.id) {
                    notifications.push({
                        message: `Task "${task.title}" status changed to ${status}.`,
                        userId: uid.toString()
                      });
                }
            });
            if (user.role !== 'admin') {
                notifications.push({
                    message: `Task "${task.title}" status changed to ${status}.`,
                    userId: task.createdBy.toString()
                });
            }
        }
    };
    
    await task.save();

    // Save + emit notifications
    for (const notif of notifications) {
        const savedNotification = await Notification.create(notif);
        emitNewNotification(notif.userId, savedNotification);
    }

    return task;
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

    //Deleting task and their comments parallely
    await Promise.all([
        task.deleteOne(),
        Comment.deleteMany({ taskId: new Types.ObjectId(id) }),
    ]);

    return 'deleted';
};

