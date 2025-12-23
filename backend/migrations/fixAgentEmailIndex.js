import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixAgentEmailIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('agents');

    // Drop the old email index
    try {
      await collection.dropIndex('email_1');
      console.log('Dropped old email_1 index');
    } catch (error) {
      console.log('Index email_1 does not exist or already dropped');
    }

    // Create new sparse unique index
    await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('Created new sparse unique index on email');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

fixAgentEmailIndex();
