import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';
import { Line } from './logReader';

export interface Filter {
  id: number;
  enabled: boolean;
  search: string;
  caseSensitive: boolean;
  backgroundColor: string;
  color: string;
}

export interface Tab {
  title?: string;
  logPath?: string;
  logLines?: Line[];
  content?: Line[];
  selectedLine?: number;
  liveMode?: boolean;
  followMode?: boolean;
  search?: string;
}

// Refactor logPath, logLines, selectedLine into Tab
const logReaderSlice = createSlice({
  name: 'logReader',
  initialState: {
    activePanel: 0,
    filters: [{ id: Date.now(), search: `Sample filter` } as Filter],
    tabs: [] as Tab[],
    activeTab: 0,
  },
  reducers: {
    setActivePanel: (state, action: PayloadAction<number>) => {
      state.activePanel = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filter[]>) => {
      state.filters = action.payload;
    },
    addTab: (state, action: PayloadAction<Tab>) => {
      state.tabs = [...state.tabs, action.payload];
      state.activeTab = state.tabs.length - 1;
    },
    removeTab: (state, action: PayloadAction<number>) => {
      state.tabs = state.tabs.filter(
        (value: Tab, index: number) => index !== action.payload
      );
      state.activeTab -= 1;
    },
    updateTab: (state, action: PayloadAction<Tab>) => {
      const updatedTabs = state.tabs.map((value: Tab) => {
        if (value.logPath === action.payload.logPath) {
          return { ...value, ...action.payload };
        }
        return value;
      });
      state.tabs = updatedTabs;
    },
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  setActivePanel,
  setFilters,
  addTab,
  removeTab,
  updateTab,
  setActiveTab,
} = logReaderSlice.actions;

export default logReaderSlice.reducer;

export const selectActivePanel = (state: RootState) => state.log.activePanel;
export const selectFilters = (state: RootState) => state.log.filters;
export const selectTabs = (state: RootState) => state.log.tabs;
export const selectActiveTab = (state: RootState) =>
  state.log.tabs[state.log.activeTab];
