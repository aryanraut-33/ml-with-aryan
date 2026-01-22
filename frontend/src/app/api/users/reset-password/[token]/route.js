
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth-helper';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { token } = await params;
        const { password } = await req.json();

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        const newToken = generateToken(user._id);

        return NextResponse.json({
            _id: user.id,
            name: user.name,
            username: user.username,
            isAdmin: user.isAdmin,
            token: newToken,
            message: 'Password has been reset successfully.'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
