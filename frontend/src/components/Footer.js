import styles from './Footer.module.css';

// Replace with your actual details
const socialLinks = {
  mail: 'mailto:your.email@example.com',
  linkedin: 'https://www.linkedin.com/in/yourprofile/',
  x: 'https://x.com/yourhandle',
  whatsapp: 'https://wa.me/yourphonenumber' // e.g., https://wa.me/15551234567
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Connect With Me</h2>
        <div className={styles.links}>
          <a href={socialLinks.mail} target="_blank" rel="noopener noreferrer">Mail</a>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">X (Twitter)</a>
          <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} abc.com. All Rights Reserved.</p>
      </div>
    </footer>
  );
}