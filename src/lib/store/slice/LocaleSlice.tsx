import { createSlice } from "@reduxjs/toolkit";

// 支持的语言类型
export type SupportedLocale = 'zh' | 'en' | 'jp';

// 语言状态接口
interface LocaleState {
  currentLocale: SupportedLocale;
  isInitialized: boolean;
}

// 初始状态
const initialState: LocaleState = {
  currentLocale: 'zh', // 默认中文
  isInitialized: false
};

// 创建语言切换切片
const localeSlice = createSlice({
  name: 'locale-slice',
  initialState,
  reducers: {
    // 设置语言
    setLocale: (state, action) => {
      state.currentLocale = action.payload;
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-locale', action.payload);
        
        // 设置 cookie 以便服务端读取
        document.cookie = `preferred-locale=${action.payload}; max-age=31536000; path=/; samesite=lax`;
      }
    },
    
    // 初始化语言设置（从 localStorage 读取）
    initializeLocale: (state) => {
      if (typeof window !== 'undefined') {
        const savedLocale = localStorage.getItem('preferred-locale') as SupportedLocale;
        if (savedLocale && ['zh', 'en', 'jp'].includes(savedLocale)) {
          state.currentLocale = savedLocale;
        }
      }
      state.isInitialized = true;
    },
    
    // 重置为默认语言
    resetLocale: (state) => {
      state.currentLocale = 'zh';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('preferred-locale');
        
        // 删除 cookie
        document.cookie = 'preferred-locale=; max-age=0; path=/';
      }
    }
  }
});

// 导出 actions
export const { setLocale, initializeLocale, resetLocale } = localeSlice.actions;

// 导出类型
export type { LocaleState };

// 导出 reducer
export default localeSlice.reducer;
