import React from 'react';
import styles from './preloader.module.css'; 

function PreLoader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-app-gradient">
      <div className="flex flex-col items-center z-5">
        <h3 className="text-4xl text-white">
          Good things take time, just a few more seconds...
        </h3>
        <div className="flex">
          <h3 className={`text-[200px] text-[#333333] mx-1 relative -top-4 leading-3 ${styles.dot} ${styles.one}`}>
            .
          </h3>
          <h3 className={`text-[200px] text-[#333333] mx-1 relative -top-4 leading-3 ${styles.dot} ${styles.two}`}>
            .
          </h3>
          <h3 className={`text-[200px] text-[#333333] mx-1 relative -top-4 leading-3 ${styles.dot} ${styles.three}`}>
            .
          </h3>
        </div>
      </div>
    </div>
  );
}

export default PreLoader;
