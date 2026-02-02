"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProjectForm from '@/components/ProjectForm';

export default function EditProjectPage() {
    const params = useParams(); // params might need to be awaited in newer Next.js if using directly in page, but useParams hook handles it in client components
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Unwrap params if necessary or just use params.id directly if it works (client component)
        // In Next 15/16 params is a promise in Server Components, but useParams() in Client Components returns the object directly.
        // Wait, params (prop) is a promise, useParams (hook) returns params. 
        if (params?.id) {
            fetchProject(params.id);
        }
    }, [params?.id]);

    const fetchProject = async (id) => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            } else {
                alert('Project not found');
                router.push('/admin/projects');
            }
        } catch (error) {
            console.error('Failed to fetch project', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;
    if (!project) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ marginBottom: '2rem' }}>Edit Project</h1>
            <ProjectForm initialData={project} />
        </div>
    );
}
