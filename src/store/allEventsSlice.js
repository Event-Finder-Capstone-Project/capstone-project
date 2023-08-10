import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllEvents = createAsyncThunk("getAllEvents", async ({ type, page, latitude, longitude, venue, dateRange }) => {
  try {
    const auth = {
      username: process.env.REACT_APP_ALL_EVENTS_USERNAME,
      password: process.env.REACT_APP_ALL_EVENTS_PASSWORD,
    };
    const params = {
      page: page,
      type: type,
      per_page: 8
    };

    if (venue) {
      params["venue.city"] = venue.city;
      params["venue.state"] = venue.state;
    }  else if (latitude !== undefined && longitude !== undefined) {
      params["lat"] = latitude;
      params["lon"] = longitude;
    } ;
    if (dateRange) {
      params["datetime_utc.gte"] = dateRange.startDate;
      if (dateRange.endDate) {
        params["datetime_utc.lte"] = dateRange.endDate;
      }
    }


    const response = await axios.get(`https://api.seatgeek.com/2/events?type=${type}`, {
      auth: auth,
  params: params
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
    allEvents: [],
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
