---
id: ui-layout
title: UI Layout 提示词
role: UX / UI Designer
stage: design
order: 3
whenToUse: 用户流程确定后，设计页面布局和信息架构
inputs:
  - PRODUCT_SCOPE.md
  - USER_FLOW.md
outputs:
  - UI_LAYOUT_SPEC.md
  - 信息架构
  - 页面布局说明
  - 低保真线框图
forbidden:
  - 不要写代码
  - 不要涉及具体技术实现
  - 不要设计交互细节（留给 interaction-spec）
acceptanceCriteria:
  - 所有区域职责清晰
  - 默认显示/隐藏规则明确
  - 工具栏内容确定
next:
  - interaction-spec
related:
  - user-flow
  - interaction-spec
---

# Prompt: UI Layout

## 用途

设计页面的信息架构和视觉布局，确定各区域职责。

## 适用阶段

UI 设计

## 输入

- PRODUCT_SCOPE.md
- USER_FLOW.md

## 输出

AI 应该输出 UI_LAYOUT_SPEC.md，包含：
1. 信息架构（页面层级结构）
2. 页面布局说明（区域划分）
3. 主要区域职责
4. 工具栏内容
5. 侧栏 / Inspector 规则
6. 低保真文字线框图
7. 哪些信息默认展示
8. 哪些信息默认隐藏

## 禁止事项

- 不要写代码
- 不要设计具体交互行为
- 不要涉及颜色、字体等视觉细节

## 提示词正文

```txt
你是 UX / UI 设计师。

请根据 PRODUCT_SCOPE.md 和 USER_FLOW.md 设计页面布局。

要求：
1. 输出信息架构
2. 输出页面布局说明
3. 输出主要区域职责
4. 输出工具栏内容
5. 输出侧栏 / Inspector 规则
6. 输出低保真文字线框图
7. 明确哪些信息默认展示
8. 明确哪些信息默认隐藏

注意：
你不要写代码。
你只负责布局设计。
```

## 后续阶段

完成布局设计后，使用 [Interaction Spec Prompt](/prompts/interaction-spec) 设计交互行为。
