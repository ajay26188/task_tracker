import { configureStore } from "@reduxjs/toolkit";
import alertMessageReducer from "./reducers/alertMessageReducer";

const store = configureStore({
    reducer: {
        alertMessage: alertMessageReducer
    }
})

console.log(store.getState());

export default store;

// Infer types for dispatch and state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch