import React, { useEffect, useState } from 'react';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import AutoSizer from 'react-virtualized-auto-sizer';
import { debounce } from 'lodash';
import { FixedSizeList } from 'react-window';
import styles from './Home.css';
import LogLine from './LogLine';

// TODO: Real line numbers, preserve search on update?, toggle sort, theme, settings,
// Refactor components, filters, highlighting, perfomance check on large file,
// test install and associate file extensions, detail panel on row click, solution
// for x overflow.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home(props: any): JSX.Element {
  // const value = useSelector(selectLog);
  const [logPath, setLogPath] = useState(``);
  const [content, setContent] = useState<string[]>([]);
  const [filteredContent, setFilteredContent] = useState<string[]>([]);
  const [liveMode, setLiveMode] = useState(false);

  const readLog = (path: string) => {
    const readable = fs.createReadStream(path);
    const chunks: string[] = [];

    readable.on('data', (chunk) => {
      chunks.push(chunk);
    });

    readable.on('end', () => {
      const fileContent = chunks.join('');
      const newContent = fileContent.split('\n'); // .reverse();
      setContent(newContent);
      setFilteredContent(newContent);
      // eslint-disable-next-line no-console
      console.log(`readLog`, path, newContent.length);
      readable.destroy();
    });
  };

  useEffect(() => {
    document
      ?.querySelector('body')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?.addEventListener('logFilePath', (e: any) => setLogPath(e.detail));
  }, []);

  useEffect(() => {
    const readDebounced = debounce(readLog, 200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let watcher: any;

    if (logPath && logPath.length > 0) {
      readLog(logPath);
      // Watch log file for changes
      watcher = chokidar.watch(logPath, {
        persistent: true,
      });
      if (liveMode) {
        watcher.on('change', (path: string) => {
          readDebounced(path);
        });
      }
    }
    if (!liveMode && watcher) watcher.close();
    return () => {
      if (watcher) watcher.close();
    };
  }, [logPath, liveMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ItemRenderer = (itemProps: any) => {
    const item = filteredContent[itemProps.index];
    const lineNumber = itemProps.index + 1; // filteredContent.length - itemProps.index;

    return (
      <div
        id={`logline${itemProps.index}`}
        className={styles.line}
        // eslint-disable-next-line react/no-array-index-key
        key={itemProps.index}
        style={itemProps.style}
      >
        <LogLine lineNumber={lineNumber} logLine={item} />
      </div>
    );
  };

  const searchLines = (search: string) => {
    if (search.length > 0) {
      const filteredLines = content.filter((value: string) =>
        value.includes(search)
      );
      setFilteredContent(filteredLines);
    } else {
      setFilteredContent(content);
    }
  };

  const debouncedSearch = debounce(searchLines, 200);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <input
          className={styles.searchInput}
          placeholder="Search"
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            debouncedSearch(ev.target.value);
          }}
        />
      </div>
      <div className={styles.container} data-tid="container">
        {content.length === 0 && (
          <span className={styles.commandLabel}>
            <span style={{ marginRight: `12px` }}>Open Log File </span>
            <code>Ctrl</code>
            {` + `}
            <code>O</code>
          </span>
        )}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              itemData={filteredContent}
              width={width}
              itemCount={filteredContent.length}
              itemSize={30}
            >
              {ItemRenderer}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerButton}>{logPath}</div>
        <div className={styles.footerSpacer} />
        <div className={styles.footerButton}>
          {content.length !== 0 && `${content.length} lines`}
        </div>
        <div
          className={styles.footerButton}
          onClick={() => {
            setLiveMode(!liveMode);
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
            {liveMode ? (
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
