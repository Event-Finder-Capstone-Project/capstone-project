import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSearchResults = createAsyncThunk(
  "getSearchResults",
  async ({ query, postalCode, dateRange }) => {
    try {
      const auth = {
        username: process.env.REACT_APP_ALL_EVENTS_USERNAME,
        password: process.env.REACT_APP_ALL_EVENTS_PASSWORD,
      };
      const params = {};

      if (query) {
        params["q"] = query;
      }

      if (dateRange) {
        params["datetime_utc.gte"] = dateRange.startDate;
        if (dateRange.endDate) {
          params["datetime_utc.lte"] = dateRange.endDate;
        }
      }

      if (postalCode) {
        params["postal_code"] = postalCode.trim();
      }

      const response = await axios.get(`https://api.seatgeek.com/2/events`, {
        auth: auth,
        params: params,
      });
      return response.data.events;
    } catch (err) {
      console.log(err);
    }
  }
);

const initialState = {
  postalCode: "",
  city: "",
  state: "",
  zip: "",
  query: "",
  lat: parseFloat(localStorage.getItem("mapCenterLat")) || "",
  lng: parseFloat(localStorage.getItem("mapCenterLng")) || "",
  dateRange: null,
  events: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setPostalCode: (state, action) => {
      state.postalCode = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.zip = action.payload.zip;
    },
    setDateRange: (state, action) => {
      state.dateRange = {
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      };
    },
    setCoords: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchResults.fulfilled, (state, action) => {
      state.events = action.payload;
    });
  },
});

export const { setPostalCode, setQuery, setCity, setDateRange, setCoords } =
  searchSlice.actions;
export default searchSlice.reducer;
