import { Schema, model } from 'mongoose';
import { IProject } from '../types/project';

const projectSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true,
            minLength: [2, 'Name must be at least 2 characters long.'],
            maxLength: [100, 'Name must be at most 100 characters long.'],
            trim: true
        },
        description: { 
            type: String, 
            required: true,
            maxLength: [1000, 'Description must be at most 1000 characters long.'],
            trim: true 
        },
        startDate: {
            type: Date,
            required: true
          },
        endDate: {
            type: Date,
            required: true
        },
        organizationId: { 
            type: Schema.Types.ObjectId, ref: 'Organization', 
            required: true 
        },
        createdBy: { 
            type: Schema.Types.ObjectId, ref: 'User', 
            required: true }
    },
    { timestamps: true},
);

projectSchema.set('toJSON', {
    transform: function (
      _doc, ret: any
    ) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
    }
});
  

const Project = model<IProject>('Project', projectSchema);

export default Project;