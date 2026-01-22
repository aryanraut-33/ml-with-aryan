
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { adminProtect } from '@/lib/auth-helper';

export async function POST(req) {
    try {
        const user = await adminProtect(req);
        if (!user) {
            return NextResponse.json({ message: 'Not authorized as an admin' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary using promise-based stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ message: 'Error uploading to Cloudinary.' }, { status: 500 });
    }
}
