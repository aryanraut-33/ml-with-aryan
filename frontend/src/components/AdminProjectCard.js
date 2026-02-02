
import Link from 'next/link';
import styles from './AdminProjectCard.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminProjectCard({ project, onDelete }) {
    const isProduction = project.type === 'Production';

    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h3 className={styles.title}>{project.title}</h3>
                <div className={styles.meta}>
                    <span className={`${styles.badge} ${isProduction ? styles.production : styles.fundamental}`}>
                        {project.type}
                    </span>
                    <span className={styles.date}>
                        {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href={`/admin/projects/edit/${project._id}`} className={styles.actionBtn}>
                    <FiEdit2 /> Edit
                </Link>
                <button onClick={() => onDelete(project._id)} className={`${styles.actionBtn} ${styles.delete}`}>
                    <FiTrash2 /> Delete
                </button>
            </div>
        </div>
    );
}
