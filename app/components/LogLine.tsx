/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useEffect,
  useMemo,
  createRef,
  KeyboardEvent,
} from 'react';
import { get } from 'lodash';
import * as Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Home.css';
import {
  selectLogLines,
  selectSelectedLine,
  setSelectedLine,
} from '../features/logReader/logReaderSlice';

export const LogLine = (props: any) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [logProperties, setLogProperties] = useState(null);
  const logLines = useSelector(selectLogLines);
  const selectedLine = useSelector(selectSelectedLine);
  const { itemProps, search } = props;
  const rowRef = createRef<HTMLDivElement>();

  const item = logLines[itemProps.index];
  const { lineNumber, logLine } = item;

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

  useEffect(() => {
    if (lineNumber === selectedLine) rowRef?.current?.focus();
  }, [lineNumber, rowRef, selectedLine]);

  const searchWords = search && search.length > 0 ? search.split(' ') : [];

  return useMemo(() => {
    return (
      <div
        ref={rowRef}
        id={`logline${itemProps.index}`}
        className={`${styles.line} ${
          lineNumber === selectedLine && styles.selected
        }`}
        // eslint-disable-next-line react/no-array-index-key
        key={itemProps.index}
        style={itemProps.style}
        onClick={() => {
          dispatch(setSelectedLine(lineNumber));
        }}
        onKeyPress={(ev: KeyboardEvent<HTMLDivElement>) => {
          if (ev.key === 'Enter') dispatch(setSelectedLine(lineNumber));
        }}
        role="button"
        tabIndex={0}
      >
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
      </div>
    );
  }, [
    dispatch,
    itemProps.index,
    itemProps.style,
    lineNumber,
    loaded,
    logLine,
    logProperties,
    rowRef,
    searchWords,
    selectedLine,
  ]);
};

export default LogLine;
