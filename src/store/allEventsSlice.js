import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllEvents = createAsyncThunk("getAllEvents", async ({ type, page }) => {
  try {
    const params = {
      client_id: "MzUzMjU4MjV8MTY5MDgzNjc1MC41OTkwOTEz",
      client_secret: "5204ee3ff5c3c6a060a1e4f6f50552c8e6afa2ba5d638fac32cf2cf5509c9aea",
      number: 10,
      offset: (page - 1) * 10, 
    };
    if (type) {
      params.type = type;
    }
    const response = await axios.get("https://api.seatgeek.com/2/events", {
      q: params,
    });
    return response.data.results;
  } catch (err) {
    console.log(err);
  }
});



const allEventsSlice = createSlice({
  name: "allEvents",
  initialState: {
    events: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEvents.fulfilled, (state, { payload }) => {
      state.allEvents = payload;
    });
  },
});


export const selectEvents = (state) => {
  return state.allEvents.allEvents;
};

export default allEventsSlice.reducer;
