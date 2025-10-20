'use client';

import React from 'react';
import Marquee from "react-fast-marquee"; // Import the new marquee component
import styles from './LogoCarousel.module.css';

// Import all the necessary icons
import { 
  FaPython, 
  FaDocker, 
  FaAws 
} from 'react-icons/fa';
import { 
  SiTensorflow, 
  SiPytorch, 
  SiScikitlearn, 
  SiNumpy, 
  SiPandas, 
  SiHuggingface, 
  SiOpencv, 
  SiGooglecloud, 
  SiJupyter,
  SiKeras
} from 'react-icons/si';

// Note: Matplotlib icon does not exist, so it is excluded.
const logos = [
  { Icon: FaPython, name: 'Python' },
  { Icon: SiTensorflow, name: 'TensorFlow' },
  { Icon: SiPytorch, name: 'PyTorch' },
  { Icon: SiKeras, name: 'Keras' },
  { Icon: SiScikitlearn, name: 'Scikit-learn' },
  { Icon: SiHuggingface, name: 'Hugging Face' },
  { Icon: SiNumpy, name: 'NumPy' },
  { Icon: SiPandas, name: 'Pandas' },
  { Icon: SiOpencv, name: 'OpenCV' },
  { Icon: SiJupyter, name: 'Jupyter' },
  { Icon: FaDocker, name: 'Docker' },
  { Icon: FaAws, name: 'AWS' },
  { Icon: SiGooglecloud, name: 'Google Cloud' },
];

const LogoCarousel = () => {
  return (
    // The Marquee component handles the infinite scroll
    <Marquee
      pauseOnHover={true} // This is the feature you requested
      speed={50}          // Adjust speed here (higher is faster)
      gradient={false}      // We will use our own CSS mask for a better effect
      className={styles.marquee_container}
    >
      {logos.map(({ Icon, name }, index) => (
        <div className={styles.logo_slide} key={index}>
          <div className={styles.logo_wrapper}>
            <Icon size={36} className={styles.logo_icon} />
            <span className={styles.logo_name}>{name}</span>
          </div>
        </div>
      ))}
    </Marquee>
  );
};

export default LogoCarousel;