---
id: interaction-spec
title: Interaction Spec 提示词
role: Interaction Designer
stage: design
order: 4
whenToUse: 页面布局确定后，定义所有交互行为和状态
inputs:
  - PRODUCT_SCOPE.md
  - USER_FLOW.md
  - UI_LAYOUT_SPEC.md
outputs:
  - INTERACTION_SPEC.md
  - 点击行为定义
  - 拖拽行为定义
  - 快捷键列表
  - 状态定义（空/选中/编辑/错误）
forbidden:
  - 不要写代码
  - 不要涉及具体技术实现
  - 不要设计新布局
acceptanceCriteria:
  - 所有交互行为有明确定义
  - 所有状态有对应 UI 表现
  - 快捷键不与系统/浏览器冲突
next:
  - tech-decision
related:
  - ui-layout
  - architecture
---

# Prompt: Interaction Spec

## 用途

定义所有用户交互行为的详细规范，包括点击、拖拽、快捷键、状态变化。

## 适用阶段

交互设计

## 输入

- PRODUCT_SCOPE.md
- USER_FLOW.md
- UI_LAYOUT_SPEC.md

## 输出

AI 应该输出 INTERACTION_SPEC.md，包含：
1. 点击行为（单击、双击、右键）
2. 选中态（单选、多选、取消选中）
3. 编辑行为（进入编辑、退出编辑、保存）
4. 快捷键（不与系统冲突）
5. 拖拽行为（开始、移动、结束）
6. 空状态
7. 错误状态
8. 高级设置展开/折叠规则

## 禁止事项

- 不要写代码
- 不要涉及具体技术实现
- 不要定义数据格式

## 提示词正文

```txt
你是交互设计师。

请根据 PRODUCT_SCOPE.md、USER_FLOW.md、UI_LAYOUT_SPEC.md 输出 INTERACTION_SPEC.md。

要求：
1. 定义点击行为
2. 定义选中态
3. 定义编辑行为
4. 定义快捷键
5. 定义拖拽行为
6. 定义空状态
7. 定义错误状态
8. 定义高级设置展开规则

注意：
你不要写代码。
你不要涉及具体技术实现。
```

## 后续阶段

完成交互设计后，使用 [Tech Decision Prompt](/prompts/tech-decision) 做技术选型。
