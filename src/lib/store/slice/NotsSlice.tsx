import { createSlice } from "@reduxjs/toolkit";
import useStateImg from '../../../../public/NotesImage/React-Image/useState：状态管理.png';
import useEffectImg from '../../../../public/NotesImage/React-Image/useEffect：副作用处理.png';
import useContextImg from '../../../../public/NotesImage/React-Image/useContext：跨组件数据共享.png';
import customHookImg from '../../../../public/NotesImage/React-Image//自定义hook.png';
import parentToChildImg from '../../../../public/NotesImage/React-Image/组件通信-父传子.png'
import siblingCommImg from '../../../../public/NotesImage/React-Image/组件通信-兄弟互传.png';


import type { StaticImageData } from "next/image";

interface NotesPage{
      uid:number,
      title: string,
      contentTitle:string,
      excerpt:string,
      text1:string,
      BasicUsage:string,
      author: string,
      dateStart: string,
      dateEnd:string,
      picture?: string | StaticImageData | undefined | null
      pageTags: string[],
}

interface NotesInterface{
    id: number,
    title: string,
    content?: string,
    date?: string,
    tags: string[]
    page:NotesPage[]  
}



interface interfaceNotesState{
  fristNotes:NotesInterface[],
  initialValue:NotesInterface|null
}

