import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latitude: 40.7128,
  longitude: -74.006,
  city: "",
  state: ""
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setCityState: (state, action) => {
      state.city = action.payload.city;
      state.state = action.payload.state;
    },
  },
});

export const { setLocation, setCityState } = locationSlice.actions;

export default locationSlice.reducer;
