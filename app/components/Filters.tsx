/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import {
  Filter,
  selectFilters,
  setFilters,
} from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Filters = () => {
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
  useEffect(() => {}, []);

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>
        FILTER
        <div className={styles.buttonTray}>
          <div className={`${styles.button} tooltip-left`} title="New">
            <svg
              height="26"
              viewBox="0 0 20 20"
              width="26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="lightgrey"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5.029 10.429h10" />
                <path d="m10.029 15.429v-10.001" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <SplitPane split="horizontal" minSize={220} style={{ marginTop: `30px` }}>
        <div className={styles.form}>
          <label>Search*</label>
          <input
            onKeyDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
          />
          <label>Description</label>
          <input />
          <div className={styles.inlineFieldGroup}>
            <button
              className={`${styles.buttonSmall} ${styles.buttonGrey}`}
              type="button"
              title="Reset fields"
            >
              Reset
            </button>
            <button
              className={styles.buttonSmall}
              type="button"
              title="Apply filter"
            >
              Apply
            </button>
          </div>
        </div>
        <div className={styles.list}>
          {filters.length === 0 && (
            <span className={styles.message}>No filters defined</span>
          )}
          {filters.map((filter: Filter, index: number) => {
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={styles.listLine}
                title="Select to edit filter"
              >
                <div className={styles.listLineText}>
                  {`🔎 ${filter.search}`}
                </div>
                <span
                  className={`${styles.listLineButton} tooltip-left`}
                  title="Remove"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    dispatch(
                      setFilters(
                        filters.filter((value: Filter) => {
                          return value.id !== filter.id;
                        })
                      )
                    );
                  }}
                  onKeyPress={() => {}}
                >
                  <svg
                    height="21"
                    viewBox="0 0 21 21"
                    width="21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="lightgrey"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(5 5)"
                    >
                      <path d="m.5 10.5 10-10" />
                      <path d="m10.5 10.5-10-10z" />
                    </g>
                  </svg>
                </span>
              </div>
            );
          })}
        </div>
      </SplitPane>
    </div>
  );
};

export default Filters;
