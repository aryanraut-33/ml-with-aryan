
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth-helper';

export async function POST(req) {
    try {
        await dbConnect();

        // Parse JSON body
        // Next.js App Router: req.json()
        const body = await req.json();
        const { loginIdentifier, password } = body;

        // We must explicitly tell Mongoose to include the 'password' field
        // query logic
        const user = await User.findOne({
            $or: [
                { username: loginIdentifier },
                { phoneNumber: loginIdentifier },
                { email: loginIdentifier.toLowerCase() }
            ]
        }).select('+password');

        if (!user) {
            console.log(`Login failed: User not found for identifier '${loginIdentifier}'`);
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for user '${user.username}'`);
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            _id: user.id,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
