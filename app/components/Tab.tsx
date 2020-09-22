import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Home.css';
import { LogList } from './LogList';
import { selectActiveTab } from '../features/logReader/logReaderSlice';

// Continue to refactor moving file read logic to Tab level
// Move event handler for open file to Home component
// Read current Tab live/follow modes for footer(?)
// Decide when to unmount handlers/watchers on tab change
export const TabComponent = () => {
  const activeTab = useSelector(selectActiveTab);

  return (
    <div className={styles.tab} id={activeTab?.title}>
      <LogList />
    </div>
  );
};

export default TabComponent;
