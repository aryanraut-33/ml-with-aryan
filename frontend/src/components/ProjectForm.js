"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./DynamicForm.module.css";
import api from '@/lib/api';
import DynamicBlockEditor from './DynamicBlockEditor';

export default function ProjectForm({ initialData = null }) {
    const router = useRouter();
    const isEditMode = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Metadata State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Fundamental",
        thumbnailUrl: "",
        technologies: "",
        demoUrl: "",
        repoUrl: "",
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);

    // Blocks State
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                type: initialData.type || "Fundamental",
                thumbnailUrl: initialData.thumbnailUrl || "",
                technologies: initialData.technologies ? initialData.technologies.join(", ") : "",
                demoUrl: initialData.demoUrl || "",
                repoUrl: initialData.repoUrl || "",
            });

            // Initialize blocks
            if (initialData.blocks && initialData.blocks.length > 0) {
                setBlocks(initialData.blocks);
            } else {
                const migratedBlocks = [];
                if (initialData.codeBlocks) {
                    initialData.codeBlocks.forEach(cb => {
                        migratedBlocks.push({
                            id: Math.random().toString(36).substr(2, 9),
                            type: 'code',
                            content: { code: cb.code, language: cb.language, filename: cb.filename }
                        });
                    });
                }
                setBlocks(migratedBlocks);
            }
        } else {
            // New Project - Start with one text block
            setBlocks([{ id: 'init-1', type: 'text', content: '' }]);
        }
    }, [initialData]);

    // Metadata Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    // We can reuse the same image upload logic or just rely on DynamicBlockEditor for blocks

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

            // 1. Upload Main Thumbnail if changed
            if (thumbnailFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', thumbnailFile);

                const uploadRes = await api.post('/api/upload-local', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalThumbnailUrl = uploadRes.data.url;
            }

            // 2. Prepare Payload
            const payload = {
                ...formData,
                thumbnailUrl: finalThumbnailUrl,
                technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
                blocks, // The dynamic part
            };

            const url = isEditMode
                ? `/api/projects/${initialData._id}`
                : "/api/projects";
            const method = isEditMode ? "put" : "post"; // axios methods are lowercase

            await api[method](url, payload);

            router.push("/admin/projects");
            router.refresh();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || "Failed to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            {error && <div style={{ gridColumn: '1 / -1', color: 'red', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

            {/* LEFT COLUMN: Main Content */}
            <div className={styles.mainColumn}>

                {/* Basic Info Panel */}
                <div>
                    <label className={styles.label} style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Project Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={styles.input}
                        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                        placeholder="My Awesome Project"
                        required
                    />
                </div>

                <div>
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows={3}
                        placeholder="What is this project about?"
                        required
                    />
                </div>

                {/* Dynamic Blocks */}
                <div className={styles.panel} style={{ border: 'none', padding: 0, background: 'transparent' }}>
                    <h3 className={styles.sectionTitle}>Project Content</h3>
                    <DynamicBlockEditor blocks={blocks} setBlocks={setBlocks} />
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Metadata */}
            <div className={styles.sidebarColumn}>

                {/* Actions Panel */}
                <div className={styles.panel}>
                    <button type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "Saving..." : isEditMode ? "Update Project" : "Create Project"}
                    </button>
                </div>

                {/* Thumbnail Panel */}
                <div className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Thumbnail</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        {formData.thumbnailUrl && !thumbnailFile && (
                            <img src={formData.thumbnailUrl} alt="Current" className={styles.imagePreview} style={{ marginBottom: '1rem' }} />
                        )}
                        {thumbnailFile && (
                            <div className={styles.imagePreview} style={{ background: '#333', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                New Image Selected
                            </div>
                        )}
                        <input type="file" onChange={handleFileChange} className={styles.input} accept="image/*" />
                    </div>
                </div>

                {/* Details Panel */}
                <div className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Details</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
                            <option value="Fundamental">Fundamental</option>
                            <option value="Production">Production</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>Technologies</label>
                        <input name="technologies" value={formData.technologies} onChange={handleChange} className={styles.input} placeholder="React, Python..." />
                        <small style={{ color: '#666' }}>Comma separated</small>
                    </div>
                </div>

                {/* Links Panel */}
                <div className={styles.panel}>
                    <h3 className={styles.sectionTitle}>Links</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className={styles.label}>Demo URL</label>
                        <input name="demoUrl" value={formData.demoUrl} onChange={handleChange} className={styles.input} placeholder="https://..." />
                    </div>
                    <div>
                        <label className={styles.label}>Repo URL</label>
                        <input name="repoUrl" value={formData.repoUrl} onChange={handleChange} className={styles.input} placeholder="https://github.com/..." />
                    </div>
                </div>

            </div>
        </form>
    );
}
