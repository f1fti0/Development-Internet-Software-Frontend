import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { type MigrationMethod } from "../modules/types";

const migrationMethodsSlice = createSlice({
    name: "migrationMethods",
    initialState: {
        methods: [] as MigrationMethod[],
        loading: false,
        error: null as string | null
    },
    reducers: {
        setMigrationMethods(state, {payload}) {
            state.methods = payload;
            state.loading = false;
            state.error = null;
        },
        setLoading(state, {payload}) {
            state.loading = payload;
        },
        setError(state, {payload}) {
            state.error = payload;
            state.loading = false;
        },
        clearMethods(state) {
            state.methods = [];
        }
    }
});

export const useMigrationMethods = () =>
    useSelector((state: {migrationMethods: {methods: MigrationMethod[]}}) => state.migrationMethods.methods);

export const useMigrationMethodsLoading = () =>
    useSelector((state: {migrationMethods: {loading: boolean}}) => state.migrationMethods.loading);

export const useMigrationMethodsError = () =>
    useSelector((state: {migrationMethods: {error: string | null}}) => state.migrationMethods.error);

export const {
    setMigrationMethods: setMigrationMethodsAction,
    setLoading: setLoadingAction,
    setError: setErrorAction,
    clearMethods: clearMethodsAction
} = migrationMethodsSlice.actions;

export default migrationMethodsSlice.reducer;