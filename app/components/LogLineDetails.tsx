/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as settings from 'electron-settings';
import { Line } from '../features/logReader/logReader';
import styles from './Home.css';
import { JsonRenderer } from './JsonRenderer';
import { selectActiveTab } from '../features/logReader/logReaderSlice';

export const LogLineDetails = () => {
  const activeTab = useSelector(selectActiveTab);
  const [promptToLoad, setPromptToLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [detailLine, setDetailLine] = useState<Line | null>(null);

  // Fix issue where prompt is shown when no line is selected
  useEffect(() => {
    console.log(`selectedLine Effect`, activeTab?.selectedLine);
    if (
      activeTab?.content &&
      activeTab?.content.length > 0 &&
      activeTab?.selectedLine
    ) {
      if (activeTab?.selectedLine <= activeTab?.content.length) {
        setDetailLine(activeTab?.content[activeTab?.selectedLine - 1]);
      } else {
        console.log(`Selected line not found in log`);
      }
    }
    return () => {
      console.log(`selectedLine Effect exit`);
      setLoaded(false);
    };
  }, [activeTab?.content, activeTab?.selectedLine]);

  useEffect(() => {
    const lineLength = detailLine?.logLine?.length
      ? detailLine.logLine.length
      : 0;
    const maxLineLength = settings.getSync('maxLineLength') || 2000;
    setPromptToLoad(lineLength > maxLineLength);
    setLoaded(true);
  }, [detailLine]);

  const isJson = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const lineIsObject = (line: Line | null): boolean => {
    if (line && isJson(line.logLine)) {
      return true;
    }
    return false;
  };

  const formatPlainTextLogLine = (line: string | undefined) => {
    return line && line.length > 0 ? line.replaceAll(/\t+/g, `\n`) : line;
  };

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailHeader}>
        DETAIL
        {detailLine &&
          detailLine.lineNumber &&
          ` - LINE ${detailLine.lineNumber}`}
      </div>
      {promptToLoad && (
        <div className={styles.messageContainer}>
          <span className={styles.message}>
            This line may take more time to load.
          </span>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setPromptToLoad(false);
            }}
          >
            Load...
          </button>
        </div>
      )}
      {!promptToLoad && loaded && detailLine && lineIsObject(detailLine) && (
        <JsonRenderer json={detailLine.logLine} />
      )}
      {!promptToLoad && loaded && detailLine && !lineIsObject(detailLine) && (
        <pre className={styles.detailContent}>
          {formatPlainTextLogLine(detailLine?.logLine)}
        </pre>
      )}
      {!promptToLoad &&
        (!detailLine?.logLine || detailLine?.logLine?.length === 0) && (
          <div className={styles.detailContent} style={{ textAlign: `center` }}>
            No detail to show.
          </div>
        )}
    </div>
  );
};

export default LogLineDetails;
