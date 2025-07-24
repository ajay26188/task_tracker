import { Schema, model } from 'mongoose';

export interface IOrganization {
    name: string
};

const organizationSchema = new Schema<IOrganization>(
    {
    name: { type: String, required: true},
    },
    {timestamps: true}
);

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;