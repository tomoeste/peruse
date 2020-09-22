import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveTab,
  selectTabs,
  setActiveTab,
  Tab as TabType,
} from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Windows = () => {
  const dispatch = useDispatch();
  const tabs = useSelector(selectTabs);
  const activeTab = useSelector(selectActiveTab);
  useEffect(() => {}, []);

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>WINDOWS</div>
      <div className={styles.list}>
        {tabs.map((value: TabType, index: number) => {
          return (
            <div
              key={value.logPath}
              className={`${styles.listLine} ${
                activeTab.logPath === value.logPath ? styles.selected : ``
              }`}
              onClick={() => {
                dispatch(setActiveTab(index));
              }}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
            >
              {`📘 ${value.logPath}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Windows;
