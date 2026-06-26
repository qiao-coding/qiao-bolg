---
id: data-model
title: Data Model 提示词
role: Frontend Architect
stage: planning
order: 7
whenToUse: 架构确定后，设计业务数据结构和 Adapter
inputs:
  - PRODUCT_SCOPE.md
  - ARCHITECTURE.md
outputs:
  - DATA_MODEL.md
  - 核心业务类型
  - Adapter 转换关系
  - 数据流说明
forbidden:
  - 不要写 UI 代码
  - 不要设计 API 路由
  - 不要把业务数据和第三方库数据混在一起
acceptanceCriteria:
  - 业务类型与第三方库类型隔离
  - Adapter 转换路径清晰
  - 字段含义无歧义
next:
  - task-plan
related:
  - architecture
  - task-plan
---

# Prompt: Data Model

## 用途

设计业务数据结构，区分业务数据和第三方库数据，定义 Adapter 转换关系。

## 适用阶段

数据建模

## 输入

- PRODUCT_SCOPE.md
- ARCHITECTURE.md

## 输出

AI 应该输出 DATA_MODEL.md，包含：
1. 核心业务类型定义
2. 业务数据结构 vs 第三方库数据结构
3. Adapter 转换关系
4. 每个字段的含义
5. 哪些字段是业务坐标，哪些是 UI 状态
6. 数据流说明

## 禁止事项

- 不要写 UI 代码
- 不要设计 API 路由
- 不要把业务模型和第三方库模型混在一起

## 提示词正文

```txt
你是前端架构师。

请根据产品范围和架构方案设计数据模型。

要求：
1. 定义核心业务类型
2. 区分业务数据结构和第三方库数据结构
3. 设计 adapter 转换关系
4. 说明每个字段的含义
5. 说明哪些字段是 ratio 坐标，哪些是 UI 状态
6. 给出数据流说明

输出 DATA_MODEL.md。
```

## 后续阶段

完成数据模型后，使用 [Task Plan Prompt](/prompts/task-plan) 拆分开发任务。
