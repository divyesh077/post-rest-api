import mongoose from 'mongoose';

import { env } from './env.js';

export const connectToDB = async () => {
  try {
    await mongoose.connect(env.mongodb.uri);

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export const disconnectFromDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnect failed:', error.message);
    throw error;
  }
};
