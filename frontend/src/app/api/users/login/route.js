
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
        const user = await User.findOne({
            $or: [{ username: loginIdentifier }, { phoneNumber: loginIdentifier }]
        }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            return NextResponse.json({
                _id: user.id,
                name: user.name,
                username: user.username,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
