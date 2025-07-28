// /services/users.ts

import { Types } from "mongoose";
import User from "../models/user"
import { newUserData, ReturnedIUser, Role } from "../types/user";

export const getAllUsers = async(id: string) => {
    return await User.find({organizationId: new Types.ObjectId(id)});
};

export const addUser = async(data: newUserData): Promise<ReturnedIUser> => {

    const isFirstUser = await User.countDocuments({organizationId: new Types.ObjectId(data.organizationId)});
    const role = isFirstUser ? Role.Admin : Role.Member;

    //add role field manually to database
    return await User.create({
        ...data,
        role
    });
};