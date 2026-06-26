---
id: architecture
title: Architecture 提示词
role: Frontend Architect
stage: planning
order: 6
whenToUse: 技术选型确定后，设计前端模块架构
inputs:
  - PRODUCT_SCOPE.md
  - INTERACTION_SPEC.md
  - TECH_DECISION.md
outputs:
  - ARCHITECTURE.md
  - 目录结构
  - 核心组件职责
  - 状态流
  - 模块边界
  - 第三方库 Adapter 设计
forbidden:
  - 不要写具体 UI 代码
  - 不要实现业务逻辑
  - 不要把架构设计和实现混在一起
acceptanceCriteria:
  - 组件边界不重叠
  - 状态流单向清晰
  - Adapter 隔离第三方库
  - 扩展点被标记
next:
  - data-model
related:
  - tech-decision
  - data-model
---

# Prompt: Architecture

## 用途

设计前端模块架构，定义目录结构、组件边界、状态流、第三方库隔离层。

## 适用阶段

架构设计

## 输入

- PRODUCT_SCOPE.md
- INTERACTION_SPEC.md
- TECH_DECISION.md

## 输出

AI 应该输出 ARCHITECTURE.md，包含：
1. 目录结构
2. 核心组件职责
3. 状态流（单向数据流图）
4. 模块边界（组件不能跨越的边界）
5. 第三方库 Adapter 设计
6. 禁止跨层调用的规则
7. 后续扩展点

## 禁止事项

- 不要写具体 UI 代码
- 不要实现业务逻辑
- 不要把架构和实现混在一个文档

## 提示词正文

```txt
你是前端架构师。

请根据 PRODUCT_SCOPE.md、INTERACTION_SPEC.md、TECH_DECISION.md 设计前端模块架构。

要求：
1. 输出目录结构
2. 输出核心组件职责
3. 输出状态流
4. 输出模块边界
5. 输出第三方库 adapter 设计
6. 输出禁止跨层调用的规则
7. 输出后续扩展点

注意：
不要写具体 UI 代码。
先输出 ARCHITECTURE.md。
```

## 后续阶段

完成架构设计后，使用 [Data Model Prompt](/prompts/data-model) 设计数据模型。
