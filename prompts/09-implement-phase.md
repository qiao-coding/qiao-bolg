---
id: implement-phase
title: Implement Phase 提示词
role: Implementer
stage: implementation
order: 9
whenToUse: 每个 Phase 开始实现时，控制 AI 只实现当前 Phase
inputs:
  - PRODUCT_SCOPE.md
  - TASK_PLAN.md
  - 当前 Phase 描述
  - 允许修改文件列表
outputs:
  - 代码修改
  - 修改文件列表
  - 验证方式
forbidden:
  - 不允许修改未授权文件
  - 不允许重构无关代码
  - 不允许新增需求外功能
  - 不允许跨 Phase 修改
acceptanceCriteria:
  - 只修改了允许修改的文件
  - 没有新增需求外功能
  - 现有功能未被破坏
  - 满足 Phase 验收标准
next:
  - code-review
  - qa-test
related:
  - task-plan
  - code-review
---

# Prompt: Implement Phase

## 用途

严格控制 AI 只实现当前 Phase 的内容，不越界、不扩展、不重构无关代码。

## 适用阶段

分阶段实现

## 输入

需要提供：
- 当前 Phase 名称
- 背景文档（PRODUCT_SCOPE.md / TASK_PLAN.md 等）
- 本阶段目标
- 允许修改的文件列表
- 禁止修改的内容
- 验收标准

## 输出

AI 应该输出：
1. 修改文件列表
2. 每个文件修改内容
3. 如何手动验证
4. 风险点

## 禁止事项

- 不允许修改未授权文件
- 不允许重构无关代码
- 不允许新增需求外功能
- 不允许跨 Phase 修改

## 提示词正文

```txt
你是实现工程师。

你必须严格按照当前 Phase 实现。
不要改动未授权文件。
不要重构无关代码。
不要新增不在需求内的功能。

当前 Phase：
{phase_name}

背景文档：
{docs}

本阶段目标：
{goals}

允许修改：
{allowed_files}

禁止修改：
{forbidden_files_or_logic}

验收标准：
{acceptance_criteria}

输出：
1. 修改文件列表
2. 每个文件修改内容
3. 如何手动验证
4. 风险点
```

## 示例使用

```txt
用户：
当前 Phase：Phase 1 静态布局重构

背景文档：PRODUCT_SCOPE.md、UI_LAYOUT_SPEC.md
本阶段目标：实现顶部工具栏 + 左侧图片列表 + 中间画布 + 右侧标注列表

允许修改：
- src/features/annotation/components/AnnotationWorkspace.tsx
- src/features/annotation/components/ImageSidebar.tsx

禁止修改：
- 不要改拖拽逻辑
- 不要改数据结构
- 不要改导出功能
- 不要引入新库

验收标准：
- 页面形成四栏布局
- 画布是视觉中心
- 原有标注仍能显示
```

## 后续阶段

实现完成后，使用 [Code Review Prompt](/prompts/code-review) 审查代码。
