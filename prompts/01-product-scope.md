---
id: scope
title: Product Scope 提示词
role: Product Manager
stage: scope
order: 1
whenToUse: 需求澄清完成后，需要将范围写成文档
inputs:
  - Product Manager 输出
  - 需求澄清结果
outputs:
  - PRODUCT_SCOPE.md
forbidden:
  - 不要写代码
  - 不要设计 UI
  - 不要在范围文档中加入实现细节
acceptanceCriteria:
  - MVP 功能边界清晰
  - 非 MVP 功能明确排除
  - 第一版成功标准可衡量
next:
  - user-flow
related:
  - product-manager
  - ux-designer
---

# Prompt: Product Scope

## 用途

将需求澄清结果整理成正式的产品范围文档，作为后续所有设计的依据。

## 适用阶段

产品范围定义

## 输入

- Product Manager 阶段的输出
- 用户最终确认的需求

## 输出

AI 应该输出 PRODUCT_SCOPE.md，包含：
1. 产品定位
2. 目标用户
3. MVP 功能范围
4. 非 MVP 功能
5. 第一版成功标准
6. 禁止 AI 在开发时擅自扩展的功能

## 禁止事项

- 不要写代码
- 不要设计 UI
- 不要加入实现细节

## 提示词正文

```txt
你是产品经理。

请根据需求澄清结果，整理 PRODUCT_SCOPE.md。

要求：
1. 明确产品定位
2. 明确目标用户
3. 明确 MVP 功能范围
4. 明确非 MVP 功能
5. 明确第一版成功标准
6. 明确禁止 AI 在开发时擅自扩展的功能

注意：
你不要写代码。
你不要设计 UI。
只输出产品范围文档。
```

## 后续阶段

完成范围文档后，使用 [User Flow Prompt](/prompts/user-flow) 设计用户流程。
