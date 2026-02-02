"use client";

import { useState } from "react";
import { FiMove, FiTrash2, FiArrowUp, FiArrowDown, FiType, FiImage, FiVideo, FiCode, FiPlus } from 'react-icons/fi';
import styles from "./DynamicForm.module.css";
import api from '@/lib/api';

export default function DynamicBlockEditor({ blocks, setBlocks }) {

    // Block Handlers
    const addBlock = (type) => {
        const newBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: getDefaultContentForType(type)
        };
        setBlocks([...blocks, newBlock]);
    };

    const getDefaultContentForType = (type) => {
        switch (type) {
            case 'text': return '';
            case 'heading': return '';
            case 'image': return { url: '', caption: '' };
            case 'video': return { url: '', caption: '' };
            case 'code': return { code: '', language: 'javascript', filename: '' };
            default: return '';
        }
    };

    const removeBlock = (index) => {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        setBlocks(newBlocks);
    };

    const moveBlock = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        newBlocks[index] = newBlocks[targetIndex];
        newBlocks[targetIndex] = temp;
        setBlocks(newBlocks);
    };

    const updateBlockContent = (index, content) => {
        const newBlocks = [...blocks];
        newBlocks[index].content = content;
        setBlocks(newBlocks);
    };

    const updateBlockField = (index, field, value) => {
        const newBlocks = [...blocks];
        // Ensure content is an object for structured types
        if (typeof newBlocks[index].content !== 'object') {
            // Should not happen for image/video/code
            return;
        }
        newBlocks[index].content = { ...newBlocks[index].content, [field]: value };
        setBlocks(newBlocks);
    };

    // Image Upload Logic for Blocks
    const handleBlockImageUpload = async (index, file) => {
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Upload immediately
            const res = await api.post('/api/upload-local', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateBlockField(index, 'url', res.data.url);
        } catch (err) {
            console.error("Block image upload failed", err);
            alert("Failed to upload image");
        }
    };

    // Render Component for a single block
    const renderBlockInput = (block, index) => {
        switch (block.type) {
            case 'heading':
                return (
                    <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlockContent(index, e.target.value)}
                        placeholder="Heading Text"
                        className={styles.input}
                        style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    />
                );
            case 'text':
                return (
                    <textarea
                        value={block.content}
                        onChange={(e) => updateBlockContent(index, e.target.value)}
                        placeholder="Write something..."
                        className={styles.textarea}
                        rows={4}
                    />
                );
            case 'image':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBlockImageUpload(index, e.target.files[0])}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={block.content.url || ''}
                            onChange={(e) => updateBlockField(index, 'url', e.target.value)}
                            placeholder="Or paste Image URL"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={block.content.caption || ''}
                            onChange={(e) => updateBlockField(index, 'caption', e.target.value)}
                            placeholder="Caption (optional)"
                            className={styles.input}
                        />
                        {block.content.url && (
                            <img src={block.content.url} alt="Preview" className={styles.imagePreview} style={{ maxHeight: '200px', objectFit: 'contain' }} />
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={block.content.url || ''}
                            onChange={(e) => updateBlockField(index, 'url', e.target.value)}
                            placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={block.content.caption || ''}
                            onChange={(e) => updateBlockField(index, 'caption', e.target.value)}
                            placeholder="Video Caption (optional)"
                            className={styles.input}
                        />
                    </div>
                );
            case 'code':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={block.content.filename || ''}
                                onChange={(e) => updateBlockField(index, 'filename', e.target.value)}
                                placeholder="Filename"
                                className={styles.input}
                            />
                            <select
                                value={block.content.language || 'javascript'}
                                onChange={(e) => updateBlockField(index, 'language', e.target.value)}
                                className={styles.select}
                                style={{ width: '150px' }}
                            >
                                <option value="javascript">JS</option>
                                <option value="python">Python</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="bash">Bash</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <textarea
                            value={block.content.code || ''}
                            onChange={(e) => updateBlockField(index, 'code', e.target.value)}
                            placeholder="Paste code here..."
                            className={styles.textarea}
                            rows={6}
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>
                );
            default:
                return <div>Unknown Block Type</div>;
        }
    };

    return (
        <div className={styles.blocksSection}>
            <h2 style={{ fontSize: '1.25rem', color: '#94a3b8' }}>Content Builder</h2>

            {/* Wrapper for draggable area if we used DnD, for now simpler up/down */}

            {blocks.map((block, index) => (
                <div key={block.id} className={styles.blockWrapper}>
                    <div className={styles.blockHeader}>
                        <span className={styles.blockTypeLabel}>{block.type}</span>
                        <div className={styles.blockControls}>
                            <button type="button" onClick={() => moveBlock(index, 'up')} className={styles.controlButton} title="Move Up"><FiArrowUp /></button>
                            <button type="button" onClick={() => moveBlock(index, 'down')} className={styles.controlButton} title="Move Down"><FiArrowDown /></button>
                            <button type="button" onClick={() => removeBlock(index)} className={`${styles.controlButton} ${styles.deleteButton}`} title="Remove"><FiTrash2 /></button>
                        </div>
                    </div>
                    {renderBlockInput(block, index)}
                </div>
            ))}

            {/* Add Block Toolbar */}
            <div className={styles.addBlockBar}>
                <button type="button" onClick={() => addBlock('heading')} className={styles.addBtn}><FiType /> Heading</button>
                <button type="button" onClick={() => addBlock('text')} className={styles.addBtn}><FiPlus /> Paragraph</button>
                <button type="button" onClick={() => addBlock('image')} className={styles.addBtn}><FiImage /> Image</button>
                <button type="button" onClick={() => addBlock('video')} className={styles.addBtn}><FiVideo /> Video</button>
                <button type="button" onClick={() => addBlock('code')} className={styles.addBtn}><FiCode /> Code</button>
            </div>
        </div>
    );
}
