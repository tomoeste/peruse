import React, { useEffect, useState } from 'react';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import AutoSizer from 'react-virtualized-auto-sizer';
import { debounce } from 'lodash';
import { FixedSizeList } from 'react-window';
import styles from './Home.css';
import LogLine from './LogLine';

// TODO: Fix issue with search rerenders, theme, settings,
// Refactor components, filters, perfomance check on large file,
// test install and associate file extensions, detail panel on row click, solution
// for x overflow.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home(props: any): JSX.Element {
  // const value = useSelector(selectLog);
  const [logPath, setLogPath] = useState(``);
  const [liveMode, setLiveMode] = useState(false);
  const [content, setContent] = useState<Line[]>([]);
  const [search, setSearch] = useState('');
  const [filteredContent, setFilteredContent] = useState<Line[]>([]);
  const listRef = React.createRef<FixedSizeList>();

  interface Line {
    lineNumber: number;
    logLine: string;
  }

  useEffect(() => {
    if (liveMode && filteredContent && filteredContent.length > 0) {
      listRef.current?.scrollToItem(filteredContent.length, 'end');
    }
  }, [listRef, filteredContent, liveMode]);

  useEffect(() => {
    const readLog = (path: string) => {
      const readable = fs.createReadStream(path);
      const chunks: string[] = [];

      readable.on('data', (chunk) => {
        chunks.push(chunk);
      });

      readable.on('end', () => {
        const fileContent = chunks.join('');
        const newContent = fileContent
          .split('\n')
          .map((value: string, index: number) => {
            return { lineNumber: index + 1, logLine: value };
          }); // .reverse();
        setContent(newContent);
        // eslint-disable-next-line no-console
        console.log(`readLog`, path, newContent.length);
        readable.destroy();
      });
    };

    const handleLogFilePath = ((event: CustomEvent) => {
      // eslint-disable-next-line no-console
      console.log(`handleLogFile`, event.detail);
      setLogPath(event.detail);
    }) as EventListener;

    const handleReloadLogFile = (() => {
      // eslint-disable-next-line no-console
      console.log(`handleReloadLogFile`);
      readLog(logPath);
    }) as EventListener;

    const handleToggleFollowFile = (() => {
      // eslint-disable-next-line no-console
      console.log(`handleToggleFollowFile`);
      setLiveMode(!liveMode);
    }) as EventListener;

    const addEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`addEventListeners`);
      const elem = document?.querySelector('body');
      elem?.addEventListener('logFilePath', handleLogFilePath);
      elem?.addEventListener('reloadLogFile', handleReloadLogFile);
      elem?.addEventListener('toggleFollowFile', handleToggleFollowFile);
    };

    const removeEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`removeEventListeners`);
      const elem = document?.querySelector('body');
      elem?.removeEventListener('logFilePath', handleLogFilePath);
      elem?.removeEventListener('reloadLogFile', handleReloadLogFile);
      elem?.removeEventListener('toggleFollowFile', handleToggleFollowFile);
    };

    addEventListeners();
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
      removeEventListeners();
    };
  }, [logPath, liveMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ItemRenderer = (itemProps: any) => {
    const item = filteredContent[itemProps.index];
    const { lineNumber, logLine } = item; // filteredContent.length - itemProps.index;

    return (
      <div
        id={`logline${itemProps.index}`}
        className={styles.line}
        // eslint-disable-next-line react/no-array-index-key
        key={itemProps.index}
        style={itemProps.style}
      >
        <LogLine lineNumber={lineNumber} logLine={logLine} search={search} />
      </div>
    );
  };

  const searchLines = (searchString: string) => {
    if (searchString.length > 0) {
      const filteredLines = content.filter((value: Line) =>
        value.logLine.includes(searchString)
      );
      setFilteredContent(filteredLines);
    } else {
      setFilteredContent(content);
    }
  };

  const debouncedSearch = debounce(searchLines, 200);

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch, content]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={`${styles.sidebarButton} ${styles.active}`}>
            <div>
              <svg
                fill="currentColor"
                width="30"
                height="30"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.sidebarButton}>
            <div>
              <svg
                fill="currentColor"
                width="30"
                height="30"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
                  clipRule="evenodd"
                />
                <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
              </svg>
            </div>
          </div>
          <div className={styles.sidebarButton}>
            <div>
              <svg
                fill="currentColor"
                width="30"
                height="30"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className={styles.footerSpacer} />
          <div className={styles.sidebarButton}>
            <div>
              <svg
                fill="currentColor"
                width="30"
                height="30"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={styles.container} data-tid="container">
          {/*           <div className={styles.header}>
            <input
              className={styles.searchInput}
              placeholder="Search"
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(ev.target.value);
              }}
              value={search}
            />
          </div> */}
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
                ref={listRef}
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
