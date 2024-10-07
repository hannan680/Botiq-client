import React, { useState, useEffect } from 'react';
import { useUserContext } from '../providers/userContext'; // Adjust the import path as needed
import { Russo_One } from 'next/font/google';
import styles from './greetings.module.css'; // Import the CSS module

const russoOne = Russo_One({
  subsets: ['latin'], 
  weight: '400', 
});

const Greetings = () => {
  const { userData, isLoading, error } = useUserContext();
  const [displayedUsername, setDisplayedUsername] = useState('');
  const username = userData?.userName?.split(' ')[0] || 'Guest';

  useEffect(() => {
    if (!isLoading && !error && username) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < username.length) {
          setDisplayedUsername(username.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100); // Adjust typing speed here

      return () => clearInterval(typingInterval);
    }
  }, [isLoading, error, username]);

  if (error) {
    return (
      <h1 className={`hero-greetings text-white text-5xl ${russoOne.className}`}>
        Oops! <span className={`${styles.heroUsername} text-[#ff6b6b]`}>Something went wrong</span>
      </h1>
    );
  }

  return (
    <h1 className={`hero-greetings text-white text-5xl ${russoOne.className}`}>
      Welcome {' '}
      <span className={`${styles.heroUsername} text-[#333333]`}>
        {isLoading ? <span className={styles.loadingIndicator}>|</span> : displayedUsername}
      </span>
    </h1>
  );
};

export default Greetings;