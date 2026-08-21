# 小小乔の小站 设计系统 - 日系轻博客

本文档定义博客前台的视觉语言。后台 admin 同样采用本设计语言（玻璃卡片、品牌渐变、顶部导航），与前台视觉统一，不再使用独立的工作型样式。

## 1. 设计原则

1. **阅读优先**：页面先服务文章、笔记和导航，不用装饰抢内容注意力。
2. **纸感与留白**：背景接近纸张，卡片轻边框、低阴影，避免厚重磨砂玻璃。
3. **低饱和点缀**：蓝绿作为主强调色，樱粉只做少量辅助。
4. **安静动效**：只保留必要的颜色/边框过渡，不使用大位移、旋转、持续跳动。

## 2. 色彩系统

品牌 token 仍沿用 `--brand-*` 命名，方便兼容现有组件，但语义改为日系轻博客：

| 令牌 | 用途 |
|---|---|
| `--brand-blue` / `--brand-blue-deep` | 主强调色：链接、激活态、标题细线 |
| `--brand-blue-soft` | 信息块、标签、轻 hover 底色 |
| `--brand-pink` / `--brand-pink-deep` | 少量情绪点缀，不做大面积背景 |
| `--brand-pink-soft` | 次级标签或轻提示底色 |
| `--brand-paper` | 页面纸感背景收尾色 |
| `--brand-grad` | 仅兼容旧类名，新增页面尽量不用渐变 |

新增样式优先使用语义 token：`bg-background`、`bg-card`、`text-foreground`、`text-muted-foreground`、`border-border`。

## 3. 背景与布局

- 前台页面统一用 `TechBackgroundNoGrid`。
- 背景为纸感渐变 + 极淡网格纹理，不再使用固定照片大背景。
- 页面主体建议：`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16`。
- 卡片建议：`rounded-lg border border-border/70 bg-card/85 shadow-sm`。

## 4. 组件规范

| 组件 | 规范 |
|---|---|
| Header | 固定顶部栏，背景 `bg-background/80~92`，底边框，激活项用细线 |
| 主按钮 | `bg-foreground text-background rounded-md` |
| 次按钮 | `border border-border bg-card/80 rounded-md` |
| 卡片 | 轻边框、低阴影，hover 只改边框或底色 |
| 标签 | `rounded-md bg-brand-blue-soft/70 text-brand-blue-deep border-brand-blue/20` |
| 标题 | 字重适中，标题下方使用短细线，不使用大渐变文字 |
| 错误/空状态 | 卡片化展示，使用语义色或 muted 文案 |

## 5. 动效规则

- 允许：`transition-colors`、轻微 `scale-[1.03]` 图片 hover。
- 避免：旋转、持续弹跳、大幅 `translateY` 入场、卡片整体放大。
- 列表和详情页优先稳定渲染，不做随机延迟动画。

## 6. Do Not

- 不新增大面积蓝粉渐变、渐变文字、渐变 hero。
- 不新增嵌套卡片或强玻璃拟态。
- 不在公共前台页面使用大圆角胶囊导航。
- admin 后台与前台共用同一套设计词汇（玻璃卡片、品牌渐变、顶部导航），不做回退到工作型样式的改动。
