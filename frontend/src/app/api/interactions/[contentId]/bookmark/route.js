
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bookmark from '@/models/Bookmark';
import { protect } from '@/lib/auth-helper';

export async function POST(req, { params }) {
    try {
        const user = await protect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        await dbConnect();
        const { contentId } = params;
        const body = await req.json();
        const { contentType } = body; // 'blog' or 'video'

        const existingBookmark = await Bookmark.findOne({ userId: user._id, contentId });

        if (existingBookmark) {
            await existingBookmark.deleteOne();
            return NextResponse.json({ bookmarked: false });
        } else {
            await Bookmark.create({
                userId: user._id,
                contentId,
                contentType: contentType === 'blog' ? 'Blog' : 'Video'
            });
            return NextResponse.json({ bookmarked: true });
        }
    } catch (error) {
        console.error('Bookmark Toggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
