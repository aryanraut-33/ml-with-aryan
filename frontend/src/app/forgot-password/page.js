'use client';

import { useState } from 'react';
import api from 'lib/api';
import styles from 'app/login/login.module.css'; // Reuse login styles
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('/api/users/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Reset Key</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
      Reset your password via email. Missing it? Check spam.
      </p>
      
      {message && <p style={{ color: '#2ed573', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
      </div>
      
      <button type="submit" disabled={loading} className={styles.button}>
        <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
        <FiMail />
      </button>
      
      <p className={styles.footerText}>
        Remembered your key? <Link href="/login" className={styles.link}>Login</Link>
      </p>
    </form>
  );
}