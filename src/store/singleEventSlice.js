import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSingleEvent = createAsyncThunk(
  "singleEvent",
  async (id, { rejectWithValue }) => {
    try {
      const params = {
        client_id: "MzUzMjU4MjV8MTY5MDgzNjc1MC41OTkwOTEz",
        client_secret: "5204ee3ff5c3c6a060a1e4f6f50552c8e6afa2ba5d638fac32cf2cf5509c9aea",
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
