// /services/organizations.ts

import Organization from "../models/organization";
import { IOrganization } from "../types/organization";

export const addOrganization = async(data: IOrganization) => {
    return await Organization.create(data);
};