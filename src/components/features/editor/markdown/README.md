# Markdown 编辑器组件文档

## 概述

这是一个功能丰富的 Markdown 编辑器组件，基于 React 和 TypeScript 开发，支持实时预览、语法高亮、工具栏操作等功能。组件采用模块化设计，易于扩展和维护。

## 主要功能

### 📝 编辑功能
- **实时编辑**：支持 Markdown 语法的实时输入和编辑
- **语法高亮**：支持多种编程语言的语法高亮显示
- **自动保存**：支持内容变化时的自动保存（防抖处理）
- **撤销/重做**：完整的撤销和重做功能，支持键盘快捷键
- **滚动同步**：编辑器和预览区智能同步滚动

### 🎨 显示模式
- **编辑模式**：纯编辑界面，专注于内容创作
- **预览模式**：纯预览界面，实时查看渲染效果
- **分屏模式**：编辑和预览同时显示，支持同步滚动

### 🛠️ 工具栏功能
- **格式化工具**：粗体、斜体、标题、列表、引用、代码块、链接、分割线
- **文件操作**：上传文件、下载文件
- **视图控制**：全屏切换、模式切换
- **保存功能**：手动保存内容

### 📊 状态管理
- **字数统计**：实时显示文档字数
- **字符统计**：实时显示字符数量
- **历史记录**：维护完整的编辑历史

### 🎯 用户体验
- **主题切换**：支持亮色/暗色主题
- **响应式设计**：适配不同屏幕尺寸
- **键盘快捷键**：支持常用快捷键操作
- **高性能滚动同步**：优化的分屏模式滚动同步，流畅无延迟

## 组件架构

```
markdown/
├── markdownEditor.tsx      # 主编辑器组件
├── type.ts                 # TypeScript 类型定义
├── utils.ts                # 工具函数
├── components/             # 子组件目录
│   ├── CodeBlock.tsx       # 代码块组件
│   ├── StatusBar.tsx       # 状态栏组件
│   ├── ToolbarButton.tsx   # 工具栏按钮组件
│   └── showToolbar.tsx     # 工具栏容器组件
└── README.md               # 文档说明
```

## 技术特性

### 🚀 性能优化
- **组件记忆化**：使用 `React.memo` 优化 Markdown 预览组件
- **函数缓存**：使用 `useCallback` 和 `useMemo` 避免不必要的重渲染
- **节流处理**：滚动事件使用 16ms 节流，确保 60fps 的流畅体验
- **防抖保存**：内容变化使用 300ms 防抖，避免频繁保存操作

### 🔧 核心技术
- **TypeScript**：完整的类型安全支持
- **React Hooks**：现代化的状态管理和副作用处理
- **Tailwind CSS**：响应式设计和主题切换
- **React Markdown**：强大的 Markdown 渲染引擎
- **remarkGfm**：GitHub Flavored Markdown 支持
- **rehypeHighlight**：代码语法高亮

### 📱 兼容性
- **现代浏览器**：支持 Chrome、Firefox、Safari、Edge
- **移动端适配**：响应式设计，支持移动设备
- **主题支持**：亮色/暗色主题自动切换

## API 文档

### MarkdownEditor 组件

#### Props

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `initialContent` | `string` | `"开始你的写作吧..."` | 初始内容 |
| `value` | `string` | `''` | 受控的编辑器内容 |
| `onSave` | `(content: string) => void` | `undefined` | 保存回调函数 |
| `onChange` | `(content: string) => void` | `undefined` | 内容变化回调 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showStatusBar` | `boolean` | `true` | 是否显示状态栏 |
| `initialMode` | `EditorMode` | `'edit'` | 初始显示模式 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题模式 |
| `className` | `string` | `''` | 容器自定义类名 |
| `editorClass` | `string` | `''` | 编辑器自定义类名 |
| `viewClass` | `string` | `''` | 预览区自定义类名 |

#### EditorMode 类型

```typescript
type EditorMode = 'edit' | 'preview' | 'split';
```

### 使用示例

#### 基本使用

```tsx
import MarkdownEditor from '@/components/features/editor/markdown/markdownEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <MarkdownEditor
      value={content}
      onChange={setContent}
      theme="light"
      showToolbar={true}
      showStatusBar={true}
    />
  );
}
```

#### 高级配置

```tsx
import MarkdownEditor from '@/components/features/editor/markdown/markdownEditor';

