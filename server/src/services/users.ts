// /services/users.ts

import { FilterQuery, Types } from "mongoose";
import User from "../models/user";
import { IUser, newUserData, Role } from "../types/user";
import bcrypt from 'bcrypt';
import { Document } from "mongoose";
import Organization from "../models/organization";
import { sendVerificationEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../utils/mailer";

export const getAllUsers = async (orgId: string, search?: string): Promise<IUser[]> => {
  const query: FilterQuery<IUser> = { organizationId: new Types.ObjectId(orgId) };

  if (search) {
    query.name = { $regex: search, $options: "i" }; // contains search, case-insensitive
  }

  return await User.find(query).select("id name email");
};

export const addUser = async(data: newUserData) => {

    //First making sure that organization exists
    const org = await Organization.findById(data.organizationId);

    if (!org) return null;

    //making sure that first user for an organization is the admin
    const userCount = await User.countDocuments({organizationId: new Types.ObjectId(data.organizationId)});
    
    const role = userCount === 0 ? Role.Admin : Role.Member;

    //next two lines for hashing password
    const saltRounds = 10;
    const password = await bcrypt.hash(data.password, saltRounds);

    //add role field manually to database
    const user = await User.create({
        ...data,
        password,
        role,
        isVerified: false, // not verified yet
      });
    
      // Generate a token valid for 1 day
      const token = jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET!, { expiresIn: "1d" });
    
      // Send verification email
      await sendVerificationEmail(user.email, token);
    
      return user;
};

// Verify email token and mark user as verified
export const verifyUserEmail = async (token: string) => {
    
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET!) as { userId: string };

    // Update user
    const user = await User.findByIdAndUpdate(
    decoded.userId,
    { isVerified: true }
    );

    if (!user) return null;

    return user;
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
        return 'unauthorized';
    }

    user.role = role;
  
    return await user.save();
};

// Generate and send reset token
export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const token = jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET!, { expiresIn: "1h" });

  await sendPasswordResetEmail(user.email, token);
  return true;
};

// Verify token & reset password
export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) return null;

    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    return true;
  } catch  {
    return null;
  }
};
