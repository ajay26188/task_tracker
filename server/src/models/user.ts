import { Schema, model, Types } from 'mongoose';

export enum Role {
    Admin = "admin",
    Member = "member"
};

export interface IUser {
    name: string, 
    email: string,
    password: string,
    organization: Types.ObjectId,
    role: Role,
};

const userSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true,
            minLength: [2, 'Name must be at lest 2 character long'],
            maxLength: [50, 'Name must be at most 50 characters long.'],
            trim: true //removes whitespaces 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Invalid email format'],
            trim: true
        },
        password: { 
            type: String, 
            required: true,
            minLength: [5, 'Password must be at least 5 characters long.'],
            validate: {
                validator: function (value: string) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
                },
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            } 
        },
        organization: { 
            type: Schema.Types.ObjectId, ref: 'Organization', 
            required: true
        },
        role: { 
            type: String,
            enum: Object.values(Role),
            default: Role.Member
        },
    },
    { timestamps: true}
);

userSchema.set('toJSON', {
    transform: function (
      _doc,
      ret: Record<string, any>
    ) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
});

const User = model<IUser>('User', userSchema);

export default User;