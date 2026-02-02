"use client";

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import styles from './ProjectsPageClient.module.css';

export default function ProjectsPageClient({ initialProjects }) {
    const [filter, setFilter] = useState('Fundamental'); // 'Fundamental', 'Production'

    const filteredProjects = initialProjects.filter(project => {
        return project.type === filter;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Projects Gallery</h1>
                <p className={styles.subtitle}>Explore my journey through code, from fundamental algorithms to production-grade applications.</p>

                <div className={styles.toggleWrapper}>
                    <div className={styles.toggleContainer}>
                        {['Fundamental', 'Production'].map((type) => (
                            <button
                                key={type}
                                className={`${styles.toggleButton} ${filter === type ? styles.active : ''}`}
                                onClick={() => setFilter(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                        <ProjectCard key={project._id} project={project} />
                    ))
                ) : (
                    <p className={styles.emptyState}>No projects found for this category.</p>
                )}
            </div>
        </div>
    );
}
