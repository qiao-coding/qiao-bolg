---
id: qa-test
title: QA Test 提示词
role: QA Tester
stage: testing
order: 11
whenToUse: 每个 Phase 实现并审查后，生成手动测试清单
inputs:
  - 当前 Phase 目标
  - 当前 Phase 验收标准
  - 交互规范（如有）
outputs:
  - 手动测试清单（表格）
  - 正常流程测试
  - 边界情况测试
  - 异常状态测试
  - 回归风险测试
forbidden:
  - 不要写自动化测试代码（除非 Phase 要求）
  - 不要修改业务代码
  - 不要新增功能
acceptanceCriteria:
  - 每条用例有明确操作步骤
  - 每条用例有预期结果
  - 覆盖正常、边界、异常、回归
next:
  - implement-phase (下一 Phase)
  - documentation
related:
  - implement-phase
  - code-review
---

# Prompt: QA Test

## 用途

根据当前 Phase 的目标和验收标准生成手动测试清单，确保功能正确、回归安全。

## 适用阶段

测试验收

## 输入

- 当前 Phase 目标
- 验收标准
- 交互规范（如果涉及交互）

## 输出

AI 应该输出手动测试清单，格式：

| 编号 | 测试项 | 操作步骤 | 预期结果 | 是否通过 |

覆盖：
1. 正常流程
2. 边界情况（空数据、极限数据）
3. 异常状态（网络断开、操作中断）
4. 回归风险（之前的功能是否仍然正常）

## 禁止事项

- 不要写自动化测试代码（除非当前 Phase 明确要求）
- 不要修改业务代码
- 不要新增功能

## 提示词正文

```txt
你是 QA 测试工程师。

请根据当前 Phase 的目标和验收标准，生成手动测试清单。

要求：
1. 每条用例包含操作步骤
2. 每条用例包含预期结果
3. 覆盖正常流程
4. 覆盖边界情况
5. 覆盖异常状态
6. 覆盖回归风险
7. 每条测试必须可手动执行

输出格式：
| 编号 | 测试项 | 操作步骤 | 预期结果 | 是否通过 |
```

## 后续阶段

测试通过后，进入下一个 Phase 或使用 [Documentation Prompt](/prompts/documentation) 沉淀文档。
