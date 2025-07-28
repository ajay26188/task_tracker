// /services/users.ts

import { Types } from "mongoose";
import User from "../models/user"
import { newUserData, Role } from "../types/user";
import bcrypt from 'bcrypt';

export const getAllUsers = async(id: string) => {
    return await User.find({organizationId: new Types.ObjectId(id)});
};

export const addUser = async(data: newUserData) => {

    //making sure that first user for an organization is the admin
    const isFirstUser = await User.countDocuments({organizationId: new Types.ObjectId(data.organizationId)});
    const role = isFirstUser ? Role.Admin : Role.Member;

    //next two lines for hashing password
    const saltRounds = 10;
    const password = await bcrypt.hash(data.password, saltRounds);

    //add role field manually to database
    return await User.create({
        ...data,
        password,
        role
    });
};