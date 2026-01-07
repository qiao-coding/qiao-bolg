# Hanwhite A1 Blog

Hanwhite  Blog 是一个基于 Next.js 15 App Router 构建的个人博客和内容管理系统。项目采用现代化的技术栈，提供完整的博客管理、内容创作和用户交互功能。

## 项目特色

### 核心功能
- **多模块内容管理**：笔记系统、博客文章、说说动态、友链管理
- **智能AI助手**：集成AI聊天功能，支持实时对话和历史记录
- **响应式设计**：完美适配桌面端和移动端，支持深色/浅色主题切换
- **权限管理**：基于角色的访问控制，支持多管理员账户
- **搜索系统**：全文搜索支持标题、标签和内容检索
- **Markdown编辑器**：强大的富文本编辑体验，支持代码高亮

### 技术亮点
- **Next.js 15**：使用最新的App Router架构，支持服务端渲染和静态生成
- **TypeScript**：完整的类型安全，提升开发效率和代码质量
- **Prisma ORM**：类型安全的数据库操作，支持PostgreSQL
- **NextAuth.js**：完整的身份验证解决方案，支持GitHub OAuth
- **Tailwind CSS 4**：现代化的CSS框架，支持JIT编译
- **Redux Toolkit**：状态管理，支持持久化和中间件
- **AI集成**：支持DeepSeek等AI模型，提供智能对话功能

## 示例效果图
### 主页
#### 亮色
![](/public/readme_img/home_light.png)

#### 暗色
![](/public/readme_img/home_dark.png)

### 后台管理面板
#### 亮色
![](/public/readme_img/admin_light.png)

#### 暗色
![](/public/readme_img/admin_dark.png)


## 博客架构


### 基本架构：
```
src/
├── app/                    # App Router 页面
│   ├── admin/             # 管理后台
│   ├── api/               # API路由
│   ├── notes/             # 笔记系统
│   └── ...
├── components/            # 组件库
│   ├── features/          # 功能组件
│   ├── layout/            # 布局组件
│   └── ui/                # UI基础组件
├── hooks/                 # 自定义Hooks
├── lib/                   # 工具库
└── types/                 # TypeScript类型定义
```
### 完整架构：
```
├── auth.ts                 # NextAuth 配置文件
├── middleware.ts           # 中间件配置
├── next.config.ts          # Next.js 配置文件
├── package.json            # 项目依赖和脚本配置
├── components.json         # 组件库配置
├── eslint.config.mjs       # ESLint 配置
├── postcss.config.mjs      # PostCSS 配置
├── prisma/
│   └── schema.prisma       # Prisma 数据库模式定义
├── public/                 # 静态资源目录
│   ├── bg.webp             # 背景图片
│   ├── header_img/         # 头部导航图标
│   ├── login_img/          # 登录页面图片
│   ├── note_img/           # 笔记相关图片
│   └── user_img/           # 用户相关图片
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   ├── Login/          # 登录页面
│   │   ├── about/          # 关于页面
│   │   ├── admin/          # 管理员面板页面
│   │   ├── adminLogin/     # 管理员登录页面
│   │   ├── api/            # API 路由
│   │   ├── friend/         # 友链页面
│   │   ├── miscellaneous/  # 说说/动态页面
│   │   ├── notes/          # 笔记页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── features/       # 功能组件
│   │   ├── layout/         # 布局组件
│   │   └── ui/             # UI 组件
│   ├── hooks/              # 自定义 React Hooks
│   │   ├── about/          # 关于页面相关 hooks
│   │   ├── admin/          # 管理员相关 hooks
│   │   ├── adminUser/      # 管理员用户相关 hooks
│   │   ├── auth/           # 认证相关 hooks
│   │   ├── blog/           # 博客相关 hooks
│   │   ├── friend/         # 友链相关 hooks
│   │   ├── miscellaneous/  # 说说相关 hooks
│   │   ├── note/           # 笔记相关 hooks
│   │   └── api_blogData.ts  # 博客数据 hooks
│   ├── lib/                # 工具库和辅助函数
│   │   ├── prisma.ts       # Prisma 客户端配置
│   │   ├── store/          # 状态管理
│   │   └── utils/          # 通用工具函数
│   └── types/              # TypeScript 类型定义
│       ├── about/          # 关于页面类型定义
│       ├── blog/           # 博客相关类型定义
│       ├── components/     # 组件类型定义
│       ├── friend/         # 友链相关类型定义
│       ├── miscellaneous/  # 说说相关类型定义
│       ├── note/           # 笔记相关类型定义
│       └── user/           # 用户相关类型定义
└── tsconfig.json           # TypeScript 配置文件
```

