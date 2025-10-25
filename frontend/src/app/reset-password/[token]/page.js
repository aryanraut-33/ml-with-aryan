'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from 'lib/api';
import styles from 'app/login/login.module.css'; // Reuse login styles
import { FiKey } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Keys do not match.');
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post(`/api/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      // Optional: automatically log the user in here if the backend sends a token
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Create a New Password</h1>
      
      {message && <p style={{ color: '#2ed573', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.inputGroup}>
        <label htmlFor="password">New Key</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirm New Key</label>
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={styles.input} />
      </div>
      
      <button type="submit" disabled={loading} className={styles.button}>
        <span>{loading ? 'Saving...' : 'Reset Key'}</span>
        <FiKey />
      </button>
    </form>
  );
}