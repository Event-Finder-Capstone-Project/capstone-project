import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import allEventsSlice from './store/allEventsSlice';
import singleEventSlice from './store/singleEventSlice';

const store = configureStore({
  reducer: { 
    allEvents: allEventsSlice,
    singleEvent: singleEventSlice,
 },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
