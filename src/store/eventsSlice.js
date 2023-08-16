import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const handleEventAsync = createAsyncThunk(
  "events/handleEventAsync",
  async (eventId) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      const userDocSnapshot = await getDoc(userDocRef);
      const userEvents = userDocSnapshot.data()?.events || [];

      if (userEvents.includes(eventId)) {
        const updatedEvents = userEvents.filter((id) => id !== eventId);
        await updateDoc(userDocRef, {
          events: updatedEvents,
        });
      } else {
        await updateDoc(userDocRef, {
          events: [...userEvents, eventId],
        });
      }
    } catch (error) {
      console.error("Error updating user events:", error);
    }
  }
);

const initialState = JSON.parse(localStorage.getItem("events")) || [];

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    handleEvents: (state, action) => {
      const eventId = action.payload;

      const existingEvent = state.find((event) => event === eventId);
      if (!existingEvent) {
        state.push(eventId);
        localStorage.setItem("events", JSON.stringify(state));
      } else {
        const updatedEvents = state.filter((event) => event !== eventId);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        return updatedEvents;
      }
    },
    hoveredEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
    clearHoveredEventId: (state) => {
      state.selectedEventId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleEventAsync.fulfilled, (state, action) => {
      const eventId = action.payload;
      const userEvents = state;

      if (userEvents.includes(eventId)) {
        return userEvents.filter((id) => id !== eventId);
      } else {
        return [...userEvents, eventId];
      }
    });
  },
});

export const { handleEvents,hoveredEventId, clearHoveredEventId } = eventsSlice.actions;

export default eventsSlice.reducer;
