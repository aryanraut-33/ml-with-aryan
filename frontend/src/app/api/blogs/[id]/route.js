
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import ViewCount from '@/models/ViewCount';
import User from '@/models/User';
import { adminProtect } from '@/lib/auth-helper';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const blog = await Blog.findById(id).populate('author', 'username');

        if (blog) {
            const views = await ViewCount.findOneAndUpdate(
                { contentId: blog._id, contentType: 'Blog' },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );
            return NextResponse.json({ ...blog.toObject(), views: views.count });
        } else {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const user = await adminProtect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const { title, content, tags, thumbnailUrl, description, authorName } = body;

        const blog = await Blog.findById(id);

        if (blog) {
            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.tags = tags || blog.tags;
            blog.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : blog.thumbnailUrl;
            blog.description = description || blog.description;
            blog.authorName = authorName || blog.authorName;

            const updatedBlog = await blog.save();
            return NextResponse.json(updatedBlog);
        } else {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = await adminProtect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const { id } = params;
        const blog = await Blog.findById(id);

        if (blog) {
            await blog.deleteOne();
            await ViewCount.deleteOne({ contentId: blog._id });
            return NextResponse.json({ message: 'Blog removed' });
        } else {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
