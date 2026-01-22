
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bookmark from '@/models/Bookmark';
import Blog from '@/models/Blog';
import Video from '@/models/Video';
import { protect } from '@/lib/auth-helper';

export async function GET(req) {
    try {
        const user = await protect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const bookmarks = await Bookmark.find({ userId: user._id });
        const blogIds = bookmarks.filter(b => b.contentType === 'Blog').map(b => b.contentId);
        const videoIds = bookmarks.filter(b => b.contentType === 'Video').map(b => b.contentId);

        const blogs = await Blog.find({ '_id': { $in: blogIds } }).populate('author', 'username authorName');
        const videos = await Video.find({ '_id': { $in: videoIds } }).populate('author', 'username authorName');

        return NextResponse.json({ blogs, videos });
    } catch (error) {
        console.error('Bookmarks Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
