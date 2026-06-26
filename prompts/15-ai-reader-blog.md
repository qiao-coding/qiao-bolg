---
id: ai-reader-blog
title: AI Reader Blog 提示词
role: Next.js Architect
stage: planning
order: 15
whenToUse: 构建 Prompt Library + AI Reader 博客时
inputs:
  - 提示词内容
  - 博客产品定位
outputs:
  - 路由结构设计
  - content 目录结构
  - PromptDoc 数据模型
  - /ai 页面设计
  - /llms.txt 生成规则
forbidden:
  - 不要把提示词塞进一篇长文
  - 不要让 AI 页面和人类页面混用同一布局
  - 不要忘记 llms.txt 和 sitemap.xml
acceptanceCriteria:
  - 每个提示词独立成页
  - /ai 路由给 AI 扫描
  - JSON 路由给程序读
  - 所有提示词有 previous/next/related 关系
next:
  - implement-phase
related:
  - architecture
  - data-model
---

# Prompt: AI Reader Blog

## 用途

设计一个 Prompt Library + AI Reader 博客系统，同时服务人类读者和 AI Agent。

## 适用阶段

博客架构设计

## 输入

- 提示词内容（Markdown 文件）
- 博客产品定位

## 输出

AI 应该输出：
1. 推荐路由结构
2. content 目录结构
3. PromptDoc 数据模型
4. /ai 页面设计
5. /ai/index.json 数据结构
6. /ai/prompts.json 数据结构
7. /llms.txt 生成规则
8. sitemap.xml 生成规则
9. 第一阶段开发任务拆分

## 禁止事项

- 不要把提示词塞进一篇长文里
- 不要让 AI 页面和人类页面混用同一布局
- 不要忘记 /llms.txt 和 sitemap.xml

## 提示词正文

```txt
你是 Next.js 架构师。

我要做一个提示词博客，核心目标是：
1. 人类可以阅读软件开发工作流和提示词
2. AI 可以通过专属 AI 阅读界面扫描、理解、引用这些提示词
3. 每个提示词都有普通页面、Markdown 风格页面和 JSON 页面
4. 提供 /llms.txt、/ai/index.json、/ai/prompts.json

技术栈：
Next.js App Router + MDX + TypeScript。

请先不要写代码。
请先输出：
1. 推荐路由结构
2. content 目录结构
3. PromptDoc 数据模型
4. /ai 页面设计
5. /ai/index.json 数据结构
6. /ai/prompts.json 数据结构
7. /llms.txt 生成规则
8. sitemap.xml 生成规则
9. 第一阶段开发任务拆分

要求：
- 普通页面给人看
- /ai 路由给 AI 看
- JSON 路由给 Agent / 程序读
- Markdown 风格页面给 LLM 直接读
- 所有提示词都要有 previous / next / related 关系
```
