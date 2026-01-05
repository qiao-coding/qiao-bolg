
// 文件扩展名到语言标识的映射表
export const fileExtensionToLanguage: Record<string, string> = {
  // 语言
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'less': 'less',
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

// 从文件扩展名获取语言头
export const getLanguageFromExtension = (extension: string): string | undefined => {
  return fileExtensionToLanguage[extension.toLowerCase()];
};


// Markdown代码高亮样式切换
function createMarkdownStyle() {

    function getMarkdownStyle({theme}:{theme:string}) {



        function loadCSS(href:string) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
        }

        if (theme === 'dark') {
            loadCSS('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.css');
        } else {
            loadCSS('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.css');
        }
    }

    return{
        getMarkdownStyle
    }
}

export const MarkdownStyle = createMarkdownStyle()