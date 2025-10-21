'use client';

import LogoCarousel from './LogoCarousel'; // <-- IMPORT HERE
import ContentToggle from './ContentToggle';
import styles from '../app/page.module.css';

export default function HomePageClient({ blogs, videos }) {
  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Exploring the Frontiers of <span className={styles.heroAccent}>Machine Learning</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Sharing my learnings and ideas in domain of AI, ML, DL, MLOPS and everything in between.
        </p>
      </section>

      {/* This new container allows the carousel to span the full width */}
      <div className={styles.fullWidthContainer}>
        <LogoCarousel />
      </div>

      {/* The ContentToggle component now handles the blogs and videos sections */}
      <ContentToggle blogs={blogs} videos={videos} />
    </div>
  );
}