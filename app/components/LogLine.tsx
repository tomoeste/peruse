/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import * as Highlighter from 'react-highlight-words';
import styles from './Home.css';

export default function LogLine(props: any) {
  const [loaded, setLoaded] = useState(false);
  const [logProperties, setLogProperties] = useState(null);
  const { logLine, lineNumber, search } = props;

  useEffect(() => {
    try {
      const obj = JSON.parse(logLine);
      if (obj && typeof obj === 'object') {
        setLogProperties(obj);
      }
    } catch (ex) {
      setLogProperties(null);
    } finally {
      setLoaded(true);
    }
  }, [logLine]);

  const searchWords = search && search.length > 0 ? search.split(' ') : [];

  return (
    <>
      <div
        className={`${styles.gutter} ${get(
          styles,
          get(logProperties, `level`, ``),
          ``
        )}`}
      >
        {lineNumber}
      </div>
      <div className={styles.logEntry}>
        {logProperties && (
          <div className={styles.logTag}>
            <div className={styles.logTagTime}>
              <Highlighter
                highlightClassName={styles.highlight}
                searchWords={searchWords}
                textToHighlight={get(logProperties, `time`)}
              />
            </div>
            <div className={styles.logTagLevel}>
              <Highlighter
                highlightClassName={styles.highlight}
                searchWords={searchWords}
                textToHighlight={get(logProperties, `level`)}
              />
            </div>
            <div className={styles.logTagMessage}>
              <Highlighter
                highlightClassName={styles.highlight}
                searchWords={searchWords}
                textToHighlight={get(logProperties, `message`)}
              />
            </div>
          </div>
        )}
        {!logProperties && loaded && (
          <span>
            <Highlighter
              highlightClassName={styles.highlight}
              searchWords={searchWords}
              textToHighlight={logLine}
            />
          </span>
        )}
      </div>
    </>
  );
}
