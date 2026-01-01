import { configureStore } from "@reduxjs/toolkit";
import TechReducer from './slice/TechnologySlice'
import MisceReducer from './slice/Miscellaneous'
import localeReducer from './slice/LocaleSlice'




export const store = configureStore({
    reducer: {
        Tech: TechReducer,
        Misce: MisceReducer,
        locale: localeReducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDisPatch = typeof store.dispatch