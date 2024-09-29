import { createAsyncThunk } from '@reduxjs/toolkit';
import flightDelayApi from '@/app/api/store/tracker/tracker.api';

const trackerThunks = {
  getFlights: createAsyncThunk(
    'tracker/getFlights',
    async (_, { rejectWithValue }) => {
      const { error, response } = await flightDelayApi.getFlights();

      if (error) {
        return rejectWithValue(error);
      }

      return response;
    }
  ),
};

export default trackerThunks;
