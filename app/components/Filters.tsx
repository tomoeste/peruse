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

export const Filters = (props: any) => {
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
  useEffect(() => {}, []);

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>FILTER</div>
      <SplitPane split="horizontal" minSize={220} style={{ marginTop: `30px` }}>
        <div className={styles.form}>
          <label>Search</label>
          <input />
          <label>Background</label>
          <input />
          <label>Color</label>
          <input />
        </div>
        <div className={styles.list}>
          {filters.length === 0 && (
            <span className={styles.message}>No filters defined</span>
          )}
          {filters.map((filter: Filter, index: number) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className={styles.listLine}>
                <div className={styles.listLineText}>
                  {`🔎 ${filter.search}`}
                </div>
                <span
                  className={`${styles.listLineButton} tooltip-left`}
                  data-tooltip="Remove"
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
