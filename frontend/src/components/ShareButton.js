'use client';

import { useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';
import styles from './ShareButton.module.css';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleCopy} className={styles.button}>
        {copied ? <FiCheck size={20} /> : <FiShare2 size={20} />}
      </button>
      {copied && <span className={styles.tooltip}>Link Copied!</span>}
    </div>
  );
}