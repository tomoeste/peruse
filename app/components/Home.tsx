import React, { useEffect } from 'react';
import * as path from 'path';
import * as settings from 'electron-settings';
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
} from '../features/logReader/logReaderSlice';
import { Windows } from './Windows';
import { Filters } from './Filters';
import { Settings } from './Settings';
import { Tabs } from './Tabs';

// TODO: Crash closing last tab, finish implementing filters
// Fix selection rerenders, perfomance check, test install w/ file extensions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home(): JSX.Element {
  const tabs = useSelector(selectTabs);
  const dispatch = useDispatch();
  const activePanel = useSelector(selectActivePanel);

  useEffect(() => {
    const openFile = settings.getSync('openFilePath');
    if (openFile && openFile.toString().length > 0) {
      // document.title = `${path.parse(openFile.toString()).base} - Peruse`;
      // dispatch(setLogPath(openFile.toString()));
    }
  }, []);

  useEffect(() => {
    const handleLogFilePath = ((event: CustomEvent) => {
      // eslint-disable-next-line no-console
      const pathFromEvent = event.detail.replace(/\\+/g, '\\');
      const fileName = path.parse(pathFromEvent).base;
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
      document.title = `${fileName} - Peruse`;
      dispatch(addTab(newTab));
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
  }, [dispatch]);

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
            {tabs.length === 0 && <NoOpenLog />}
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
              <Tabs />
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
