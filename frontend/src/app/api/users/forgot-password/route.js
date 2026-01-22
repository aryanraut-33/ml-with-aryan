
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            // Security: Don't reveal if user exists
            return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // The reset URL must point to your LIVE VERCEL URL or localhost
        // We can filter the origin from request if needed, or use an ENV var
        // For now, I'll use a hardcoded value or NEXT_PUBLIC_BASE_URL if available
        // OR we can infer from req.url
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_API_URL || 'https://www.aryanraut.tech'; // Fallback
        const resetUrl = `${origin}/reset-password/${resetToken}`;

        const msg = {
            to: user.email,
            subject: 'Password Reset Request for ML with Aryan',
            html: `
        <p>You are receiving this because you have requested the reset of the password for your account.</p>
        <p>Please click on the following link to complete the process:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
        };

        await sendEmail(msg);

        return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
    }
}
