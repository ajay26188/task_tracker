// /services/users.ts

import { Types } from "mongoose";
import User from "../models/user"
import { newUserData } from "../types/user";

export const getAllUsers = async(id: string) => {
    return await User.find({organizationId: new Types.ObjectId(id)});
};

export const addUser = async(data: newUserData) => {
    return await User.create(data);
};