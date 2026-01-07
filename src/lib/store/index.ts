import { configureStore } from "@reduxjs/toolkit";
import MisceReducer from './slice/Miscellaneous'




export const store = configureStore({
    reducer: {
        Misce: MisceReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDisPatch = typeof store.dispatch