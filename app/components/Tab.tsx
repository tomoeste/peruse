import React, { useEffect } from 'react';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import styles from './Home.css';
import { LogList } from './LogList';
import {
  selectActiveTab,
  updateTab,
} from '../features/logReader/logReaderSlice';

// Continue to refactor moving file read logic to Tab level
// Move event handler for open file to Home component
// Read current Tab live/follow modes for footer(?)
// Decide when to unmount handlers/watchers on tab change
export const TabComponent = () => {
  const activeTab = useSelector(selectActiveTab);
  const dispatch = useDispatch();

  useEffect(() => {
    const setLiveMode = (mode: boolean) => {
      dispatch(updateTab({ logPath: activeTab?.logPath, liveMode: mode }));
    };

    const setFollowMode = (mode: boolean) => {
      dispatch(updateTab({ logPath: activeTab?.logPath, followMode: mode }));
    };

    const readLog = (pathToRead: string | undefined) => {
      if (pathToRead && pathToRead.length > 0) {
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
          dispatch(
            updateTab({ logPath: activeTab?.logPath, content: newContent })
          );
          // eslint-disable-next-line no-console
          console.log(`readLog`, path, newContent.length);
          readable.destroy();
        });
      }
    };

    const handleReloadLogFile = () => {
      // eslint-disable-next-line no-console
      console.log(`handleReloadLogFile`);
      readLog(activeTab?.logPath);
    };

    const handleToggleFollowFile = () => {
      // eslint-disable-next-line no-console
      console.log(`handleToggleFollowFile`);
      if (activeTab?.followMode) {
        setFollowMode(false);
      } else {
        setLiveMode(true);
        setFollowMode(true);
      }
    };

    const addEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`addEventListeners`);
      const elem = document?.querySelector('body');
      elem?.addEventListener('reloadLogFile', handleReloadLogFile);
      elem?.addEventListener('toggleFollowFile', handleToggleFollowFile);
    };

    const removeEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`removeEventListeners`);
      const elem = document?.querySelector('body');
      elem?.removeEventListener('reloadLogFile', handleReloadLogFile);
      elem?.removeEventListener('toggleFollowFile', handleToggleFollowFile);
    };

    addEventListeners();
    const readDebounced = debounce(readLog, 200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let watcher: any;

    if (activeTab?.logPath && activeTab?.logPath.length > 0) {
      readLog(activeTab.logPath);
      // Watch log file for changes
      watcher = chokidar.watch(activeTab.logPath, {
        persistent: true,
      });
      if (activeTab?.liveMode) {
        watcher.on('change', (watchPath: string) => {
          readDebounced(watchPath);
        });
      }
    }
    if (!activeTab?.liveMode && watcher) watcher.close();
    return () => {
      if (watcher) watcher.close();
      removeEventListeners();
    };
  }, [
    dispatch,
    activeTab?.logPath,
    activeTab?.liveMode,
    activeTab?.followMode,
  ]);

  return (
    <div className={styles.tab} id={activeTab?.title}>
      <LogList />
    </div>
  );
};

export default TabComponent;
