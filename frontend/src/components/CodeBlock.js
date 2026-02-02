"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export default function CodeBlock({ language, code, filename }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            marginTop: '1.5rem',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #333',
            background: '#1e1e1e'
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
    );
}
