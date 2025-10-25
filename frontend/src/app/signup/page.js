'use client';

import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import styles from '../login/login.module.css'; // Reusing login styles
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Create Account</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.button}>
        <span>Sign Up</span>
        <FiArrowRight />
      </button>

      <p className={styles.footerText}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </form>
  );
}
