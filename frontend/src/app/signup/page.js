'use client';

import { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import styles from 'app/login/login.module.css'; // Reusing the enhanced login styles
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import PasswordStrength from 'components/PasswordStrength'; // Import the new component

export default function SignupPage() {
  const [formData, setFormData] = useState({ 
    name: '', 
    username: '', 
    email: '', 
    phoneNumber: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      // The backend now handles all validation. Its specific error message
      // (e.g., "Password must contain a number") will be caught and displayed.
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Create Account</h1>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.inputGroup}>
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input id="phoneNumber" name="phoneNumber" type="tel" onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={handleChange} required className={styles.input} />
        </div>

        {/* The password strength meter appears as the user types into the password field */}
        <PasswordStrength password={formData.password} />
        
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          <span>{isSubmitting ? 'Creating...' : 'Sign Up'}</span>
          <FiArrowRight />
        </button>
        <p className={styles.footerText}>
          Already have an account? <Link href="/login" className={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
}