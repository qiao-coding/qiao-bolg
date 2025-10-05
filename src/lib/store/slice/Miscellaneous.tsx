import { createSlice } from "@reduxjs/toolkit";


interface interfaceMiscellaneous{
    MisceUid:number
    content:string
    date:string
}

interface MiscellaneousUI{
   fristMiscellaneous:interfaceMiscellaneous[]
    initializeMiscellaneous:null

}

const MiscellaneousinitialState:MiscellaneousUI={
    fristMiscellaneous:[
        {
      MisceUid: 1,
      content: "终于弄好一点react的基础了，弄个网页练习一下",
      date:'2025-7-25'
    },
    {
      MisceUid: 2,
      content: "今天把网页的内容完善一下，为部署上线做点准备，笔记什么的得加进入了",
      date:'2025-8-3'
    }
    ],
    initializeMiscellaneous:null

}

const Miscellaneous= createSlice({
    name:'Miscellaneous-slice',
    initialState:MiscellaneousinitialState,
    reducers:{
        setFristMiscellaneous(state,action){
            state.initializeMiscellaneous=action.payload
        }

    }
})
export const {setFristMiscellaneous}=Miscellaneous.actions
export type {interfaceMiscellaneous}
export default Miscellaneous.reducer