'use client';

import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import styles from './login.module.css';
import { FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Vault Access</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="batchNo">Batch No.</label>
          <input
            id="batchNo"
            type="text"
            placeholder="Enter your Batch No."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="key">Key</label>
          <input
            id="key"
            type="password"
            placeholder="Enter your Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          <span>Authenticate</span>
          <FiLogIn />
        </button>
      </form>
    </div>
  );
}