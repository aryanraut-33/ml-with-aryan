"use client";

import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ marginBottom: '2rem' }}>Create New Project</h1>
            <ProjectForm />
        </div>
    );
}
