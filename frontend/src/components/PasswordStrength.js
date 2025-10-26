'use client';

import { FiCheck, FiX } from 'react-icons/fi';
import styles from './PasswordStrength.module.css';

// This component receives the password as a prop and validates it
export default function PasswordStrength({ password }) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const Rule = ({ text, isMet }) => (
    <div className={`${styles.rule} ${isMet ? styles.met : ''}`}>
      {isMet ? <FiCheck /> : <FiX />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <Rule text="At least 8 characters" isMet={checks.length} />
      <Rule text="One uppercase letter" isMet={checks.uppercase} />
      <Rule text="One lowercase letter" isMet={checks.lowercase} />
      <Rule text="One number" isMet={checks.number} />
      <Rule text="One special character (!@#$%^&*)" isMet={checks.special} />
    </div>
  );
}