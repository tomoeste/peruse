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
              title="Select to activate tab"
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
              <div className={styles.listLineText}>{`📘 ${value.logPath}`}</div>
              {value?.liveMode && (
                <span
                  className={`${styles.listLineIcon}`}
                  title="Live mode is enabled"
                >
                  <svg
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fillRule="evenodd">
                      <circle
                        cx="10.5"
                        cy="10.5"
                        r="5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="10.5" cy="10.5" fill="white" r="3" />
                    </g>
                  </svg>
                </span>
              )}
              {value?.followMode && (
                <span
                  className={`${styles.listLineIcon}`}
                  title="Follow file is enabled"
                >
                  <svg
                    fill="white"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(4 4)"
                    >
                      <path d="m5.5 7.5c.96940983 1.36718798 3.01111566 1.12727011 4.01111565 0l1.98888435-2c1.1243486-1.22807966 1.1641276-2.81388365 0-4-1.135619-1.15706921-2.86438099-1.15706947-4 0l-2 2" />
                      <path
                        d="m.64175661 12.3971156c.96940983 1.367188 3 1.1970433 4 .0697732l2-1.9748738c1.12434863-1.22807961 1.16412758-2.83900987 0-4.02512622-1.13561902-1.15706922-2.86438099-1.15706948-4 0l-2 2"
                        transform="matrix(-1 0 0 -1 8.14 18.966)"
                      />
                    </g>
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Windows;
