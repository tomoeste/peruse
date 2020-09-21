import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLogPath } from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Windows = (props: any) => {
  const logPath = useSelector(selectLogPath);
  useEffect(() => {}, []);

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>WINDOWS</div>
      <div className={styles.list}>
        <div className={styles.listLine}>{`📘 ${logPath}`}</div>
      </div>
    </div>
  );
};

export default Windows;
