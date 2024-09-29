import { RootState } from '@/app/api/store/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectTracker = (state: RootState) => state.tracker;

export const selectFlights = createSelector(
  selectTracker,
  (state) => state.flights
);
