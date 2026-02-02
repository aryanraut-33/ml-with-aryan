"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import AdminProjectCard from '@/components/AdminProjectCard';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/api/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', color: '#fff' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1.5rem'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #fff, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>Manage Projects</h1>

                <Link
                    href="/admin/projects/new"
                    style={{
                        backgroundColor: '#0ea5e9', // Blue color from image
                        color: 'white',
                        padding: '0.875rem 1.75rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}
                >
                    <span>+ New Project</span>
                </Link>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#64748b',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <p>No projects found. Create your first one!</p>
                    </div>
                ) : (
                    projects.map(project => (
                        <AdminProjectCard
                            key={project._id}
                            project={project}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
