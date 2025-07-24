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

organizationSchema.set('toJSON', {
    transform: function (
      _doc,
      ret: Record<string, any>
    ) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
});

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;