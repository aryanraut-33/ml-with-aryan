
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
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

        const blogs = await Blog.aggregate([
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
                    title: 1, description: 1, thumbnailUrl: 1, tags: 1, createdAt: 1, views: 1, authorName: 1,
                    likeCount: 1, bookmarkCount: 1,
                    'author.username': '$authorInfo.username',
                }
            }
        ]);

        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
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
        const { title, content, tags, thumbnailUrl, description, authorName } = body;

        const blog = new Blog({
            title,
            content,
            tags,
            thumbnailUrl,
            description,
            authorName: authorName || user.username || 'Admin',
            author: user._id,
        });

        const createdBlog = await blog.save();

        await ViewCount.create({
            contentId: createdBlog._id,
            contentType: 'Blog',
        });

        return NextResponse.json(createdBlog, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json({ message: 'Server Error creating blog' }, { status: 500 });
    }
}