const NotesInitialState:interfaceNotesState={
     fristNotes:[
      {
      id: 1,
      title: "Javascript",
      tags: ["Javascript"],
       page:[
       
     {
      uid: 1,
      title: "react-useState",
      contentTitle:'状态管理基础',
      excerpt: "React 状态管理基础 Hook",
      text1:`React 中最基础的状态管理 Hook，用于在函数组件中声明和管理状态。
      其核心作用是让组件拥有 "记忆" 能力，能够响应状态变化并重新渲染。`,
      BasicUsage:`通过 const [state, setState] = useState(initialValue) 声明状态，
      state 为当前状态值，setState 为更新状态的函数，
      initialValue 为初始值（可是任意类型）。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useStateImg,
      pageTags: ['react',"基础", "状态管理"],
   
    },
    {
      uid: 2,
      title: "react-useEffect",
      excerpt: "副作用处理与生命周期管理",
      contentTitle:'处理组件副作用',
       text1:`React 中用于处理组件副作用的 Hook，可模拟类组件的生命周期方法，统一管理数据请求、订阅、DOM 操作等副作用逻辑。`,
      BasicUsage:`：useEffect(effectCallback, dependencies)，effectCallback 为副作用函数，dependencies 为依赖数组。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useEffectImg,
      pageTags: ['react',"副作用", "生命周期"],
   
    },
    {
      uid: 3,
      title: "react-useContext",
      excerpt: "跨组件数据共享解决方案",
      contentTitle:'多层级组件间数据传递',
        text1:`用于解决多层级组件间数据传递的问题，避免 "props drilling"（props 层层传递）的冗余代码，实现跨组件状态共享。`,
      BasicUsage:`用 createContext 创建上下文：const MyContext = createContext(defaultValue)。
用 MyContext.Provider 包裹组件树，通过 value 属性传递数据。
子组件用 useContext(MyContext) 获取上下文数据，无需通过 props 传递`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useContextImg,
      pageTags: ['react',"状态共享", "上下文"],
   
    },
    {
      uid: 4,
      title: "组件通信-父传子",
      contentTitle:'父组件到子组件的数据传递',
      excerpt: "使用 props 进行父组件到子组件的数据传递",
       text1:`React 中最基础的组件通信方式，基于 "单向数据流" 原则，父组件通过 props 将数据传递给子组件，子组件被动接收并使用数据。`,
      BasicUsage:`父组件在调用子组件时，通过属性传递数据：<ChildComponent name="React" age={3} />。
子组件通过参数接收 props：function ChildComponent(props) { return <div>{props.name}</div>; }，或通过解构简化：function ChildComponent({ name, age }) {}。`,
  
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: parentToChildImg,
      pageTags: ['react',"组件通信", "props"],
  
    },
    {
      uid: 5,
      title: "组件通信-兄弟互传",
      contentTitle:'兄弟组件通信',
      excerpt: "兄弟组件间的数据传递方法",
      
        text1:`兄弟组件（同一父组件的子组件）无法直接通信，需通过 "状态提升" 或状态管理工具实现数据共享与传递。
`,
      BasicUsage:`状态提升：将共享状态存储在共同的父组件中，通过 props 分别传递给两个兄弟组件；子组件通过调用父组件提供的回调函数修改状态，间接实现兄弟间数据同步。
Context + useReducer：通过 Context 共享状态，配合 useReducer 管理复杂状态逻辑，适合多层级兄弟组件通信。
状态管理库（如 Redux）：大型应用中可通过全局状态库实现任意组件间通信。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: siblingCommImg,
      pageTags: ['react',"组件通信", "兄弟组件"],
  
    },
    {
      uid: 6,
      title: "自定义Hook",
      contentTitle:'自定义Hook',
      excerpt: "创建可复用的自定义Hook逻辑",
        text1:`用于封装组件中可复用的状态逻辑，让相同逻辑在多个组件间共享，同时保持组件代码简洁。`,
      BasicUsage:`命名必须以 use 开头（如 useLocalStorage、useFetch），确保 React 能识别其为 Hook 并应用 Hooks 规则。
只能在函数组件或其他自定义 Hook 中调用，不能在普通函数、条件语句或循环中调用`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: customHookImg,
      pageTags: ['react',"代码复用", "自定义"],
     
    }
 
      ]
     
    },
    {
      id: 2,
      title: "TypeScript",
      tags: ["TypeScript"],
       page:[
       
     {
      uid: 1,
      title: "react-useState",
      contentTitle:'状态管理基础',
      excerpt: "React 状态管理基础 Hook",
      text1:`React 中最基础的状态管理 Hook，用于在函数组件中声明和管理状态。
      其核心作用是让组件拥有 "记忆" 能力，能够响应状态变化并重新渲染。`,
      BasicUsage:`通过 const [state, setState] = useState(initialValue) 声明状态，
      state 为当前状态值，setState 为更新状态的函数，
      initialValue 为初始值（可是任意类型）。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useStateImg,
      pageTags: ['react',"基础", "状态管理"],
   
    },
    {
      uid: 2,
      title: "react-useEffect",
      excerpt: "副作用处理与生命周期管理",
      contentTitle:'处理组件副作用',
       text1:`React 中用于处理组件副作用的 Hook，可模拟类组件的生命周期方法，统一管理数据请求、订阅、DOM 操作等副作用逻辑。`,
      BasicUsage:`：useEffect(effectCallback, dependencies)，effectCallback 为副作用函数，dependencies 为依赖数组。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useEffectImg,
      pageTags: ['react',"副作用", "生命周期"],
   
    },
    {
      uid: 3,
      title: "react-useContext",
      excerpt: "跨组件数据共享解决方案",
      contentTitle:'多层级组件间数据传递',
        text1:`用于解决多层级组件间数据传递的问题，避免 "props drilling"（props 层层传递）的冗余代码，实现跨组件状态共享。`,
      BasicUsage:`用 createContext 创建上下文：const MyContext = createContext(defaultValue)。
用 MyContext.Provider 包裹组件树，通过 value 属性传递数据。
子组件用 useContext(MyContext) 获取上下文数据，无需通过 props 传递`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useContextImg,
      pageTags: ['react',"状态共享", "上下文"],
   
    },
    {
      uid: 4,
      title: "组件通信-父传子",
      contentTitle:'父组件到子组件的数据传递',
      excerpt: "使用 props 进行父组件到子组件的数据传递",
       text1:`React 中最基础的组件通信方式，基于 "单向数据流" 原则，父组件通过 props 将数据传递给子组件，子组件被动接收并使用数据。`,
      BasicUsage:`父组件在调用子组件时，通过属性传递数据：<ChildComponent name="React" age={3} />。
子组件通过参数接收 props：function ChildComponent(props) { return <div>{props.name}</div>; }，或通过解构简化：function ChildComponent({ name, age }) {}。`,
  
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: parentToChildImg,
      pageTags: ['react',"组件通信", "props"],
  
    },
    {
      uid: 5,
      title: "组件通信-兄弟互传",
      contentTitle:'兄弟组件通信',
      excerpt: "兄弟组件间的数据传递方法",
      
        text1:`兄弟组件（同一父组件的子组件）无法直接通信，需通过 "状态提升" 或状态管理工具实现数据共享与传递。
`,
      BasicUsage:`状态提升：将共享状态存储在共同的父组件中，通过 props 分别传递给两个兄弟组件；子组件通过调用父组件提供的回调函数修改状态，间接实现兄弟间数据同步。
Context + useReducer：通过 Context 共享状态，配合 useReducer 管理复杂状态逻辑，适合多层级兄弟组件通信。
状态管理库（如 Redux）：大型应用中可通过全局状态库实现任意组件间通信。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: siblingCommImg,
      pageTags: ['react',"组件通信", "兄弟组件"],
  
    },
    {
      uid: 6,
      title: "自定义Hook",
      contentTitle:'自定义Hook',
      excerpt: "创建可复用的自定义Hook逻辑",
        text1:`用于封装组件中可复用的状态逻辑，让相同逻辑在多个组件间共享，同时保持组件代码简洁。`,
      BasicUsage:`命名必须以 use 开头（如 useLocalStorage、useFetch），确保 React 能识别其为 Hook 并应用 Hooks 规则。
只能在函数组件或其他自定义 Hook 中调用，不能在普通函数、条件语句或循环中调用`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: customHookImg,
      pageTags: ['react',"代码复用", "自定义"],
     
    }
 
      ]
    },
    {
      id: 3,
      title: "Tailwind CSS",
      tags: ["CSS", "Tailwind"],
       page:[
       
     {
      uid: 1,
      title: "react-useState",
      contentTitle:'状态管理基础',
      excerpt: "React 状态管理基础 Hook",
      text1:`React 中最基础的状态管理 Hook，用于在函数组件中声明和管理状态。
      其核心作用是让组件拥有 "记忆" 能力，能够响应状态变化并重新渲染。`,
      BasicUsage:`通过 const [state, setState] = useState(initialValue) 声明状态，
      state 为当前状态值，setState 为更新状态的函数，
      initialValue 为初始值（可是任意类型）。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useStateImg,
      pageTags: ['react',"基础", "状态管理"],
   
    },
    {
      uid: 2,
      title: "react-useEffect",
      excerpt: "副作用处理与生命周期管理",
      contentTitle:'处理组件副作用',
       text1:`React 中用于处理组件副作用的 Hook，可模拟类组件的生命周期方法，统一管理数据请求、订阅、DOM 操作等副作用逻辑。`,
      BasicUsage:`：useEffect(effectCallback, dependencies)，effectCallback 为副作用函数，dependencies 为依赖数组。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useEffectImg,
      pageTags: ['react',"副作用", "生命周期"],
   
    },
    {
      uid: 3,
      title: "react-useContext",
      excerpt: "跨组件数据共享解决方案",
      contentTitle:'多层级组件间数据传递',
        text1:`用于解决多层级组件间数据传递的问题，避免 "props drilling"（props 层层传递）的冗余代码，实现跨组件状态共享。`,
      BasicUsage:`用 createContext 创建上下文：const MyContext = createContext(defaultValue)。
用 MyContext.Provider 包裹组件树，通过 value 属性传递数据。
子组件用 useContext(MyContext) 获取上下文数据，无需通过 props 传递`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useContextImg,
      pageTags: ['react',"状态共享", "上下文"],
   
    },
    {
      uid: 4,
      title: "组件通信-父传子",
      contentTitle:'父组件到子组件的数据传递',
      excerpt: "使用 props 进行父组件到子组件的数据传递",
       text1:`React 中最基础的组件通信方式，基于 "单向数据流" 原则，父组件通过 props 将数据传递给子组件，子组件被动接收并使用数据。`,
      BasicUsage:`父组件在调用子组件时，通过属性传递数据：<ChildComponent name="React" age={3} />。
子组件通过参数接收 props：function ChildComponent(props) { return <div>{props.name}</div>; }，或通过解构简化：function ChildComponent({ name, age }) {}。`,
  
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: parentToChildImg,
      pageTags: ['react',"组件通信", "props"],
  
    },
    {
      uid: 5,
      title: "组件通信-兄弟互传",
      contentTitle:'兄弟组件通信',
      excerpt: "兄弟组件间的数据传递方法",
      
        text1:`兄弟组件（同一父组件的子组件）无法直接通信，需通过 "状态提升" 或状态管理工具实现数据共享与传递。
`,
      BasicUsage:`状态提升：将共享状态存储在共同的父组件中，通过 props 分别传递给两个兄弟组件；子组件通过调用父组件提供的回调函数修改状态，间接实现兄弟间数据同步。
Context + useReducer：通过 Context 共享状态，配合 useReducer 管理复杂状态逻辑，适合多层级兄弟组件通信。
状态管理库（如 Redux）：大型应用中可通过全局状态库实现任意组件间通信。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: siblingCommImg,
      pageTags: ['react',"组件通信", "兄弟组件"],
  
    },
    {
      uid: 6,
      title: "自定义Hook",
      contentTitle:'自定义Hook',
      excerpt: "创建可复用的自定义Hook逻辑",
        text1:`用于封装组件中可复用的状态逻辑，让相同逻辑在多个组件间共享，同时保持组件代码简洁。`,
      BasicUsage:`命名必须以 use 开头（如 useLocalStorage、useFetch），确保 React 能识别其为 Hook 并应用 Hooks 规则。
只能在函数组件或其他自定义 Hook 中调用，不能在普通函数、条件语句或循环中调用`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: customHookImg,
      pageTags: ['react',"代码复用", "自定义"],
     
    }
 
      ]
    },
    {
      id: 4,
      title: "React",
      tags: ["React"],
       page:[
       
     {
      uid: 1,
      title: "react-useState",
      contentTitle:'状态管理基础',
      excerpt: "React 状态管理基础 Hook",
      text1:`React 中最基础的状态管理 Hook，用于在函数组件中声明和管理状态。
      其核心作用是让组件拥有 "记忆" 能力，能够响应状态变化并重新渲染。`,
      BasicUsage:`通过 const [state, setState] = useState(initialValue) 声明状态，
      state 为当前状态值，setState 为更新状态的函数，
      initialValue 为初始值（可是任意类型）。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useStateImg,
      pageTags: ['react',"基础", "状态管理"],
   
    },
    {
      uid: 2,
      title: "react-useEffect",
      excerpt: "副作用处理与生命周期管理",
      contentTitle:'处理组件副作用',
       text1:`React 中用于处理组件副作用的 Hook，可模拟类组件的生命周期方法，统一管理数据请求、订阅、DOM 操作等副作用逻辑。`,
      BasicUsage:`：useEffect(effectCallback, dependencies)，effectCallback 为副作用函数，dependencies 为依赖数组。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useEffectImg,
      pageTags: ['react',"副作用", "生命周期"],
   
    },
    {
      uid: 3,
      title: "react-useContext",
      excerpt: "跨组件数据共享解决方案",
      contentTitle:'多层级组件间数据传递',
        text1:`用于解决多层级组件间数据传递的问题，避免 "props drilling"（props 层层传递）的冗余代码，实现跨组件状态共享。`,
      BasicUsage:`用 createContext 创建上下文：const MyContext = createContext(defaultValue)。
用 MyContext.Provider 包裹组件树，通过 value 属性传递数据。
子组件用 useContext(MyContext) 获取上下文数据，无需通过 props 传递`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: useContextImg,
      pageTags: ['react',"状态共享", "上下文"],
   
    },
    {
      uid: 4,
      title: "组件通信-父传子",
      contentTitle:'父组件到子组件的数据传递',
      excerpt: "使用 props 进行父组件到子组件的数据传递",
       text1:`React 中最基础的组件通信方式，基于 "单向数据流" 原则，父组件通过 props 将数据传递给子组件，子组件被动接收并使用数据。`,
      BasicUsage:`父组件在调用子组件时，通过属性传递数据：<ChildComponent name="React" age={3} />。
子组件通过参数接收 props：function ChildComponent(props) { return <div>{props.name}</div>; }，或通过解构简化：function ChildComponent({ name, age }) {}。`,
  
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: parentToChildImg,
      pageTags: ['react',"组件通信", "props"],
  
    },
    {
      uid: 5,
      title: "组件通信-兄弟互传",
      contentTitle:'兄弟组件通信',
      excerpt: "兄弟组件间的数据传递方法",
      
        text1:`兄弟组件（同一父组件的子组件）无法直接通信，需通过 "状态提升" 或状态管理工具实现数据共享与传递。
`,
      BasicUsage:`状态提升：将共享状态存储在共同的父组件中，通过 props 分别传递给两个兄弟组件；子组件通过调用父组件提供的回调函数修改状态，间接实现兄弟间数据同步。
Context + useReducer：通过 Context 共享状态，配合 useReducer 管理复杂状态逻辑，适合多层级兄弟组件通信。
状态管理库（如 Redux）：大型应用中可通过全局状态库实现任意组件间通信。`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: siblingCommImg,
      pageTags: ['react',"组件通信", "兄弟组件"],
  
    },
    {
      uid: 6,
      title: "自定义Hook",
      contentTitle:'自定义Hook',
      excerpt: "创建可复用的自定义Hook逻辑",
        text1:`用于封装组件中可复用的状态逻辑，让相同逻辑在多个组件间共享，同时保持组件代码简洁。`,
      BasicUsage:`命名必须以 use 开头（如 useLocalStorage、useFetch），确保 React 能识别其为 Hook 并应用 Hooks 规则。
只能在函数组件或其他自定义 Hook 中调用，不能在普通函数、条件语句或循环中调用`,
      author: "HaoWhite",
      dateStart: "2025-07-15",
      dateEnd:'2025-8-3',
      picture: customHookImg,
      pageTags: ['react',"代码复用", "自定义"],
     
    }
 
      ]
    }
    ],
    initialValue:null
  }


export const NotesSlice=createSlice({
    name:'Notes-slice',
    initialState:NotesInitialState,
    reducers:{
      setNotesInitialStat(state,action){
        state.initialValue=action.payload
        
      },
      clrteNotesInitialStat(state){
        state.initialValue=null
      }
    }
})



export const { setNotesInitialStat,clrteNotesInitialStat }=NotesSlice.actions
export default NotesSlice.reducer
export type {NotesInterface}