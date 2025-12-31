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
}
