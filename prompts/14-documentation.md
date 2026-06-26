---
id: documentation
title: Documentation 提示词
role: Documentation Writer
stage: documentation
order: 14
whenToUse: 功能稳定后，沉淀开发文档和 README
inputs:
  - 当前功能代码
  - ARCHITECTURE.md
  - DATA_MODEL.md
outputs:
  - README 或 docs 文档
  - 模块用途说明
  - 常见开发注意事项
  - 禁止事项列表
forbidden:
  - 不要修改代码
  - 不要新增功能
  - 不要写虚假文档
acceptanceCriteria:
  - 新成员能根据文档理解模块
  - 禁止事项明确
  - 测试步骤可执行
next: []
related:
  - architecture
  - implement-phase
---

# Prompt: Documentation

## 用途

当功能稳定后，为代码模块沉淀开发文档。

## 适用阶段

文档沉淀

## 输入

- 当前功能代码
- ARCHITECTURE.md
- DATA_MODEL.md

## 输出

AI 应该输出：
1. 模块用途说明
2. 目录结构说明
3. 数据流说明
4. 组件职责说明
5. 常见开发注意事项
6. 禁止事项
7. 如何测试
8. 后续扩展方向

## 禁止事项

- 不要修改代码
- 不要新增功能
- 不要写虚假或未实现的文档

## 提示词正文

```txt
你是技术文档工程师。

请根据当前功能和代码整理开发文档。

要求：
1. 说明模块用途
2. 说明目录结构
3. 说明数据流
4. 说明组件职责
5. 说明常见开发注意事项
6. 说明禁止事项
7. 说明如何测试
8. 说明后续扩展方向

输出 README 或对应 docs 文档。
```

## 后续阶段

文档完成后，整个开发流程闭环。
