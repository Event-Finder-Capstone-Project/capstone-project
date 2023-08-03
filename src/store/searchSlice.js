import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSearchResults = createAsyncThunk("getSearchResults", async ({ query, postalCode, dateRange }) => {
  try {
    const auth = {
      username: "MzUzMjU4MjV8MTY5MDgzNjc1MC41OTkwOTEz",
      password: "5204ee3ff5c3c6a060a1e4f6f50552c8e6afa2ba5d638fac32cf2cf5509c9aea",
    };
    const params = {};

    if (query) {
      params["q"] = query;
    }

    if (dateRange) {
      params["gte"] = dateRange.startDate;
      if (dateRange.endDate) {
        params["lte"] = dateRange.endDate;
      }
    }

    if (postalCode) {
      params["postal_code"] = postalCode.trim();
    }

    const response = await axios.get(`https://api.seatgeek.com/2/events`, {
      auth: auth,
  params: params
    });
    return response.data.events;
  } catch (err) {
    console.log(err);
  }
});

const initialState = {
  postalCode: "",
  query: "",
  dateRange: null,
  events: []
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
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchResults.fulfilled, (state, action) => {
      state.events = action.payload; 
    });
  },
});

export const { setPostalCode, setQuery, setDateRange } = searchSlice.actions;
export default searchSlice.reducer;
