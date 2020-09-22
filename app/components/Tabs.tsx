import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Home.css';
import {
  removeTab,
  selectActiveTab,
  selectTabs,
  setActiveTab,
  Tab as TabType,
} from '../features/logReader/logReaderSlice';
import { TabComponent } from './Tab';

export const Tabs = () => {
  const activeTab = useSelector(selectActiveTab);
  const tabs = useSelector(selectTabs);
  const dispatch = useDispatch();

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabStrip}>
        {tabs.map((value: TabType, index: number) => {
          // eslint-disable-next-line react/no-array-index-key
          return (
            <div
              className={`${styles.tabButton} ${
                activeTab.logPath === value?.logPath ? styles.active : ``
              }`}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              onClick={() => {
                dispatch(setActiveTab(index));
              }}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
              title={value.logPath}
            >
              {value?.title}
              <span style={{ display: `flex`, flexGrow: 1 }} />
              <span
                className={styles.tabCloseButton}
                title="Close"
                onClick={(event) => {
                  dispatch(removeTab(index));
                  event.stopPropagation();
                }}
                onKeyPress={() => {}}
                role="button"
                tabIndex={0}
              >
                X
              </span>
            </div>
          );
        })}
      </div>
      <TabComponent />
    </div>
  );
};

export default Tabs;
