// 编辑器模式类型定义
export type EditorMode = 'edit' | 'preview' | 'split';

// Markdown编辑器布局属性接口
export interface MarkdownEditorLayoutProps {
  initialContent?: string;
  value?: string;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  initialMode?: EditorMode;
  theme?: 'light' | 'dark';
  className?: string;
  editorClass?: string;
  viewClass?: string;
}

export interface insertTextAtCursorType {
  (prefix: string, suffix: string, defaultText: string): void;
}

// 工具栏项目接口
export interface ToolbarItem {
  icon: React.ReactNode;
  title: string;
  action: () => void;
}