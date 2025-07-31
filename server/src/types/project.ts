// /types/project.ts

import { Types } from "mongoose"

export interface IProject {
    name: string,
    description: string,
    organizationId: Types.ObjectId,
    createdBy: Types.ObjectId
};

export interface ReturnedIProject {
    _id?: Types.ObjectId,
    __v?: number, // operand of 'delete' operator must be optional
    id?: string,
    name: string,
    description: string,
    organizationId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    createdBy: Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
};