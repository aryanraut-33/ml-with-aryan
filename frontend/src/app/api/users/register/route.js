
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth-helper';

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { name, username, email, phoneNumber, password } = body;

        if (!name || !username || !email || !phoneNumber || !password) {
            return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
        }

        // 1. Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
        }

        // 2. Phone Number Validation
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return NextResponse.json({ message: 'Please enter a valid phone number (digits only).' }, { status: 400 });
        }

        // 3. Password Strength Validation
        if (password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
        }
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ message: 'Password must contain at least one uppercase letter.' }, { status: 400 });
        }
        if (!/[a-z]/.test(password)) {
            return NextResponse.json({ message: 'Password must contain at least one lowercase letter.' }, { status: 400 });
        }
        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ message: 'Password must contain at least one number.' }, { status: 400 });
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return NextResponse.json({ message: 'Password must contain at least one special character (!@#$%^&*).' }, { status: 400 });
        }

        const userExists = await User.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
        if (userExists) {
            return NextResponse.json({ message: 'User with this username, email, or phone number already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, username, email, phoneNumber,
            password: hashedPassword,
        });

        if (user) {
            return NextResponse.json({
                _id: user.id, name: user.name, username: user.username, isAdmin: user.isAdmin,
                token: generateToken(user._id),
            }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
        }

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
