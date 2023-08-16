import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSingleEvent = createAsyncThunk(
  "singleEvent",
  async (id, { rejectWithValue }) => {
    try {
      const params = {
        client_id: process.env.REACT_APP_ALL_EVENTS_USERNAME,
        client_secret: process.env.REACT_APP_ALL_EVENTS_PASSWORD,
        id: id,
      };
      const response = await axios.get("https://api.seatgeek.com/2/events", {
        params: params,
      });
      return response.data.events[0];
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {};

const singleEventSlice = createSlice({
  name: "singleEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleEvent.fulfilled, (state, { payload }) => {
        state.singleEvent = payload;
      })
      .addCase(getSingleEvent.rejected, (state) => {
        return initialState;
      })
  },
});

export const selectSingleEvent = (state) => {
  return state.singleEvent;
};

export default singleEventSlice.reducer;
