// /services/comments.ts

import { newCommentData } from "../types/comment";
import { IUser } from "../types/user";
import { Document } from "mongoose";
import Comment from "../models/comment";
import Task from "../models/task";

//fetch all comments for a task with req.query
export const fetchAllComments = async(taskId: string, authenticatedUser: (IUser & Document)) => {
    const task = await Task.findById(taskId);

    if (!task) return null;

    if (task.organizationId.toString() !== authenticatedUser.organizationId.toString()) {
        return 'unauthorized';
    }

    //fetching all comments in reverse chat-style newest first
    const comments = await Comment.find({ taskId })
    .sort({ createdAt: 1 }); // oldest -> newest 

    return comments;
};

// data contains 'comment' and 'taskId' fields..
export const addComment = async(data: newCommentData, authenticatedUser: (IUser & Document))  => {

    const task = await Task.findById(data.taskId);

    if (!task) return null;

    // Check first if the person commenting is the creator or assignee of the task
    const isCreator = task.createdBy.toString() === authenticatedUser.id;
    const isAssigned = task.assignedTo.some(
        id => id.toString() === authenticatedUser.id
    );

    if (!isCreator && !isAssigned) {
        return 'unauthorized';
    }

    const orgId = authenticatedUser.organizationId;

    const user = authenticatedUser._id;

    return await Comment.create({
        ...data,
        userId: user,
        organizationId: orgId,
    });
};

export const removeComment = async(id: string, authenticatedUser: (IUser & Document)) => {
    const comment = await Comment.findById(id);

    if (!comment) return null;

    if (comment.userId.toString() !== authenticatedUser.id) {
        return 'unauthorized';
    }

    return await comment.deleteOne();
};