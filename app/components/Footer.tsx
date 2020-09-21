import React from 'react';
import { useSelector } from 'react-redux';
import { selectLogPath } from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Footer = (props: any) => {
  const logPath = useSelector(selectLogPath);
  const { content, liveMode, setLiveMode } = props;

  return (
    <div className={styles.footer}>
      <div className={styles.footerButton}>{logPath}</div>
      <div className={styles.footerSpacer} />
      <div className={styles.footerButton}>
        {content.length !== 0 && `${content.length} lines`}
      </div>
      <div
        className={styles.footerButton}
        onClick={() => {
          setLiveMode(!liveMode);
        }}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <svg
          fill="white"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {liveMode ? (
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default Footer;
