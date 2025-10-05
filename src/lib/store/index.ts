import { configureStore } from "@reduxjs/toolkit";
import notesReducer from './slice/NotsSlice'
import TechReducer from './slice/TechnologySlice'
import MisceReducer from './slice/Miscellaneous'



export const store= configureStore({
    reducer:{
        note:notesReducer,
         Tech:TechReducer,
        Misce:MisceReducer
    }
})


export type RootState=ReturnType<typeof store.getState>

export type AppDisPatch=typeof store.dispatch