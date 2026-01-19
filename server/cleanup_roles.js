import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from './database.js'; // Import User model

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env explicitly
dotenv.config({ path: join(__dirname, '.env') });

const cleanup = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Deleting users with role "User" or "Manager"...');
        const result = await User.deleteMany({ role: { $in: ['User', 'Manager'] } });

        console.log(`Deleted ${result.deletedCount} users.`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

cleanup();
