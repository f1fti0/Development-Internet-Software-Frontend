import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux";

const filtersSlice = createSlice({
    name: "filters",
    initialState: {
        appliedSearchText: ""
    },
    reducers: {
        setAppliedSearchText(state, {payload}) {
            state.appliedSearchText = payload
        },
        clearAppliedSearchText(state) {
            state.appliedSearchText = ""
        }
    }
})

export const useAppliedSearchText = () =>
    useSelector((state: {ourFilters: {appliedSearchText: string}}) => state.ourFilters.appliedSearchText)

export const {
    setAppliedSearchText: setAppliedSearchTextAction,
    clearAppliedSearchText: clearAppliedSearchTextAction
} = filtersSlice.actions

export default filtersSlice.reducer