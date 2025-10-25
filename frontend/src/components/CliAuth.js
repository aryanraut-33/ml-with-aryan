'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from 'context/AuthContext';
import styles from './CliAuth.module.css';
import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

const CliAuth = () => {
  const { login, register } = useAuth();
  const [lines, setLines] = useState([{ text: '[ML with Aryan Vault] > Type "login" or "signup" to begin.\nHit esc (or reload page)to restart.', type: 'system' }]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('initial');
  const [step, setStep] = useState(0);
  const [isPassword, setIsPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const endOfLinesRef = useRef(null);
  const inputRef = useRef(null);

  const loginSteps = ['loginIdentifier', 'password'];
  const signupSteps = ['name', 'username', 'email', 'phoneNumber', 'password'];
  const currentSteps = mode === 'login' ? loginSteps : signupSteps;
  const progress = mode === 'signup' ? Math.round((step / signupSteps.length) * 100) : null;

  useEffect(() => {
    endOfLinesRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [lines]);

  // --- FIX B: Escape Key Handler ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetToInitial();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetToInitial = () => {
    addLine('---------------------------------');
    addLine('Sequence aborted. Returning to initial state.');
    addLine('[ML with Aryan Vault] > Type "login" or "signup" to begin.');
    setMode('initial');
    setStep(0);
    setFormData({});
    setIsPassword(false);
    setIsProcessing(false);
  };

  const addLine = (text, type = 'system') => {
    setLines(prev => [...prev, { text, type }]);
  };

  const handleCommand = async () => {
    if (isProcessing) return;
    
    const command = input.trim();
    addLine(`> ${input}`, 'user');
    setInput('');

    if (mode === 'initial') {
      if (command.toLowerCase() === 'login') {
        setMode('login'); setStep(0); setFormData({});
        addLine('Initiating login sequence...');
        addLine(`Enter Userame or Phone:`);
      } else if (command.toLowerCase() === 'signup') {
        setMode('signup'); setStep(0); setFormData({});
        addLine('Initiating account creation...');
        addLine(`Enter Full Name:`);
      } else {
        addLine(`Error: Command not found "${command}". Available commands: login, signup.`);
      }
      return;
    }

    let field = currentSteps[step];
    const newFormData = { ...formData, [field]: command };
    setFormData(newFormData);
    
    if (step < currentSteps.length - 1) {
      const nextField = currentSteps[step + 1];
      const prompt = nextField.replace(/([A-Z])/g, ' $1');
      addLine(`Enter ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}:`);
      setIsPassword(nextField === 'password');
      setStep(prev => prev + 1);
    } else {
      setIsProcessing(true);
      try {
        if (mode === 'login') {
          addLine('Authenticating...', 'success');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Dramatic pause
          await login(newFormData.loginIdentifier, newFormData.password);
        } else {
          addLine('Creating account...', 'success');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Dramatic pause
          await register(newFormData);
        }
        // --- FIX E: Success Animation ---
        setLines(prev => [...prev, { text: `\n█║▌║ █║▌ ║║▌║ █║▌║ █║▌ ║║▌║\nAccess Granted. Welcome, ${newFormData.username || newFormData.loginIdentifier}.\nRedirecting...`, type: 'success-final' }]);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
        addLine(`Authentication Failed: ${errorMessage}`, 'error');
        resetToInitial();
      }
      // No need to set isProcessing to false on success, as the page will redirect.
    }
  };

  const getPrompt = () => {
    if (mode === 'initial') return 'Type "login" or "signup"';
    if (mode === 'login') return `[Login] ${loginSteps[step].replace(/([A-Z])/g, ' $1')}`;
    if (mode === 'signup') return `[Sign Up - ${progress}%] ${signupSteps[step].replace(/([A-Z])/g, ' $1')}`;
    return '';
  };

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      {/* --- FIX C: Back to Site Button --- */}
      <Link href="/" className={styles.homeLink}>
        <span className={styles.homeLinkText}>Back to Site</span>
        <FiHome />
      </Link>
      
      {lines.map((line, index) => (
        <p key={index} className={styles[line.type]}>
          {line.text}
        </p>
      ))}
      {!isProcessing && (
        <div className={styles.inputLine}>
          <span className={styles.prompt}>{getPrompt()}</span>
          <input
            ref={inputRef}
            type={isPassword ? 'password' : 'text'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            className={styles.input}
            autoFocus
            disabled={isProcessing}
          />
        </div>
      )}
      <div ref={endOfLinesRef} />
    </div>
  );
};

export default CliAuth;