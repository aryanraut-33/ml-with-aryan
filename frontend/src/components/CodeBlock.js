"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ language, code, filename, repoUrl }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault(); // Prevent link navigation if inside typical container (though button handles it)
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Mobile View: collapsed link to repo */}
            <div className={styles.mobileView}>
                <a
                    href={repoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mobileButton}
                    onClick={(e) => !repoUrl && e.preventDefault()}
                >
                    <span>{filename || 'View Code'}</span>
                    <FiExternalLink />
                </a>
            </div>

            {/* Desktop View: full code block */}
            <div className={styles.desktopView} style={{
                marginTop: '1.5rem',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #333',
                background: '#1e1e1e',
                maxWidth: '100%',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    background: '#252526',
                    borderBottom: '1px solid #333'
                }}>
                    <span style={{ color: '#ccc', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {filename || language}
                    </span>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: copied ? '#4ade80' : '#888',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.8rem',
                            transition: 'color 0.2s'
                        }}
                    >
                        {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                    </button>
                </div>
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        background: 'transparent' // Use container background
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </>
    );
}
