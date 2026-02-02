import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { adminProtect } from '@/lib/auth-helper';

// ✅ GET: Fetch all projects (with optional filtering)
export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'Fundamental' or 'Production'

        let query = {};
        if (type) {
            query.type = type;
        }

        const projects = await Project.find(query).sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });

    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// ✅ POST: Create a new project (Admin Only)
export async function POST(request) {
    try {
        const user = await adminProtect(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        // Validation could be added here

        const newProject = await Project.create({
            ...body,
            author: user._id
        });

        return NextResponse.json(newProject, { status: 201 });

    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
