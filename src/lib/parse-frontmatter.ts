/**
 * 解析 Markdown 文件的 YAML-like frontmatter
 * 不依赖第三方库，纯正则解析
 */

export interface PromptMeta {
  id: string;
  title: string;
  role: string;
  stage: string;
  order: number;
  whenToUse?: string;
  inputs?: string[];
  outputs?: string[];
  forbidden?: string[];
  acceptanceCriteria?: string[];
  next?: string[];
  related?: string[];
  [key: string]: unknown;
}

export function parseFrontmatter(content: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const frontmatterStr = match[1];
  const body = match[2];

  const data: Record<string, unknown> = {};
  let currentKey = '';

  for (const line of frontmatterStr.split('\n')) {
    // 匹配 key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '') {
        // 空值 → 可能是数组的开始
        data[currentKey] = [];
      } else if (/^\d+$/.test(value)) {
        data[currentKey] = parseInt(value, 10);
      } else {
        data[currentKey] = value;
      }
    } else {
      // 匹配数组项 - item
      const arrMatch = line.match(/^\s+-\s+(.*)/);
      if (arrMatch && currentKey) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        (data[currentKey] as string[]).push(arrMatch[1]);
      }
    }
  }

  return { data, body };
}

/**
 * 从 NotesPage content 中提取 PromptMeta
 */
export function getPromptMeta(content: string): PromptMeta | null {
  const { data } = parseFrontmatter(content);
  if (!data.id || !data.title) return null;
  return data as unknown as PromptMeta;
}
