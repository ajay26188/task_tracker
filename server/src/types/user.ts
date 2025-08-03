// /types/user.ts

import { Types } from 'mongoose';

export enum Role {
    Admin = "admin",
    Member = "member"
};

export interface IUser {
    name: string, 
    email: string,
    password: string,
    organizationId: Types.ObjectId,
    role: Role,
};

export interface ReturnedIUser {
    _id?: Types.ObjectId,
    password?: string,
    __v?: number, // operand of 'delete' operator must be optional
    id?: string,
    name: string, 
    email: string,
    organizationId: Types.ObjectId,
    role: Role,
    createdAt?: Date;
    updatedAt?: Date;
};

//removing organizationId field which is of Mongo_DB type but asking for 
export type newUserData = Omit<IUser, 'role' | 'organizationId'>  & { organizationId: string };

export interface LoginData {
    email: string,
    password: string
};

export type updateUserData = Omit<IUser, 'role' | 'organizationId'> ;