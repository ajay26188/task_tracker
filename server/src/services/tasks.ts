import Project from "../models/project";
import Task from "../models/task";
import User from "../models/user";
import { newTaskData, updateTaskData } from "../types/task";
import { IUser, Role } from "../types/user";
import { Document, Types } from "mongoose";
import Comment from '../models/comment';
import Notification from "../models/notification";
import { emitNewNotification, emitTaskStatusUpdate } from "..";

export const fetchTasksByOrg = async (orgId: string, user: IUser & Document, page: number = 1, limit: number = 10
  ) => {
    if (user.organizationId.toString() !== orgId) {
      return 'unauthorized';
    }
  
    const skip = (page - 1) * limit;
  
    const tasks = await Task.find({ organizationId: orgId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const total = await Task.countDocuments({ organizationId: orgId });
  
    return {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  };
  

// Fetch tasks that the user is assigned to with pagination
export const fetchAssignedTasks = async (
    user: IUser & Document,
    page: number,
    limit: number
  ) => {
    const userId = user._id;
    const skip = (page - 1) * limit;
  
    const [tasks, total] = await Promise.all([
      Task.find({ assignedTo: { $in: [userId] } }) // ensure array lookup
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments({ assignedTo: { $in: [userId] } }),
    ]);
  
    return {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  };
  

//Fetching a single task 
export const fetchSingleTask = async(taskId: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(taskId).populate("assignedTo", "name email");

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    return task;
};

export const addTask = async(authenticatedUser: (IUser & Document), data: newTaskData) => {
    const project = await Project.findById(data.projectId);

    //console.log('project found!');

    if (!project) return null;

    if (data.assignedTo && data.assignedTo.length > 0) {
        const users = await User.find({ _id: { $in: data.assignedTo } });
    
        if (users.length !== data.assignedTo.length) return null; // invalid user(s)
    
        for (const user of users) {
            if (user.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
                return 'unauthorized';
            }
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
        // Notify each assigned user
        for (const userId of data.assignedTo) {
            const message = `A task titled ${data.title} has been assigned to you.`;
    
            const savedNotification = await Notification.create({
                message,
                userId
            });
    
            emitNewNotification(userId.toString(), savedNotification);
        }
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

    // If user is not admin but tries to update admin-only fields → reject early
    if (user.role !== Role.Admin && (title || description || assignedTo || priority || dueDate)) {
        return 'forbidden'; 
    }

    // Notifications list to send
    const notifications: { message: string; userId: string }[] = [];

    if (user.role === Role.Admin) {

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
        
        if (Array.isArray(assignedTo)) {
            // validate all new assignees first
            for (const userId of assignedTo) {
              const assignedToUser = await User.findById(userId);
              if (!assignedToUser) continue; // skip invalid users
          
              if (assignedToUser.organizationId.toString() !== user.organizationId.toString()) {
                return 'unauthorized';
              }
            }
          
            // Replace the array instead of pushing
            task.assignedTo = assignedTo;
          
            // Notify all assignees about the updated assignment list
            assignedTo.forEach(uid => {
              notifications.push({
                message: `Task "${task.title}" assignees have been updated.`,
                userId: uid.toString()
              });
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
            const parsedDate = new Date(dueDate); // Ensure it's a Date object
            task.dueDate = parsedDate;
          
            task.assignedTo.forEach(uid => {
              notifications.push({
                message: `Task "${task.title}" due date changed to ${parsedDate.toDateString()}.`,
                userId: uid.toString()
              });
            });
          }
          

    }

    let statusChanged = false;

    if (task.assignedTo.some(uid => String(uid) === String(user.id)) || user.role === Role.Admin) {

        if (status) {
            task.status = status;
            statusChanged = true;

            task.assignedTo.forEach(uid => {
                if (uid.toString() !== user.id) {
                    notifications.push({
                        message: `Task "${task.title}" status changed to ${status}.`,
                        userId: uid.toString()
                    });
                }
            });
            if (user.role !== Role.Admin) {
                notifications.push({
                    message: `Task "${task.title}" status changed to ${status}.`,
                    userId: task.createdBy.toString()
                });
            }
        }
    };
    
    await task.save();

    // Emit only if status was changed for kanban board
    if (statusChanged) {
        emitTaskStatusUpdate(task.projectId.toString(), task);
    }

    // Save + emit notifications
    for (const notif of notifications) {
        const savedNotification = await Notification.create(notif);
        emitNewNotification(notif.userId, savedNotification);
    }

    //Return populated task
    const populatedTask = await task.populate("assignedTo", "name email");
    return populatedTask;
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

