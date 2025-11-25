import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./slices/filtersSlice";
import migrationMethodsReducer from "./slices/migrationMethodsSlice";

export default configureStore({
    reducer: combineReducers({
        ourFilters: filtersReducer,
        migrationMethods: migrationMethodsReducer
    })
});