
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import Video from '@/models/Video';
import ViewCount from '@/models/ViewCount';
import User from '@/models/User'; // Ensure User is registered

export async function getLatestContentData() {
    await dbConnect();

    // Fetch the 4 most recent blogs
    const latestBlogs = await Blog.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('author', 'username')
        .lean();

    // Fetch the 4 most recent videos
    const latestVideos = await Video.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('author', 'username')
        .lean();

    // Helper to attach view counts and serialize
    const processItems = async (items, contentType) => {
        return Promise.all(items.map(async (item) => {
            const views = await ViewCount.findOne({ contentId: item._id, contentType: contentType }).lean();

            // Serialize for Server Components (convert ObjectId to string)
            return {
                ...item,
                _id: item._id.toString(),
                author: item.author ? { ...item.author, _id: item.author._id.toString() } : null,
                createdAt: item.createdAt ? item.createdAt.toISOString() : null,
                updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
                views: views ? views.count : 0
            };
        }));
    };

    const blogs = await processItems(latestBlogs, 'Blog');
    const videos = await processItems(latestVideos, 'Video');

    return { blogs, videos };
}

export async function getBlogById(id) {
    await dbConnect();
    const blog = await Blog.findById(id).populate('author', 'username').lean();
    if (!blog) return null;

    const views = await ViewCount.findOneAndUpdate(
        { contentId: blog._id, contentType: 'Blog' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    ).lean();

    return {
        ...blog,
        _id: blog._id.toString(),
        author: blog.author ? { ...blog.author, _id: blog.author._id.toString() } : null,
        createdAt: blog.createdAt ? blog.createdAt.toISOString() : null,
        updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : null,
        views: views.count
    };
}

export async function getVideoById(id) {
    await dbConnect();
    const video = await Video.findById(id).populate('author', 'username').lean();
    if (!video) return null;

    const views = await ViewCount.findOneAndUpdate(
        { contentId: video._id, contentType: 'Video' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    ).lean();

    return {
        ...video,
        _id: video._id.toString(),
        author: video.author ? { ...video.author, _id: video.author._id.toString() } : null,
        createdAt: video.createdAt ? video.createdAt.toISOString() : null,
        updatedAt: video.updatedAt ? video.updatedAt.toISOString() : null,
        views: views.count,
        authorName: video.authorName || (video.author ? video.author.username : 'Admin')
    };
}
