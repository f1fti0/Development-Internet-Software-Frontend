import { configureStore } from '@reduxjs/toolkit';
import migrationMethodsReducer from './slices/migrationMethodsSlice';
import migrationMethodDetailReducer from './slices/migrationMethodDetailSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    migrationMethods: migrationMethodsReducer,
    migrationMethodDetail: migrationMethodDetailReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;