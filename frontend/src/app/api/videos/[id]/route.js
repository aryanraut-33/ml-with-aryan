
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import ViewCount from '@/models/ViewCount';
import User from '@/models/User';
import { adminProtect } from '@/lib/auth-helper';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const video = await Video.findById(id).populate('author', 'username');

        if (video) {
            const views = await ViewCount.findOneAndUpdate(
                { contentId: video._id, contentType: 'Video' },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );

            return NextResponse.json({
                ...video.toObject(),
                views: views.count,
                authorName: video.authorName || (video.author ? video.author.username : 'Admin')
            });
        } else {
            return NextResponse.json({ message: 'Video not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching video:', error);
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
        const { title, description, videoUrl, tags } = body;

        const video = await Video.findById(id);

        if (video) {
            video.title = title || video.title;
            video.description = description || video.description;
            video.videoUrl = videoUrl || video.videoUrl;
            video.tags = tags || video.tags;
            video.authorName = user.username || video.authorName; // Optional update

            const updatedVideo = await video.save();
            return NextResponse.json(updatedVideo);
        } else {
            return NextResponse.json({ message: 'Video not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating video:', error);
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
        const video = await Video.findById(id);

        if (video) {
            await video.deleteOne();
            await ViewCount.deleteOne({ contentId: video._id });
            return NextResponse.json({ message: 'Video removed' });
        } else {
            return NextResponse.json({ message: 'Video not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
