
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Protect helper for App Router API Routes.
 * Returns the user object if authorized, or throws an error/returns null.
 * 
 * Usage in Route:
 * const user = await protect(req);
 * if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
 */
export const protect = async (req) => {
    await dbConnect();

    let token;
    const authHeader = req.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            return user;
        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
    }

    return null;
};

export const adminProtect = async (req) => {
    const user = await protect(req);
    if (user && user.isAdmin) {
        return user;
    }
    return null;
};
