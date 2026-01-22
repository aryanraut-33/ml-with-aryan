
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Like from '@/models/Like';
import { protect } from '@/lib/auth-helper';

export async function POST(req, { params }) {
    try {
        const user = await protect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        await dbConnect();
        const { contentId } = await params;
        const body = await req.json();
        const { contentType } = body; // 'blog' or 'video'

        const existingLike = await Like.findOne({ userId: user._id, contentId });

        if (existingLike) {
            await existingLike.deleteOne();
            return NextResponse.json({ liked: false });
        } else {
            await Like.create({
                userId: user._id,
                contentId,
                contentType: contentType === 'blog' ? 'Blog' : 'Video'
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error('Like Toggle Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
