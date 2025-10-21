import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { SiLinktree, SiGmail } from 'react-icons/si';
import styles from './Footer.module.css';

// Replace with your actual links
const socialLinks = {
  mail: 'mailto:aryan.raut718@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aryan-raut/',
  github: 'https://github.com/aryanraut-33',
  linktree: 'https://linktr.ee/aryan.raut',
  whatsapp: 'https://wa.me/+919004136721'
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Connect With Me</h2>
        <div className={styles.links}>
          <a href={socialLinks.mail} title="Email" target="_blank" rel="noopener noreferrer"><SiGmail /></a>
          <a href={socialLinks.linkedin} title="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href={socialLinks.github} title="GitHub" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href={socialLinks.linktree} title="Linktree" target="_blank" rel="noopener noreferrer"><SiLinktree /></a>
          <a href={socialLinks.whatsapp} title="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} ML with Aryan. All Rights Reserved.</p>
      </div>
    </footer>
  );
}