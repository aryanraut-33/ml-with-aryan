import Link from 'next/link';
import Image from 'next/image';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
    return (
        <Link href={`/projects/${project._id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {project.thumbnailUrl ? (
                    <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <span>{project.type === 'Fundamental' ? 'F' : 'P'}</span>
                    </div>
                )}
                <div className={styles.typeBadge} data-type={project.type}>
                    {project.type}
                </div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description.substring(0, 100)}...</p>
                <div className={styles.techStack}>
                    {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className={styles.tech}>{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className={styles.tech}>+{project.technologies.length - 3}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
