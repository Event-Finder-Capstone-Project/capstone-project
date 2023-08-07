import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latitude: 0,
  longitude: 0,
  city: "",
  state: "",
  county: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        city: action.payload.city,
        state: action.payload.state,
        county: action.payload.county,
      };
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;
