const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load env from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading .env.local');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim();
            if (key && val) process.env[key] = val;
        }
    });
} else {
    // try .env
    const envPath2 = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath2)) {
        console.log('Loading .env');
        const envConfig = fs.readFileSync(envPath2, 'utf8');
        envConfig.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim();
                if (key && val) process.env[key] = val;
            }
        });
    }
}

const MONGO_URI = process.env.MONGO_URI;
console.log('Using MONGO_URI:', MONGO_URI ? 'Defined' : 'Undefined');

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined. Please check .env.local or .env');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    phoneNumber: String
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const count = await User.countDocuments();
        console.log(`Total users found: ${count}`);

        if (count > 0) {
            const users = await User.find({}, 'username email phoneNumber');
            console.log('Users:', JSON.stringify(users, null, 2));
        } else {
            console.log('No users found in the database.');
        }

    } catch (error) {
        console.error('Error connecting to DB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

run();
