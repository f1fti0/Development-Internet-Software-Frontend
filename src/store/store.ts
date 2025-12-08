import { configureStore } from '@reduxjs/toolkit';
import migrationMethodsReducer from './slices/migrationMethodsSlice';
import migrationMethodDetailReducer from './slices/migrationMethodDetailSlice';
import userReducer from './slices/userSlice';
import migrationRequestsReducer from './slices/migrationRequestsSlice';
import migrationRequestsListReducer from './slices/migrationRequestsListSlice';

export const store = configureStore({
  reducer: {
    migrationMethods: migrationMethodsReducer,
    migrationMethodDetail: migrationMethodDetailReducer,
    user: userReducer,
    migrationRequests: migrationRequestsReducer,
    migrationRequestsList: migrationRequestsListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;