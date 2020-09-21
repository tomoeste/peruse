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

const logReaderSlice = createSlice({
  name: 'logReader',
  initialState: {
    logPath: ``,
    logLines: [] as Line[],
    selectedLine: 0,
    activePanel: 0,
    filters: [{ id: Date.now(), search: `Sample filter` } as Filter],
  },
  reducers: {
    setLogPath: (state, action: PayloadAction<string>) => {
      state.logPath = action.payload;
    },
    setLogLines: (state, action: PayloadAction<Line[]>) => {
      state.logLines = action.payload;
    },
    setSelectedLine: (state, action: PayloadAction<number>) => {
      state.selectedLine = action.payload;
    },
    setActivePanel: (state, action: PayloadAction<number>) => {
      state.activePanel = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filter[]>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setLogPath,
  setLogLines,
  setSelectedLine,
  setActivePanel,
  setFilters,
} = logReaderSlice.actions;

export default logReaderSlice.reducer;

export const selectLogPath = (state: RootState) => state.log.logPath;
export const selectLogLines = (state: RootState) => state.log.logLines;
export const selectSelectedLine = (state: RootState) => state.log.selectedLine;
export const selectActivePanel = (state: RootState) => state.log.activePanel;
export const selectFilters = (state: RootState) => state.log.filters;
