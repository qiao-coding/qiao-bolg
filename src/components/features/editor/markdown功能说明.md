# Markdown 编辑器功能说明

## 概述

这是一个功能强大的 Markdown 编辑器组件，支持实时预览、多种编辑模式和丰富的 Markdown 语法。

## 功能特点

### 1. 多模式编辑
- **编辑模式**：纯文本编辑界面
- **预览模式**：纯渲染预览界面
- **分栏模式**：左右分栏，同时显示编辑区和预览区

### 2. 丰富的工具栏
- **格式化工具**：粗体、斜体、标题、列表等
- **内容工具**：引用、代码块、链接、分割线等
- **模式切换**：编辑/预览/分栏模式快速切换

### 3. 实时统计
- 实时字数统计
- 实时字符数统计
- 状态栏显示

### 4. 语法高亮
- 支持多种编程语言的语法高亮
- 自动检测代码块语言
- 美观的代码展示效果

### 5. 同步滚动
- 在分栏模式下，编辑区和预览区滚动同步
- 提供更好的编辑体验

## 技术实现

### 主要依赖
- `react-markdown` - Markdown 渲染
- `remark-gfm` - GitHub Flavored Markdown 支持
- `rehype-highlight` - 语法高亮
- `lucide-react` - 图标组件

### 核心功能实现

#### 1. 内容管理
```typescript
const [content, setContent] = useState<string>(value);
```
使用 React state 管理编辑内容，支持初始内容和外部传值。

#### 2. 模式切换
```typescript
const [editorMode, setEditorMode] = useState<EditorMode>(initialMode);
```
支持三种编辑模式：'edit', 'preview', 'split'

#### 3. 同步滚动
```typescript
const handleEditorScroll = useCallback(() => {
  // 编辑器滚动时同步预览区域滚动
});

const handlePreviewScroll = useCallback(() => {
  // 预览区域滚动时同步编辑器滚动
});
```

#### 4. 工具栏操作
```typescript
const insertTextAtCursor = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
  // 在光标位置插入指定格式的文本
});
```

### 组件结构

```
MarkdownEditor
├── 工具栏 (ShowToolbar)
│   ├── 格式化按钮 (ToolbarButton)
│   └── 模式切换按钮
├── 编辑区域 (textarea)
├── 预览区域 (ReactMarkdown)
└── 状态栏 (StatusBar)
```

## API 接口

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| initialContent | string | "开始你的写作吧..." | 初始显示内容 |
| value | string | '' | 编辑器内容值 |
| onSave | (content: string) => void | - | 保存回调函数 |
| onChange | (content: string) => void | - | 内容变化回调 |
| showToolbar | boolean | true | 是否显示工具栏 |
| showStatusBar | boolean | true | 是否显示状态栏 |
| initialMode | EditorMode | 'edit' | 初始编辑模式 |
| theme | 'light' \| 'dark' | 'light' | 主题设置 |

### 类型定义

```typescript
type EditorMode = 'edit' | 'preview' | 'split';

interface MarkdownEditorLayoutProps {
  initialContent?: string;
  value?: string;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  initialMode?: EditorMode;
  theme?: 'light' | 'dark';
}
```

## 使用示例

```jsx
<MarkdownEditor
  initialContent="开始你的写作..."
  value={content}
  onChange={setContent}
  onSave={handleSave}
  showToolbar={true}
  showStatusBar={true}
  initialMode="split"
  theme="light"
/>
```

## 性能优化

1. **防抖处理**：内容变化回调使用防抖，避免频繁触发
2. **内存优化**：使用 `useCallback` 和 `useMemo` 优化渲染性能
3. **滚动同步**：使用标志位防止滚动同步时的循环调用

## 扩展性

- 支持自定义主题
- 可扩展工具栏功能
- 支持自定义渲染组件
- 易于集成到现有项目

## 注意事项

1. 需要配合 `next-intl` 进行国际化
2. 代码高亮依赖 `highlight.js` 相关样式
3. 响应式设计适配不同屏幕尺寸
4. 支持键盘快捷键操作

这个 Markdown 编辑器提供了完整的写作体验，结合了功能性和易用性，适合在博客、文档等应用场景中使用。