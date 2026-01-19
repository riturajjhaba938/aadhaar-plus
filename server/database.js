import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aadhaar_dashboard';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB via Mongoose'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Analyst' },
    createdAt: { type: Date, default: Date.now }
});

// Define AuditLog Schema
const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
});

// Create Models
export const User = mongoose.model('User', userSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default mongoose;
