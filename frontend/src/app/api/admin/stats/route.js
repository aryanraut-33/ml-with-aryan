
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Like from '@/models/Like';
import Bookmark from '@/models/Bookmark';
import { adminProtect } from '@/lib/auth-helper';

export async function GET(req) {
    try {
        const user = await adminProtect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        await dbConnect();

        // Count documents in each collection efficiently
        const totalLikes = await Like.countDocuments();
        const totalBookmarks = await Bookmark.countDocuments();

        return NextResponse.json({ totalLikes, totalBookmarks });
    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ message: 'Server Error fetching stats' }, { status: 500 });
    }
}
