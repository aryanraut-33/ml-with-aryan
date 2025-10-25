'use client';

import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import styles from './login.module.css';
import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginIdentifier, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Vault Access</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <label htmlFor="loginIdentifier">Username / Phone</label>
        <input id="loginIdentifier" type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="key">Password</label>
        <input id="key" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
      </div>
      <button type="submit" className={styles.button}>
        <span>Authenticate</span>
        <FiLogIn />
      </button>
      <p className={styles.footerText}>
        No account? <Link href="/signup" className={styles.link}>Create One</Link>
      </p>
    </form>
  );
}