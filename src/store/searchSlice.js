import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getSearchResults = createAsyncThunk(
  "getSearchResults",
  async ({ query, postalCode, page, type, dateRange }) => {
    try {
      const auth = {
        username: process.env.REACT_APP_ALL_EVENTS_USERNAME,
        password: process.env.REACT_APP_ALL_EVENTS_PASSWORD,
      };
      const params = {
        page: page,
        per_page: 8,
      };

      if (query) {
        params["q"] = query;
      }

      if (dateRange) {
        params["datetime_utc.gte"] = dateRange.startDate;
        if (dateRange.endDate) {
          if (dateRange.endDate === dateRange.startDate) {
            const endDatePlusOneDay = new Date(dateRange.endDate);
            endDatePlusOneDay.setDate(endDatePlusOneDay.getDate() + 1);
            params["datetime_utc.lte"] = endDatePlusOneDay.toISOString();
          } else {
            params["datetime_utc.lte"] = dateRange.endDate;
          }
        }
      }

      if (type === "Dance") {
        params["type"] = ["dance_performance_tour", "cirque_du_soleil"];
      } else if (type === "Sports") {
        params["type"] = [
          "pga",
          "minor_league_baseball",
          "extreme_sports",
          "sports",
          "nfl",
          "wnba",
          "mlb",
          "ncaa_football",
          "mls",
          "tennis",
          "olympic_sports",
          "european_soccer",
          "soccer",
          "horse_racing",
          "rodeo",
          "auto_racing",
          "nascar",
          "monster_truck",
          "minor_league_hockey",
          "womens_college_volleyball",
          "national_womens_soccer",
          "football",
        ];
      } else if (type === "Theater") {
        params["type"] = [
          "theater",
          "broadway_tickets_national",
          "cirque_du_soleil",
        ];
      } else if (type === "Concerts") {
        params["type"] = [
          "concert",
          "music_festival",
          "classical_orchestral_instrumental",
          "classical",
        ];
      } else {
        params["type"] = type;
      }

      const response = await axios.get(`https://api.seatgeek.com/2/events`, {
        auth: auth,
        params: params,
      });
      return { events: response.data.events, total: response.data.meta.total };
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
  totalEvents: 0,
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
    builder.addCase(getSearchResults.fulfilled, (state, { payload }) => {
      state.events = payload.events;
      state.totalEvents = payload.total;
    });
  },
});

export const { setPostalCode, setQuery, setCity, setDateRange, setCoords } =
  searchSlice.actions;
export default searchSlice.reducer;
