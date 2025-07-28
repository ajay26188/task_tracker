import { Schema, model } from 'mongoose';
import { IOrganization } from '../types/organization';

const organizationSchema = new Schema<IOrganization>(
    {
    name: { type: String, required: true, unique: true },
    },
    {timestamps: true}
);

organizationSchema.set('toJSON', {
    transform: function (
      _doc, ret: any
    ) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
    }
});

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;