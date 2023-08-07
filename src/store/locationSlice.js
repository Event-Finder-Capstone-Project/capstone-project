import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latitude: 0,
  longitude: 0,
  postalCode: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setPostalCode: (state, action) => {
      state.postalCode = action.payload;
    },
  },
});

export const { setLocation, setPostalCode } = locationSlice.actions;

export default locationSlice.reducer;
