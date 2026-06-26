---
id: debug
title: Debug 提示词
role: Debugger
stage: debugging
order: 12
whenToUse: 发现 bug 时，只定位和修复，不重构
inputs:
  - Bug 描述
  - 相关代码文件
  - 复现步骤
outputs:
  - 可能原因
  - 验证方法
  - 最小修改点
  - 风险评估
forbidden:
  - 不要重构代码
  - 不要新增功能
  - 不要重写组件
  - 不要修改无关文件
acceptanceCriteria:
  - Bug 根因已定位
  - 修复方案是最小改动
  - 没有引入新问题
next:
  - code-review
  - qa-test
related:
  - implement-phase
  - code-review
---

# Prompt: Debug

## 用途

当发现 bug 时，用这个提示词限制 AI 只做定位和最小修复，防止"修一个 bug 改三个模块"。

## 适用阶段

Bug 修复

## 输入

- Bug 描述（现象、期望行为）
- 复现步骤
- 相关代码文件
- 错误信息（控制台/日志）

## 输出

AI 应该输出：
1. 可能原因（按可能性排序）
2. 验证方法（如何确认根因）
3. 最小修改点
4. 风险（修复可能影响的其他功能）

## 禁止事项

- 不要重构代码
- 不要新增功能
- 不要重写组件
- 不要修改无关文件
- 优先查状态流、坐标转换、事件冲突

## 提示词正文

```txt
你是 Debugger。

你现在不要重构，不要大改。
只定位这个 bug 的原因，并给出最小修复方案。

Bug 描述：
{bug}

限制：
1. 不改架构
2. 不新增功能
3. 不重写组件
4. 不修改无关文件
5. 优先找状态流、坐标转换、事件冲突问题

输出：
1. 可能原因
2. 验证方法
3. 最小修改点
4. 风险
```

## 后续阶段

修复后使用 [Code Review Prompt](/prompts/code-review) 审查修复代码。
