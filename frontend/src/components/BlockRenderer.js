"use client";

import CodeBlock from '@/components/CodeBlock';
import { FiCode } from 'react-icons/fi';

// Helper to extract YouTube ID
function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function BlockRenderer({ blocks, styles }) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className={styles.blocksContainer}>
            {blocks.map((block) => {
                switch (block.type) {
                    case 'heading':
                        const HeadingTag = typeof block.content === 'object' ? (block.content.level || 'h2') : 'h2';
                        const headingText = typeof block.content === 'object' ? block.content.text : block.content;
                        return <HeadingTag key={block.id || Math.random()} className={styles.blockHeading}>{headingText}</HeadingTag>;
                    case 'text':
                        // Supporting paragraphs with line breaks
                        return (
                            <div key={block.id || Math.random()} className={styles.blockText}>
                                {block.content.split('\n').map((line, i) => (
                                    <p key={i} style={{ marginBottom: line.trim() ? '1em' : '0' }}>{line}</p>
                                ))}
                            </div>
                        );
                    case 'image':
                        return (
                            <div key={block.id || Math.random()} className={styles.blockImageWrapper}>
                                <img
                                    src={block.content.url}
                                    alt={block.content.caption || 'Image'}
                                    className={styles.blockImage}
                                />
                                {block.content.caption && <p className={styles.caption}>{block.content.caption}</p>}
                            </div>
                        );
                    case 'video':
                        const vId = getYouTubeId(block.content.url);
                        if (!vId) return (
                            <div key={block.id || Math.random()} style={{ color: 'red' }}>
                                Invalid Video URL
                            </div>
                        );
                        return (
                            <div key={block.id || Math.random()} className={styles.blockVideoContainer}>
                                <div className={styles.videoWrapper} style={{ marginBottom: '0.5rem' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${vId}`}
                                        className={styles.iframe}
                                        allowFullScreen
                                    />
                                </div>
                                {block.content.caption && <p className={styles.caption}>{block.content.caption}</p>}
                            </div>
                        );
                    case 'code':
                        return (
                            <CodeBlock
                                key={block.id || Math.random()}
                                language={block.content.language}
                                code={block.content.code}
                                filename={block.content.filename}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}
