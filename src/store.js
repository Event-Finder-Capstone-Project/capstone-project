import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import allEventsSlice from "./store/allEventsSlice";
import singleEventSlice from "./store/singleEventSlice";
import locationSlice from "./store/locationSlice";
import eventsSlice from "./store/eventsSlice";
import searchSlice from "./store/searchSlice";

const store = configureStore({
  reducer: {
    allEvents: allEventsSlice,
    singleEvent: singleEventSlice,
    location: locationSlice,
    events: eventsSlice,
    search: searchSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
