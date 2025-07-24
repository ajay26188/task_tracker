import { Schema, model, Types } from 'mongoose';

export interface IOrganization {
    name: string
};

export interface ReturnedIOrganization {
    _id?: Types.ObjectId,
    __v?: number,
    id?: string,
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
      _doc, ret: ReturnedIOrganization
    ) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
    }
});

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;