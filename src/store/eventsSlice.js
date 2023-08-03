import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("events")) || [];

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvents: (state, action) => {
      const eventId = action.payload;
      const existingEvent = state.find((event) => event=== eventId);
        console.log(existingEvent);
      if (!existingEvent) {
        state.push(eventId);
        localStorage.setItem("events", JSON.stringify(state));
      }
    },
    deleteEvent: (state, action) => {
        const eventId = action.payload;
        const updatedEvents = state.filter((event) => event !== eventId);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        return updatedEvents;
      },      
  },
});

export const { addEvents, deleteEvent } = eventsSlice.actions;

export default eventsSlice.reducer;

