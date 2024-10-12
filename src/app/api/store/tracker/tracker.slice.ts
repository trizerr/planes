import { createSlice } from '@reduxjs/toolkit';
import trackerThunks from '@/app/api/store/tracker/tracker.thunks';
import { TrackerState } from '@/app/api/store/tracker/tracker.types';

const initialState: TrackerState = {
  flights: [],
  error: null,
};

export const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(trackerThunks.getFlights.fulfilled, (state, action) => {
      state.flights = action.payload.slice(0, 1000);
    });
    builder.addCase(trackerThunks.getFlights.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default trackerSlice.reducer;
