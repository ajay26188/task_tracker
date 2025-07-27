import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

const connectDB = async() => {
    try {
        mongoose.connect(MONGODB_URI);
        console.log('connected to mongodb..')
    } catch (error: any) {
        console.error('MONGODB connection failed.', error.message);
    }
};

export default connectDB;