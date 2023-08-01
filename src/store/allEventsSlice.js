import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllEvents = createAsyncThunk("getAllEvents", async ({ type, page }) => {
  try {
    const auth = {
      username: "MzUzMjU4MjV8MTY5MDgzNjc1MC41OTkwOTEz",
      password: "5204ee3ff5c3c6a060a1e4f6f50552c8e6afa2ba5d638fac32cf2cf5509c9aea",
    };

    const response = await axios.get("https://api.seatgeek.com/2/events", {
      auth: auth,
  
    });
    console.log(response.data)
    return response.data.events;
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
