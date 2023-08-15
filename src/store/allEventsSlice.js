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
    if (type === "Dance") {
      params["type"] = "dance_performance_tour";
    } else if (type === "Sports") {
      params["type"] = [
        "pga", "minor_league_baseball", "extreme_sports", "sports",
        "nfl", "wnba", "mlb", "ncaa_football", "mls", "tennis",
        "olympic_sports", "european_soccer", "soccer", "horse_racing", 
        "rodeo", "auto_racing", "nascar", "monster_truck", "minor_league_hockey",
        "womens_college_volleyball", "national_womens_soccer", "football"
      ];
    }
    else if (type === "Theater") {
      params["type"] = ["theater", "broadway_tickets_national"];
    }
    else if (type === "Concerts") {
      params["type"] = [
        "concert", "music_festival",
        "classical_orchestral_instrumental", "classical"
      ];
    }
    
    else {
      params["type"] = type;
    }


    const response = await axios.get(`https://api.seatgeek.com/2/events?type=${type}`, {
      auth: auth,
  params: params
    });
    console.log(response.data)
    return {   events: response.data.events,
    total: response.data.meta.total 
    };
  } catch (err) {
    console.log(err);
  }
});

const allEventsSlice = createSlice({
  name: "allEvents",
  initialState: {
    allEvents: [],
    totalEvents: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEvents.fulfilled, (state, { payload }) => {
      state.allEvents = payload.events;
      state.totalEvents = payload.total;
    })
  },
});

export const selectEvents = (state) => {
  return state.allEvents.allEvents;
};

export default allEventsSlice.reducer;
