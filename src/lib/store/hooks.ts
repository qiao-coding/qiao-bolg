'use client';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDisPatch, RootState } from ".";



export const useAppDispatch:()=>AppDisPatch=useDispatch
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector

