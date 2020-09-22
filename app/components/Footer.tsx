import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveTab,
  updateTab,
} from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Footer = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);

  return (
    <div className={styles.footer}>
      <div className={styles.footerButton} title="Log file path">
        {activeTab?.logPath || ''}
      </div>
      <div className={styles.footerSpacer} />
      {activeTab?.content?.length && activeTab.content.length > 0 && (
        <div style={{ display: `flex` }}>
          <div className={styles.footerButton} title="Total log lines">
            {`${activeTab.content.length} lines`}
          </div>
          <div
            className={styles.footerButton}
            title="Toggle live mode"
            onClick={() => {
              if (activeTab)
                dispatch(
                  updateTab({
                    ...activeTab,
                    liveMode: !activeTab?.liveMode,
                  })
                );
            }}
            onKeyPress={() => {}}
            role="button"
            tabIndex={0}
          >
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              {activeTab?.liveMode ? (
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
              ) : (
                <circle
                  cx="10.5"
                  cy="10.5"
                  fill="none"
                  r="5"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
          <div
            className={styles.footerButton}
            title="Toggle follow file"
            onClick={() => {
              if (activeTab)
                dispatch(
                  updateTab({
                    ...activeTab,
                    followMode: !activeTab?.followMode,
                  })
                );
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
              {activeTab?.followMode ? (
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
              ) : (
                <g
                  fill="none"
                  fillRule="evenodd"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(2 2)"
                >
                  <path
                    d="m5.17157288 6.87867966v-1.41421357c0-1.56209716 1.26632995-2.82842712 2.82842712-2.82842712s2.8284271 1.26632996 2.8284271 2.82842712v1.41421357m0 2.82842712v2.82842712c0 1.5620972-1.26632993 2.8284271-2.8284271 2.8284271s-2.82842712-1.2663299-2.82842712-2.8284271v-2.82842712"
                    transform="matrix(.70710678 .70710678 -.70710678 .70710678 8.707107 -3.020815)"
                  />
                  <path d="m5.5 3.5v-3" />
                  <path d="m.5 5.5h3" />
                  <path d="m11.5 16.5v-3" />
                  <path d="m13.5 11.5h3" />
                </g>
              )}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
