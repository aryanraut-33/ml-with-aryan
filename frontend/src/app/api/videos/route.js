
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import ViewCount from '@/models/ViewCount';
import User from '@/models/User';
import Like from '@/models/Like';
import Bookmark from '@/models/Bookmark';
import { adminProtect } from '@/lib/auth-helper';

export async function GET(req) {
    try {
        await dbConnect();

        // Parse URL params
        const { searchParams } = new URL(req.url);
        const sort = searchParams.get('sort');
        const sortBy = sort === 'popular' ? 'views' : 'createdAt';

        const videos = await Video.aggregate([
            { $lookup: { from: 'viewcounts', localField: '_id', foreignField: 'contentId', as: 'viewInfo' } },
            { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorInfo' } },
            { $lookup: { from: 'likes', localField: '_id', foreignField: 'contentId', as: 'likes' } },
            { $lookup: { from: 'bookmarks', localField: '_id', foreignField: 'contentId', as: 'bookmarks' } },
            { $unwind: { path: '$viewInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$authorInfo', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    views: { $ifNull: ['$viewInfo.count', 0] },
                    likeCount: { $size: '$likes' },
                    bookmarkCount: { $size: '$bookmarks' }
                }
            },
            { $sort: { [sortBy]: -1 } },
            {
                $project: {
                    title: 1, description: 1, videoUrl: 1, tags: 1, createdAt: 1, views: 1, authorName: 1,
                    likeCount: 1, bookmarkCount: 1,
                    'author.username': '$authorInfo.username',
                }
            }
        ]);

        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await adminProtect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, videoUrl, tags } = body;

        const video = new Video({
            title,
            description,
            videoUrl,
            tags,
            author: user._id,
            authorName: user.username || 'Admin'
        });

        const createdVideo = await video.save();
        await ViewCount.create({ contentId: createdVideo._id, contentType: 'Video' });

        return NextResponse.json(createdVideo, { status: 201 });
    } catch (error) {
        console.error('Error creating video:', error);
        return NextResponse.json({ message: 'Server Error creating video' }, { status: 500 });
    }
}
