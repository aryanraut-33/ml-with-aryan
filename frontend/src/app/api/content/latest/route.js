
import { NextResponse } from 'next/server';
import { getLatestContentData } from '@/lib/data';

export async function GET(req) {
    try {
        const data = await getLatestContentData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching latest content:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
