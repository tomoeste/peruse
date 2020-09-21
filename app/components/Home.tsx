import React, { useEffect, useState } from 'react';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import * as settings from 'electron-settings';
import SplitPane from 'react-split-pane';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Home.css';
import { LogList } from './LogList';
import { Line } from '../features/logReader/logReader';
import { LogLineDetails } from './LogLineDetails';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { NoOpenLog } from './NoOpenLog';
import {
  selectActivePanel,
  selectLogPath,
  selectSelectedLine,
  setLogLines,
  setLogPath,
  setSelectedLine,
} from '../features/logReader/logReaderSlice';
import { Windows } from './Windows';
import { Filters } from './Filters';
import { Settings } from './Settings';

// TODO: Fix issue with selection rerenders, theme, settings,
// filters, perfomance check on large file, test install and file extensions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home(props: any): JSX.Element {
  const dispatch = useDispatch();
  const logPath = useSelector(selectLogPath);
  const activePanel = useSelector(selectActivePanel);
  const [liveMode, setLiveMode] = useState(false);
  const [followMode, setFollowMode] = useState(false);
  const [content, setContent] = useState<Line[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const readLog = (pathToRead: string) => {
      const readable = fs.createReadStream(pathToRead);
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
      document.title = `${path.parse(event.detail).base} - Peruse`;
      dispatch(setLogPath(event.detail));
    }) as EventListener;

    const handleReloadLogFile = (() => {
      // eslint-disable-next-line no-console
      console.log(`handleReloadLogFile`);
      readLog(logPath);
    }) as EventListener;

    const handleToggleFollowFile = (() => {
      // eslint-disable-next-line no-console
      console.log(`handleToggleFollowFile`);
      if (followMode) {
        setFollowMode(false);
      } else {
        setLiveMode(true);
        setFollowMode(true);
      }
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
        watcher.on('change', (watchPath: string) => {
          readDebounced(watchPath);
        });
      }
    }
    if (!liveMode && watcher) watcher.close();
    return () => {
      if (watcher) watcher.close();
      removeEventListeners();
    };
  }, [logPath, liveMode, followMode]);

  useEffect(() => {
    const openFile = settings.getSync('openFilePath');
    if (openFile && openFile.toString().length > 0) {
      document.title = `${path.parse(openFile.toString()).base} - Peruse`;
      dispatch(setLogPath(openFile.toString()));
    }
  }, []);

  useEffect(() => {
    const searchLines = (searchString: string) => {
      if (searchString.length > 0) {
        const filteredLines = content.filter((value: Line) =>
          value.logLine.includes(searchString)
        );
        dispatch(setLogLines(filteredLines));
      } else {
        dispatch(setLogLines(content));
      }
    };
    const debouncedSearch = debounce(searchLines, 200);
    debouncedSearch(search);
  }, [search, content, dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <SplitPane
          split="vertical"
          minSize={50}
          allowResize={false}
          resizerClassName=""
        >
          <Sidebar />
          <div className={styles.container} data-tid="container">
            {content.length === 0 && <NoOpenLog />}
            <SplitPane
              split="vertical"
              minSize={200}
              defaultSize={activePanel >= 0 ? `33%` : `100%`} // Implement more robust panel selection
              primary="first"
              allowResize
              size={activePanel >= 0 ? undefined : `100%`}
            >
              {activePanel === 0 && <LogLineDetails />}
              {activePanel === 1 && <Windows />}
              {activePanel === 2 && <Filters />}
              {activePanel === 99 && <Settings />}
              <LogList
                setSelectedLine={(line: number) => {
                  dispatch(setSelectedLine(line));
                }}
                search={search}
                liveMode={liveMode}
                followMode={followMode}
              />
            </SplitPane>
          </div>
        </SplitPane>
      </div>
      <Footer content={content} liveMode={liveMode} setLiveMode={setLiveMode} />
    </div>
  );
}
