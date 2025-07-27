import Organization from "../models/organization";
import { IOrganization } from "../types/organization.types";

export const addOrganization = async(data: IOrganization) => {
    return await Organization.create(data);
};