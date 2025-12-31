// 文件扩展名到语言标识的映射表
export const fileExtensionToLanguage: Record<string, string> = {
  // 前端语言
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'less': 'less',

  // 后端语言
  'java': 'java',
  'py': 'python',
  'cpp': 'cpp',
  'c': 'c',
  'cs': 'csharp',
  'go': 'go',
  'rb': 'ruby',
  'php': 'php',
  'swift': 'swift',
  'kt': 'kotlin',
  'rs': 'rust',
  'scala': 'scala',

  // 数据格式
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yaml',
  'yml': 'yaml',

  // 其他
  'sh': 'bash',
  'sql': 'sql',
  'md': 'markdown'
};

// 计算字数
export const calculateWordCount = (text: string): number => {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
};

// 计算字符数
export const calculateCharCount = (text: string): number => {
  return text.length;
};

// 从文件扩展名获取语言标识
export const getLanguageFromExtension = (extension: string): string | undefined => {
  return fileExtensionToLanguage[extension.toLowerCase()];
};
