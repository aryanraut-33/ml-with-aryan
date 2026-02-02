import ProjectsPageClient from '@/components/ProjectsPageClient';

// Force dynamic rendering if we want always fresh data, or we can use revalidate.
// For now, let's force dynamic to ensure updates are seen immediately.
export const dynamic = 'force-dynamic';

async function getProjects() {
    try {
        // In a server component, we can call the DB directly or fetch via absolute URL if API is preferred.
        // Direct DB call effectively avoids network overhead, but good practice often separates concerns.
        // However, for Next 13+ Server Components, creating a util function to fetch data is best.
        // I can reuse the logic, but for simplicity of "portability", I'll use the API URL or direct DB logic.
        // Since I'm in the same app, I should import the logic or fetch from localhost.
        // Let's import the data fetching logic if possible, or just fetch from API.
        // Re-implementing fetch logic here to avoid self-referencing API calls during build time issues with relative URLs.

        // Actually, let's import the model and connect here, it's safer for server components.
        const { default: dbConnect } = await import('@/lib/db');
        const { default: Project } = await import('@/models/Project');

        await dbConnect();
        const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

        // Serialize
        return projects.map(p => ({
            ...p,
            _id: p._id.toString(),
            author: p.author ? p.author.toString() : null,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
            codeBlocks: p.codeBlocks?.map(block => ({
                ...block,
                _id: block._id.toString(),
            })) || [],
            blocks: p.blocks?.map(item => ({
                ...item,
                _id: item._id ? item._id.toString() : undefined,
            })) || [],
        }));

    } catch (error) {
        console.error('Failed to fetch projects', error);
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getProjects();
    return <ProjectsPageClient initialProjects={projects} />;
}