### 数据库模型
项目使用Prisma定义的数据模型：
- **Note & NotesPage**：笔记和页面管理系统
- **Miscellaneous**：说说/动态功能
- **Friend**：友链管理系统
- **AdminUser**：管理员用户管理
- **AboutPage**：关于页面内容管理

## 技术选型

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.5.7 | React框架 |
| React | 19.2.1 | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Prisma | 6.16.3 | ORM工具 |
| PostgreSQL | - | 数据库 |

### UI组件库
| 组件库 | 用途 |
|--------|------|
| Shadcn/ui | 页面布局UI组件 |
| Ant Design | 功能级UI组件|
| Radix UI | 无障碍组件 |
| Tailwind CSS | 原子化CSS框架 |

### 功能模块
| 模块 | 技术 | 功能 |
|------|------|------|
| 身份验证 | NextAuth.js | GitHub OAuth登录 |
| 状态管理 | Redux Toolkit | 全局状态管理 |
| 富文本编辑 | React Markdown | Markdown编辑器 |
| 图表展示 | Recharts | 图表 |
| 动画效果 | Framer Motion | 动画库 |

##  安装部署

### 环境要求
- Node.js 22.17.0+
- PostgreSQL 12+
- npm 或 pnpm

### 快速开始

1. **克隆项目**
```bash
git clone <repository-url>
cd hanwhite_a1-blog
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env.local` 文件：
```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/hanwhite_blog"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# AI配置（可选）
OPENAI_API_KEY="your-openai-api-key"
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

4. **数据库初始化**
```bash
# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 填充初始数据
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
```
访问 http://localhost:3000

### 生产部署

1. **构建应用**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm run start
```

## 开发指南

### 项目结构说明

#### 核心目录
- `src/app/`：Next.js App Router页面和API路由
- `src/components/`：可复用React组件
- `src/hooks/`：自定义React Hooks
- `src/lib/`：工具函数和配置
- `src/types/`：TypeScript类型定义

#### API设计
项目采用RESTful API设计，所有API端点位于 `src/app/api/`：
- 认证相关：`/api/auth/*`
- 内容管理：`/api/notes/*`, `/api/blog/*`
- 友链管理：`/api/friend/*`

### 自定义开发

#### 添加新功能模块
1. 在 `src/app/api/` 创建API路由
2. 在 `src/types/` 定义相关类型
3. 在 `src/components/features/` 创建UI组件
4. 在 `src/hooks/` 创建业务逻辑Hooks


## 功能模块详解

### 1. 笔记系统
- 支持多级分类和页面管理
- Markdown编辑器，支持代码高亮
- 标签系统和搜索功能
- 响应式页面布局

### 2. 博客管理
- 文章发布和编辑
- 分类和标签管理
- 评论系统（待开发）
- SEO优化支持

### 3. AI助手功能
- 实时对话界面
- 对话历史记录
- 支持多种AI模型
- 流式响应处理

### 4. 管理后台
- 仪表盘数据展示
- 内容管理界面
- 用户权限管理
- 系统设置配置

### 5. 用户系统
- GitHub OAuth登录
- 角色权限管理
- 个人资料设置
- 安全会话管理

##  安全特性

- **身份验证**：基于NextAuth.js的安全认证
- **权限控制**：基于角色的访问控制(RBAC)
- **输入验证**：前后端双重数据验证
- **SQL注入防护**：Prisma ORM自动防护
- **XSS防护**：React自动转义和内容安全策略

##  性能优化

### 前端优化
- **代码分割**：Next.js自动代码分割
- **图片优化**：Next.js Image组件自动优化
- **缓存策略**：合理的缓存配置
- **懒加载**：组件和图片懒加载

### 后端优化
- **数据库索引**：合理的索引设计
- **API缓存**：适当的缓存策略
- **连接池**：数据库连接池优化
- **压缩传输**：Gzip压缩支持

## 监控和日志

### 开发调试
- ESLint代码检查
- TypeScript类型检查
- 控制台错误日志
- 网络请求监控


## 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建Pull Request

### 代码规范
- 使用TypeScript，避免any类型
- 遵循ESLint规则
- 编写清晰的注释
- 保持组件单一职责



## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues：提交问题和功能请求
- 邮箱：2820387220@qq.com
- GitHub Discussions：参与技术讨论

---