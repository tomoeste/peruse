import React from 'react';
import styles from './Home.css';

export const NoOpenLog = (props: any) => {
  return (
    <span className={styles.commandLabel}>
      <span style={{ marginRight: `12px` }}>Open Log File </span>
      <code>Ctrl</code>
      {` + `}
      <code>O</code>
    </span>
  );
};

export default NoOpenLog;
