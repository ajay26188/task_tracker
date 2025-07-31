// /services/organizations.ts

import Organization from "../models/organization";
import { IOrganization } from "../types/organization";
import { IUser } from "../types/user";
import { Document } from "mongoose";

export const getOrganization = async(id: string) => {
    const org = await Organization.findById(id);

    if (!org) return null;

    return org;
};

export const addOrganization = async(data: IOrganization) => {
    return await Organization.create(data);
};

export const removeOrganization = async(id: string) => {
    const organization = await Organization.findById(id);

    if (!organization) return null;

    return await organization.deleteOne();
};

export const updateOrganization = async (orgId: string, updates: IOrganization, user: (IUser & Document)) => {
    if (orgId !== user.organizationId.toString()) return 'unauthorized'

    const { name } = updates;

    const org = await Organization.findById(orgId);

    if (!org) return null;
  
    if (name) org.name = name;
  
    return await org.save();
};