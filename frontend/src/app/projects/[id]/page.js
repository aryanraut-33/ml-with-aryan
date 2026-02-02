import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiGithub, FiExternalLink, FiArrowLeft, FiCode } from 'react-icons/fi';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import styles from './page.module.css';
import CodeBlock from '@/components/CodeBlock';

// We need a CodeBlock component or just render it nicely.
// For syntax highlighting, we can use a library like 'react-syntax-highlighter' if available, 
// or just simple pre/code tags for now. The user asked for "optional code block".
// I'll check package.json for syntax highlighter later, for now simple styled pre.

async function getProject(id) {
    try {
        await dbConnect();
        const project = await Project.findById(id).lean();
        if (!project) return null;

        return {
            ...project,
            _id: project._id.toString(),
            author: project.author ? project.author.toString() : null,
            createdAt: project.createdAt.toISOString(),
            updatedAt: project.updatedAt.toISOString(),
        };
    } catch (error) {
        return null;
    }
}

// Function to extract YouTube ID
function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default async function ProjectDetailPage({ params }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    const videoId = getYouTubeId(project.videoUrl);
    const hasDynamicBlocks = project.blocks && project.blocks.length > 0;

    return (
        <div className={styles.container}>
            <Link href="/projects" className={styles.backLink}>
                <FiArrowLeft /> Back to Projects
            </Link>

            <header className={styles.header}>
                <div className={styles.badge} data-type={project.type}>{project.type}</div>
                <h1 className={styles.title}>{project.title}</h1>
                <div className={styles.links}>
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                            <FiGithub /> Repository
                        </a>
                    )}
                    {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                            <FiExternalLink /> Live Demo
                        </a>
                    )}
                </div>
            </header>

            <div className={styles.content}>

                {/* Always show description as intro */}
                <div className={styles.description}>
                    <p>{project.description}</p>
                </div>

                <div className={styles.techStack}>
                    <h3>Technologies Used</h3>
                    <div className={styles.tags}>
                        {project.technologies.map((tech, i) => (
                            <span key={i} className={styles.tag}>{tech}</span>
                        ))}
                    </div>
                </div>

                {/* Dynamic Blocks Rendering */}
                {hasDynamicBlocks ? (
                    <div className={styles.blocksContainer}>
                        {project.blocks.map((block) => {
                            switch (block.type) {
                                case 'heading':
                                    return <h2 key={block.id || Math.random()} className={styles.blockHeading}>{block.content}</h2>;
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
                                                alt={block.content.caption || 'Project Image'}
                                                className={styles.blockImage}
                                            />
                                            {block.content.caption && <p className={styles.caption}>{block.content.caption}</p>}
                                        </div>
                                    );
                                case 'video':
                                    const vId = getYouTubeId(block.content.url);
                                    if (!vId) return null;
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
                ) : (
                    // Legacy Fallback
                    <>
                        {videoId && (
                            <div className={styles.videoWrapper}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    className={styles.iframe}
                                    title={project.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {project.codeBlocks && project.codeBlocks.length > 0 && (
                            <div className={styles.codeSection}>
                                <h2><FiCode style={{ marginRight: '10px' }} /> Code Implementation</h2>
                                {project.codeBlocks.map((block, index) => (
                                    <CodeBlock
                                        key={index}
                                        language={block.language}
                                        code={block.code}
                                        filename={block.filename}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
