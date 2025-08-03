// /services/users.ts

import { Types } from "mongoose";
import User from "../models/user";
import { IUser, newUserData, Role } from "../types/user";
import bcrypt from 'bcrypt';
import { Document } from "mongoose";

export const getAllUsers = async(id: string) => {
    return await User.find({organizationId: new Types.ObjectId(id)});
};

export const addUser = async(data: newUserData) => {

    //making sure that first user for an organization is the admin
    const userCount = await User.countDocuments({organizationId: new Types.ObjectId(data.organizationId)});
    const role = userCount === 0 ? Role.Admin : Role.Member;

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

export const removeUser = async(id: string) => {
    const user = await User.findById(id);

    if (!user) return null;

    return await user.deleteOne();
};

export const updateUser = async (user: (IUser & Document), updates: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    const { name, email, password } = updates;
  
    if (name) user.name = name;
    if (email) user.email = email;
  
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }
  
    return await user.save();
};

export const updateRoleOfUser = async (id: string, updates: {
    role: Role
  }, admin: (IUser & Document)) => {
    const { role } = updates;

    const user = await User.findById(id);

    if (!user) return null;

    if (admin.organizationId.toString() !== user.organizationId.toString()) {
        return 'unauthorized'
    }

    user.role = role;
  
    return await user.save();
};