import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActivePanel,
  setActivePanel,
} from '../features/logReader/logReaderSlice';
import styles from './Home.css';

export const Sidebar = (props: any) => {
  const activePanel = useSelector(selectActivePanel);
  const dispatch = useDispatch();

  return (
    <div className={styles.sidebar}>
      <div
        id="sidebarButton-detail"
        data-tooltip="Detail"
        data-panelId={0}
        className={`${styles.sidebarButton} ${
          activePanel === 0 ? styles.active : ``
        } tooltip-right`}
        onClick={() => {
          dispatch(setActivePanel(activePanel === 0 ? -1 : 0));
        }}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <div>
          <svg
            stroke="currentColor"
            fill="none"
            width="30"
            height="30"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(4 3)"
            >
              <path d="m2.5.5h8c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-8c-1.1045695 0-2-.8954305-2-2v-10c0-1.1045695.8954305-2 2-2z" />
              <path d="m3.5.5h4v5.012l-2-2.012-2 2.012z" />
            </g>
          </svg>
        </div>
      </div>
      <div
        id="sidebarButton-windows"
        data-tooltip="Windows"
        data-panelId={1}
        className={`${styles.sidebarButton} ${
          activePanel === 1 ? styles.active : ``
        } tooltip-right`}
        onClick={() => {
          dispatch(setActivePanel(activePanel === 1 ? -1 : 1));
        }}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <div>
          <svg
            stroke="currentColor"
            fill="none"
            width="30"
            height="30"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(2 2)"
            >
              <path d="m.5 8.5 8 4 8.017-4" />
              <path d="m.5 12.5 8 4 8.017-4" />
              <path d="m.5 4.657 8.008 3.843 8.009-3.843-8.009-4.157z" />
            </g>
          </svg>
        </div>
      </div>
      <div
        id="sidebarButton-filters"
        data-tooltip="Filters"
        data-panelId={2}
        className={`${styles.sidebarButton} ${
          activePanel === 2 ? styles.active : ``
        } tooltip-right`}
        onClick={(event: any) => {
          dispatch(setActivePanel(activePanel === 2 ? -1 : 2));
          event.preventDefault();
        }}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <div>
          <svg
            stroke="currentColor"
            fill="none"
            width="30"
            height="30"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m.5.5h12l-4 7v3l-3 2.998v-5.998z"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(4 4)"
            />
          </svg>
        </div>
      </div>
      <div className={styles.footerSpacer} />
      <div
        id="sidebarButton-settings"
        data-tooltip="Settings"
        data-panelId={99}
        className={`${styles.sidebarButton} ${
          activePanel === 99 ? styles.active : ``
        } tooltip-right`}
        onClick={() => {
          dispatch(setActivePanel(activePanel === 99 ? -1 : 99));
        }}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <div>
          <svg
            stroke="currentColor"
            fill="none"
            width="30"
            height="30"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14.5 9v-6.5" />
              <path d="m14.5 18.5v-4.5" />
              <circle cx="14.5" cy="11.5" r="2.5" />
              <path d="m6.5 5v-2.5" />
              <path d="m6.5 18.5v-8.5" />
              <circle cx="6.5" cy="7.5" r="2.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
