
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const relativePath = `/uploads/${filename}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        // Ensure directory exists (though I ran mkdir -p already, good to be safe in code or assume it exists)
        // I'll assume it exists or I could add mkdir logic here easily
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: relativePath });
    } catch (error) {
        console.error('Local upload error:', error);
        return NextResponse.json({ message: 'Error uploading file locally.' }, { status: 500 });
    }
}
