import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import allEventsSlice from './store/allEventsSlice';
import singleEventSlice from './store/singleEventSlice';
import locationSlice from './store/locationSlice';

const store = configureStore({
  reducer: { 
    allEvents: allEventsSlice,
    singleEvent: singleEventSlice,
    location: locationSlice
 },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
