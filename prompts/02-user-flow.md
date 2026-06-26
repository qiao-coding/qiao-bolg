---
id: user-flow
title: User Flow 提示词
role: UX Designer
stage: design
order: 2
whenToUse: 产品范围确定后，设计用户操作流程
inputs:
  - PRODUCT_SCOPE.md
outputs:
  - USER_FLOW.md
  - 主流程图
  - 异常流程
  - 快捷操作列表
forbidden:
  - 不要写代码
  - 不要涉及技术实现
  - 不要设计具体 UI 布局
acceptanceCriteria:
  - 主流程覆盖核心任务
  - 异常流程被识别
  - 每一步有明确的用户操作和系统反馈
next:
  - ui-layout
related:
  - product-manager
  - scope
---

# Prompt: User Flow

## 用途

设计用户的核心操作流程，描述用户在每个步骤看到什么、点击什么、系统如何响应。

## 适用阶段

用户体验设计

## 输入

- PRODUCT_SCOPE.md

## 输出

AI 应该输出 USER_FLOW.md，包含：
1. 主流程（正常操作路径）
2. 异常流程（错误处理路径）
3. 快捷操作（高级用户路径）
4. 每一步：用户看到什么 → 点击什么 → 系统反馈什么

## 禁止事项

- 不要写代码
- 不要涉及技术实现细节
- 不要设计具体 UI 布局

## 提示词正文

```txt
你是 UX 设计师。

请根据 PRODUCT_SCOPE.md 设计用户流程。

要求：
1. 输出主流程
2. 输出异常流程
3. 输出快捷操作
4. 输出每一步用户看到什么、点击什么、系统反馈什么
5. 不要写代码
6. 不要涉及技术实现

输出 USER_FLOW.md。
```

## 后续阶段

完成用户流程后，使用 [UI Layout Prompt](/prompts/ui-layout) 设计页面布局。