function AdvancedEditor() {
  const [content, setContent] = useState('# Hello World\n\nThis is a **markdown** editor.');
  
  const handleSave = (content: string) => {
    // 保存到服务器或本地存储
    console.log('Saving content:', content);
  };

  return (
    <MarkdownEditor
      value={content}
      onChange={setContent}
      onSave={handleSave}
      initialMode="split"
      theme="dark"
      className="h-screen"
      editorClass="text-lg"
      viewClass="prose-xl"
    />
  );
}
```

## 子组件详解

### CodeBlock 组件

代码块显示组件，支持语法高亮和复制功能。

#### 特性
- 自动检测编程语言
- 一键复制代码功能
- 语言标签显示
- 复制状态反馈

#### Props

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `children` | `React.ReactNode` | 代码内容 |
| `className` | `string` | 自定义类名 |

### StatusBar 组件

状态栏组件，显示文档统计信息。

#### 特性
- 实时字数统计
- 实时字符统计
- 主题适配

#### Props

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `wordCount` | `number` | 字数 |
| `charCount` | `number` | 字符数 |
| `theme` | `'light' \| 'dark'` | 主题模式 |

### ToolbarButton 组件

工具栏按钮组件，用于构建工具栏。

#### Props

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `icon` | `React.ReactNode` | 按钮图标 |
| `title` | `string` | 按钮标题/提示 |
| `onClick` | `() => void` | 点击事件 |
| `theme` | `'light' \| 'dark'` | 主题模式 |

### ShowToolbar 组件

工具栏容器组件，整合所有工具栏功能。

#### Props

| 属性名 | 类型 | 描述 |
|--------|------|------|
| `onSave` | `() => void` | 保存回调 |
| `onFileDownload` | `() => void` | 下载回调 |
| `onFileUpload` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | 上传回调 |
| `toolbarActions` | `ToolbarAction[]` | 工具栏操作列表 |
| `modeButtons` | `ModeButton[]` | 模式切换按钮 |
| `editorMode` | `EditorMode` | 当前编辑模式 |
| `setEditorMode` | `(mode: EditorMode) => void` | 设置编辑模式 |
| `isFullscreen` | `boolean` | 全屏状态 |
| `toggleFullscreen` | `() => void` | 切换全屏 |
| `theme` | `'light' \| 'dark'` | 主题模式 |

## 工具函数

### calculateWordCount

计算文本字数。

```typescript
const calculateWordCount = (text: string): number;
```

### calculateCharCount

计算文本字符数。

```typescript
const calculateCharCount = (text: string): number;
```

### getLanguageFromExtension

从文件扩展名获取编程语言标识。

```typescript
const getLanguageFromExtension = (extension: string): string | undefined;
```

### MarkdownStyle

动态加载代码高亮样式。

```typescript
MarkdownStyle.getMarkdownStyle({ theme: 'light' | 'dark' });
```

## 支持的编程语言

编辑器支持以下编程语言的语法高亮：

### 前端语言
- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- HTML (`.html`)
- CSS (`.css`, `.scss`, `.less`)

### 后端语言
- Java (`.java`)
- Python (`.py`)
- C/C++ (`.c`, `.cpp`)
- C# (`.cs`)
- Go (`.go`)
- Ruby (`.rb`)
- PHP (`.php`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- Rust (`.rs`)
- Scala (`.scala`)

### 数据格式
- JSON (`.json`)
- XML (`.xml`)
- YAML (`.yaml`, `.yml`)

### 其他
- Bash (`.sh`)
- SQL (`.sql`)
- Markdown (`.md`)

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Shift + Z` | 重做 |

## 样式定制

### CSS 类名

编辑器提供了多个 CSS 类名用于样式定制：

- `.markdown-editor-container` - 主容器
- `.markdown-editor-textarea` - 编辑区域
- `.markdown-editor-preview` - 预览区域
- `.markdown-toolbar` - 工具栏
- `.markdown-statusbar` - 状态栏

### 主题变量

支持亮色和暗色两种主题，可通过 Tailwind CSS 的主题系统进行定制。

### 性能优化

### 防抖处理
- 内容变化回调使用 300ms 防抖
- 避免频繁的保存操作

### 内存优化
- 使用 `useCallback` 优化函数引用
- 使用 `useMemo` 缓存计算结果
- 合理的事件监听器清理

### 渲染优化
- 条件渲染避免不必要的组件更新
- 使用 `memo` 优化 Markdown 预览组件
- 节流处理滚动事件，提升性能

### 🚀 滚动同步优化

编辑器使用优化的滚动同步机制，在分屏模式下实现编辑器和预览区的实时同步滚动：

#### 核心优化策略
- **节流控制**：使用 16ms 节流（约60fps）限制滚动事件频率
- **变化检测**：只有当滚动位置有显著变化时才触发同步
- **边界检查**：验证目标滚动位置的合理性，避免无效更新
- **状态管理**：使用 `requestAnimationFrame` 优化滚动性能
- **防竞争**：通过状态标志防止滚动事件的循环触发

#### 技术实现
```typescript
// 滚动同步核心函数
const syncScroll = useCallback((source: 'editor' | 'preview') => {
  // 频率限制（约60fps）
  if (now - lastScrollSyncRef.current < 16) return;
  
  // 变化检测
  if (Math.abs(currentScroll - lastScroll) < 1) return;
  
  // 边界检查和位置同步
  const scrollRatio = sourceScroll / sourceHeight;
  target.scrollTop = scrollRatio * targetHeight;
}, [editorMode]);

// 节流处理
const handleEditorScroll = useCallback(throttle(
  () => syncScroll('editor'),
  16,
), [syncScroll]);
```

#### 性能优势
- **低延迟**：16ms 节流确保流畅的滚动体验
- **高精度**：基于滚动比例的精确位置同步
- **资源友好**：避免频繁的 DOM 操作和重排
- **稳定性**：完善的边界检查防止异常情况

## 扩展性

### 添加新的工具栏按钮

```typescript
const customToolbarItems = [
  {
    icon: <CustomIcon />,
    title: '自定义功能',
    action: () => customAction()
  }
];
```

### 自定义 Markdown 组件

```typescript
const customComponents = {
  // 自定义组件渲染
  h1: ({ children }) => <h1 className="custom-h1">{children}</h1>,
  // ... 其他组件
};
```

## 依赖项

### 主要依赖
- React 18+
- TypeScript
- React Markdown
- Remark GFM
- Rehype Highlight
- Lucide React（图标）

### 可选依赖
- Tailwind CSS（样式）
- Framer Motion（动画）

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本发布
- 基础编辑功能
- 工具栏支持
- 主题切换
- 文件操作

---

如有问题或建议，请联系开发团队或提交 Issue。
