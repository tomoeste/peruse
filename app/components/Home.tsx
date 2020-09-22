import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import * as path from 'path';
import * as settings from 'electron-settings';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import SplitPane from 'react-split-pane';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Home.css';
import { LogLineDetails } from './LogLineDetails';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { NoOpenLog } from './NoOpenLog';
import {
  selectActivePanel,
  selectTabs,
  addTab,
  Tab as TabType,
  setActiveTab,
  updateTab,
  selectActiveTab,
} from '../features/logReader/logReaderSlice';
import { Windows } from './Windows';
import { Filters } from './Filters';
import { Settings } from './Settings';
import { Tabs } from './Tabs';

// TODO: finish implementing filters, log templates, sort out follow vs. live mode
// Fix selection rerenders, perfomance check, test install w/ file extensions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home(): JSX.Element {
  const tabs = useSelector(selectTabs);
  const dispatch = useDispatch();
  const activePanel = useSelector(selectActivePanel);
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    const openFile = settings.getSync('openFilePath');
    if (openFile && openFile.toString().length > 0) {
      // document.title = `${path.parse(openFile.toString()).base} - Peruse`;
      // dispatch(setLogPath(openFile.toString()));
    }
  }, []);

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
      readLog(activeTab?.logPath);
    };

    const handleToggleFollowFile = () => {
      if (activeTab?.followMode) {
        setFollowMode(false);
      } else {
        setLiveMode(true);
        setFollowMode(true);
      }
    };

    const handleToggleLiveMode = () => {
      if (activeTab?.liveMode) {
        setLiveMode(false);
        setFollowMode(false);
      } else {
        setLiveMode(true);
      }
    };

    const addEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`addEventListeners`);
      const elem = document?.querySelector('body');
      elem?.addEventListener('reloadLogFile', handleReloadLogFile);
      elem?.addEventListener('toggleFollowFile', handleToggleFollowFile);
      elem?.addEventListener('toggleLiveMode', handleToggleLiveMode);
    };

    const removeEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`removeEventListeners`);
      const elem = document?.querySelector('body');
      elem?.removeEventListener('reloadLogFile', handleReloadLogFile);
      elem?.removeEventListener('toggleFollowFile', handleToggleFollowFile);
      elem?.removeEventListener('toggleLiveMode', handleToggleLiveMode);
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
      removeEventListeners();
      if (watcher) watcher.close();
    };
  }, [
    dispatch,
    activeTab?.logPath,
    activeTab?.liveMode,
    activeTab?.followMode,
  ]);

  useEffect(() => {
    const handleLogFilePath = ((event: CustomEvent) => {
      const pathFromEvent = event.detail.replace(/\\+/g, '\\');
      const fileName = path.parse(pathFromEvent).base;
      document.title = `${fileName} - Peruse`; // Look to Helmet for solution
      const existingTab = tabs.findIndex((value: TabType) => {
        return value.logPath === pathFromEvent;
      });
      if (existingTab >= 0) {
        dispatch(setActiveTab(existingTab));
      } else {
        const newTab: TabType = {
          title: fileName,
          logPath: pathFromEvent,
          logLines: [],
          content: [],
          liveMode: false,
          followMode: false,
          selectedLine: 0,
          search: '',
        };
        dispatch(addTab(newTab));
      }
    }) as EventListener;

    const addEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`addEventListeners`);
      const elem = document?.querySelector('body');
      elem?.addEventListener('logFilePath', handleLogFilePath);
    };

    const removeEventListeners = () => {
      // eslint-disable-next-line no-console
      console.log(`removeEventListeners`);
      const elem = document?.querySelector('body');
      elem?.removeEventListener('logFilePath', handleLogFilePath);
    };

    addEventListeners();
    return () => {
      removeEventListeners();
    };
  }, [dispatch, tabs]);

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
            <SplitPane
              split="vertical"
              minSize={200}
              defaultSize={activePanel >= 0 ? 400 : `100%`} // Implement more robust panel selection
              primary="first"
              allowResize
              size={activePanel >= 0 ? undefined : `100%`}
            >
              {activePanel === 0 && <LogLineDetails />}
              {activePanel === 1 && <Windows />}
              {activePanel === 2 && <Filters />}
              {activePanel === 99 && <Settings />}
              {tabs.length > 0 && <Tabs />}
              {tabs.length === 0 && <NoOpenLog />}
            </SplitPane>
          </div>
        </SplitPane>
      </div>
      {
        // Connect footer to tabs and active tab to get/set these values
      }
      <Footer />
    </div>
  );
}
