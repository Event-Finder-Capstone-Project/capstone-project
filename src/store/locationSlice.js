import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    latitude: null,
    longitude: null
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
    },
  },
});

export const { setLocation } = locationSlice.actions;

export default locationSlice.reducer;