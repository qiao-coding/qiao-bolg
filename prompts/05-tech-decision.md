---
id: tech-decision
title: Tech Decision 提示词
role: Tech Lead
stage: planning
order: 5
whenToUse: 需求和交互确定后，选择技术方案
inputs:
  - PRODUCT_SCOPE.md
  - USER_FLOW.md
  - INTERACTION_SPEC.md
outputs:
  - TECH_DECISION.md
  - 候选方案对比
  - 推荐方案
  - 技术风险
  - Spike 验证计划
forbidden:
  - 不要直接写代码
  - 不要直接引入库
  - 未经验证不要确定方案
acceptanceCriteria:
  - 至少评估 2 个候选方案
  - 自研/用库有明确判断标准
  - 技术风险已识别
next:
  - architecture
related:
  - interaction-spec
  - architecture
---

# Prompt: Tech Decision

## 用途

根据产品需求和交互规范做技术选型，判断哪些用成熟库、哪些自研、哪些需要 Spike 验证。

## 适用阶段

技术规划

## 输入

- PRODUCT_SCOPE.md
- USER_FLOW.md
- INTERACTION_SPEC.md

## 输出

AI 应该输出 TECH_DECISION.md，包含：
1. 候选方案列表
2. 每个方案的优缺点
3. 是否应该自研的判断
4. 哪些能力必须由成熟库承担
5. 推荐方案
6. 技术风险
7. Spike 验证计划

## 禁止事项

- 不要直接写代码
- 不要直接引入库
- 先输出文档再动手

## 提示词正文

```txt
你是技术负责人。

请根据 PRODUCT_SCOPE.md、USER_FLOW.md、INTERACTION_SPEC.md 做技术选型。

要求：
1. 列出候选方案
2. 分析每个方案优缺点
3. 判断是否应该自研
4. 判断哪些能力必须由成熟库承担
5. 给出推荐方案
6. 给出技术风险
7. 给出 spike 验证计划

注意：
你不要直接写代码。
你不要直接引入库。
先输出 TECH_DECISION.md。
```

## 后续阶段

完成技术选型后，使用 [Architecture Prompt](/prompts/architecture) 设计架构。
