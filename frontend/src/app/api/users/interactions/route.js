
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Like from '@/models/Like';
import Bookmark from '@/models/Bookmark';
import { protect } from '@/lib/auth-helper';

export async function POST(req) {
    try {
        const user = await protect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const { contentIds } = await req.json();

        if (!contentIds || !Array.isArray(contentIds)) {
            return NextResponse.json({ liked: [], bookmarked: [] });
        }

        const likes = await Like.find({ userId: user._id, contentId: { $in: contentIds } }).select('contentId');
        const bookmarks = await Bookmark.find({ userId: user._id, contentId: { $in: contentIds } }).select('contentId');

        return NextResponse.json({
            liked: likes.map(l => l.contentId),
            bookmarked: bookmarks.map(b => b.contentId),
        });

    } catch (error) {
        console.error('Interactions Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
