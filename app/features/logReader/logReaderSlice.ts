import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const logReaderSlice = createSlice({
  name: 'logReader',
  initialState: { log: `` },
  reducers: {
    setLog: (state, action: PayloadAction<string>) => {
      state.log = action.payload;
    },
  },
});

export const { setLog } = logReaderSlice.actions;

export default logReaderSlice.reducer;

export const selectLog = (state: RootState) => state.log.log;
