import { createSlice } from "@reduxjs/toolkit";

interface interfaceTechnology {
  id: number;
  content: string;
  period: string;
}
interface TechnologyUI {
  fristTechnology: interfaceTechnology[];
  initializeTechnology: interfaceTechnology[] | null | string;
}

const Technology: TechnologyUI = {
  fristTechnology: [
    { id: 1, content: "HTML+CSS+JavaScript", period: "2025-3" },
    { id: 2, content: "前端工程化+CSS基础补充", period: "2025-6" },
    { id: 3, content: "React+JavaScript基础补充", period: "2025-6" },
    { id: 4, content: "Tailwind基础+React基础补充", period: "2025-7" },
    { id: 5, content: "Router+Redux+React+JS+工程化补充", period: "2025-8" },
    { id: 6, content: "TS学习+JS补习", period: "2025-8" },
    { id: 7, content: "JS算法+JS能力提升", period: "2025-8" },
    { id: 8, content: "Next入门+JS和TS基础补习", period: "2025-8" },
  ],
  initializeTechnology: null,
};
const TechnologySlice = createSlice({
  name: "Technology-Slice",
  initialState: Technology,
  reducers: {
    setFristTechnology(state, action) {
      state.initializeTechnology = action.payload;
    },
  },
});

export const { setFristTechnology } = TechnologySlice.actions;
export type { interfaceTechnology };
export default TechnologySlice.reducer;
