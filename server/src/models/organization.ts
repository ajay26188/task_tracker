import { Schema, model } from 'mongoose';

interface IOrganization {
    name: string
};

const organizationSchema = new Schema<IOrganization>(
    {
    name: { type: String, required: true},
    },
    {timestamps: true}
);

const Organization = model('Organization', organizationSchema);

module.exports = Organization;