---
id: task-plan
title: Task Plan 提示词
role: Project Manager / Tech Lead
stage: planning
order: 8
whenToUse: 架构和数据模型确定后，将开发任务拆分为多个 Phase
inputs:
  - PRODUCT_SCOPE.md
  - INTERACTION_SPEC.md
  - ARCHITECTURE.md
outputs:
  - TASK_PLAN.md
  - Phase 列表
  - 每个 Phase 的目标/允许文件/禁止事项/验收标准
forbidden:
  - 不要把布局、数据结构、拖拽、导出混在同一个 Phase
  - 不要让 AI 同时改多个不相关模块
acceptanceCriteria:
  - 每个 Phase 只做一类事情
  - Phase 之间有明确的依赖关系
  - 验收标准可手动测试
next:
  - implement-phase
related:
  - architecture
  - implement-phase
---

# Prompt: Task Plan

## 用途

把大功能拆成多个独立 Phase，每个 Phase 只做一类事情，有明确的边界和验收标准。

## 适用阶段

任务拆分

## 输入

- PRODUCT_SCOPE.md
- INTERACTION_SPEC.md
- ARCHITECTURE.md

## 输出

AI 应该输出 TASK_PLAN.md，包含：
1. Phase 列表（按依赖排序）
2. 每个 Phase 的目标
3. 每个 Phase 允许修改的文件
4. 每个 Phase 禁止修改的内容
5. 每个 Phase 的验收标准
6. Phase 之间的依赖关系

## 禁止事项

- 不要把布局、数据结构、拖拽、导出混在同一个 Phase
- 不要让 AI 同时改多个不相关模块
- 每个 Phase 必须有明确边界

## 提示词正文

```txt
你是项目经理 / 技术负责人。

请根据 PRODUCT_SCOPE.md、INTERACTION_SPEC.md、ARCHITECTURE.md，把开发任务拆成多个 Phase。

要求：
1. 每个 Phase 只做一类事情
2. 每个 Phase 有明确目标
3. 每个 Phase 有允许修改文件
4. 每个 Phase 有禁止修改内容
5. 每个 Phase 有验收标准
6. 不允许把布局、数据结构、拖拽、导出混在同一个 Phase

输出 TASK_PLAN.md。
```

## 后续阶段

任务拆分完成后，使用 [Implement Phase Prompt](/prompts/implement-phase) 逐个实现。
