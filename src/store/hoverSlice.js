import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const hoverSlice = createSlice({
  name: "hoverId",
  initialState,
  reducers: {
    selectedHoveredEventId: (state, action) => {
      return action.payload;
    },
    clearHoveredEventId: () => {
      return null;
    },
  },
});

export const { selectedHoveredEventId, clearHoveredEventId } = hoverSlice.actions;
export default hoverSlice.reducer;
