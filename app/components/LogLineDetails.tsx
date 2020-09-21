import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as settings from 'electron-settings';
import { Line } from '../features/logReader/logReader';
import {
  selectLogLines,
  selectSelectedLine,
} from '../features/logReader/logReaderSlice';
import styles from './Home.css';
import { JsonRenderer } from './JsonRenderer';

export const LogLineDetails = (props: any) => {
  const logLines = useSelector(selectLogLines);
  const selectedLine = useSelector(selectSelectedLine);
  const [promptToLoad, setPromptToLoad] = useState(false);
  const [detailLine, setDetailLine] = useState<Line | null>(null);

  // Fix issue where prompt is shown when no line is selected
  useEffect(() => {
    console.log(`selectedLine Effect`, selectedLine);
    if (logLines && logLines.length > 0 && selectedLine) {
      if (selectedLine <= logLines.length) {
        setDetailLine(logLines[selectedLine - 1]);
      } else {
        console.log(`Selected line not found in log`);
      }
    }
    return () => {
      setPromptToLoad(true);
    };
  }, [logLines, selectedLine]);

  useEffect(() => {
    const lineLength = detailLine?.logLine?.length
      ? detailLine.logLine.length
      : 0;
    const maxLineLength = settings.getSync('maxLineLength') || 2000;
    setPromptToLoad(lineLength > maxLineLength);
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
      {!promptToLoad && detailLine && lineIsObject(detailLine) && (
        <JsonRenderer json={detailLine.logLine} />
      )}
      {!promptToLoad && detailLine && !lineIsObject(detailLine) && (
        <pre className={styles.detailContent}>
          {formatPlainTextLogLine(detailLine?.logLine)}
        </pre>
      )}
      {!promptToLoad && detailLine?.logLine?.length === 0 && (
        <div className={styles.detailContent} style={{ textAlign: `center` }}>
          No detail to show.
        </div>
      )}
    </div>
  );
};

export default LogLineDetails;
