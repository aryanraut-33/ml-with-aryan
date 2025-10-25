'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getYoutubeThumbnail } from 'lib/utils';
import LogoCarousel from './LogoCarousel';
import ContentToggle from './ContentToggle';
import styles from 'app/page.module.css';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { FiHelpCircle, FiX } from 'react-icons/fi'; 

export default function HomePageClient({ blogs, videos }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const togglePopup = () => {
    setIsPopupVisible(prev => !prev);
  };

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Exploring the Frontiers of{' '}
          <div 
            className={styles.popupAnchor}
            onMouseEnter={!isMobile ? () => setIsPopupVisible(true) : undefined}
            onMouseLeave={!isMobile ? () => setIsPopupVisible(false) : undefined}
          >
            {/* --- THIS IS THE FIX --- */}
            {/* The onClick handler is now on the span itself, but only active on mobile */}
            <span 
              className={styles.heroAccent}
              onClick={isMobile ? togglePopup : undefined}
            >
              Machine Learning
            </span>
            {/* The "?" button has been removed. */}
            {/* ----------------------- */}
            
            {isPopupVisible && (
              <div className={styles.mlPopup}>
                <h5>what exactly is ML?</h5>
                <p>
                  Machine learning is the field of study that gives computers the ability to learn without being explicitly programmed.
                </p>
                <p className={styles.popupJoke}>
                  in short: Teaching machines to recognize cats so humans can focus on more important things...
                </p>
                <button className={styles.popupCloseButton} onClick={togglePopup}>
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </h1>
        <p className={styles.heroSubtitle}>
          Sharing my learnings and musings in this ever-expanding world of AI, ML, DL, MLOPS and everything in between.
        </p>
      </section>

      <div className={styles.fullWidthContainer}>
        <LogoCarousel />
      </div>
      <ContentToggle blogs={blogs} videos={videos} />
    </div>
  );
}