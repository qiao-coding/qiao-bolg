# Hanwhite A1 Blog

Hanwhite A1 Blog 是一个基于 Next.js App Router 构建的全栈个人博客和内容管理系统。它旨在提供一个流畅的用户体验，用于创建、编辑和管理内容。应用使用 Prisma 和 PostgreSQL 作为数据层，并通过 NextAuth 进行了身份验证的集成。

## 功能

- 笔记系统，支持分类和页面
- 搜索功能，涵盖标题、标签和页面内容
- 管理面板，用于创建、编辑和删除内容
- 通过 NextAuth 集成了 GitHub 登录
- 友链管理系统，支持添加、编辑和删除友链
- 说说/动态功能，用于发布简短内容
- 管理员用户管理系统，支持多管理员账户
- 个人资料和博客设置管理
- 响应式设计，支持深色模式

## 所需技术


| 技术/库 | 版本/说明 |
|---------|-----------|
| Next.js | 15.5.7 (App Router) |
| React | 19.2.1 |
| TypeScript | 5.x |
| Prisma ORM | 6.16.3 |
| PostgreSQL | — |
| NextAuth.js | 5.0.0-beta.30 |
| Tailwind CSS | 4.1.18 |
| Radix UI | — |
| Shadcn/ui | — |
| Framer Motion | 12.23.24 |
| Lucide React | 0.544.0 |
| Ant Design | 6.0.0 |
| Recharts | 2.15.4 |

## 要求

- Node.js 22.17.0 或更高版本
- PostgreSQL 数据库

## 环境变量

项目需要以下环境变量，创建 `.env.local` 文件并配置：

```
# 数据库连接（必需）
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth 配置（必需）
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth 配置（必需）
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

```

**生成 NEXTAUTH_SECRET：**
```bash
npx auth secret
```
将生成的密钥复制到 `.env.local` 文件中。

## GitHub OAuth 和 NextAuth 配置

### GitHub OAuth 应用设置

1. 登录 GitHub 账户，进入 Settings > Developer settings > OAuth Apps
2. 点击 "New OAuth App" 创建新应用
3. 填写应用信息(以本地开发环境 http://localhost:3000 为例)：
   - Application name: `Hanwhite A1 Blog`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. 创建后获取 Client ID 和 Client Secret

## 安装与配置

### 1. 环境准备

确保您的系统已安装：
- Node.js 22.17.0 或更高版本
- PostgreSQL 数据库

### 2. 克隆项目

```bash
git clone <repository-url>
cd hanwhite_a1-blog
```

### 3. 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 4. 环境变量配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# 数据库连接（必需）
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# NextAuth 配置（必需）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth 配置（必需）
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# 管理员账户配置（可选）
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-admin-password"
```

### 5. 数据库设置

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# （可选）填充初始数据
npx prisma db seed
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 生产环境部署

1. 构建：`npm run build`
2. 启动：`npm run start`

## 脚本

- `npm run dev`：使用 Turbopack 启动 Next.js 开发模式
- `npm run build`：构建应用程序
- `npm run start`：在端口 3007 上启动生产服务器
- `npm run lint`：运行 ESLint

## 项目结构

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

## 系统架构图
```mermaid
graph TD
    A[Hanwhite A1 Blog 系统架构] --> B[前端层]
    A --> C[API层]
    A --> D[数据层]
    A --> E[认证服务层]
    
    B --> B1[页面组件 Pages]
    B --> B2[功能组件 Features]
    B --> B3[UI组件 Components]
    B --> B4[布局组件 Layout]
    B --> B5[自定义Hooks]
    
    C --> C1[Next.js API路由]
    C --> C2[RESTful接口]
    C --> C3[中间件Middleware]
    
    D --> D1[Prisma ORM]
    D --> D2[PostgreSQL数据库]
    D --> D3[数据模型Schema]
    
    E --> E1[NextAuth认证]
    E --> E2[GitHub OAuth]
    E --> E3[权限验证]
    
    B1 --> F[笔记页面]
    B1 --> G[管理面板]
    B1 --> H[友链页面]
    B1 --> I[说说页面]
    
    B2 --> J[笔记功能组件]
    B2 --> K[搜索功能组件]
    B2 --> L[用户管理组件]
    
    B5 --> M[useNote Hook]
    B5 --> N[api_admin Hook]
    B5 --> O[api_friend Hook]
    
    C1 --> P[笔记API]
    C1 --> Q[用户API]
    C1 --> R[友链API]
    
    D1 --> S[Note模型]
    D1 --> T[AdminUser模型]
    D1 --> U[Friend模型]
    D1 --> V[Miscellaneous模型]
    
    style A fill:#4e7aa7,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#28a745,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#17a2b8,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#6f42c1,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#e83e8c,stroke:#333,stroke-width:2px,color:#fff
```

## 架构说明

### 前端模块
前端模块是整个博客系统的核心展示层，采用Next.js App Router架构，提供流畅的用户体验。

**核心功能**:
- 页面渲染：负责所有页面的展示，包括首页、笔记页面、管理面板等
- 组件化UI：使用React组件构建可复用的UI元素
- 响应式设计：适配不同设备尺寸，提供一致的用户体验
- 状态管理：通过自定义Hooks管理应用状态

**技术实现**:
- 使用Next.js App Router进行页面路由管理
- 采用TypeScript进行类型安全开发
- 使用Tailwind CSS进行样式设计
- 通过Framer Motion实现动画效果

### API服务模块
API服务模块负责处理所有后端请求，为前端提供数据接口。

**核心功能**:
- 笔记管理：提供笔记的增删改查接口
- 用户认证：处理用户登录、权限验证等
- 友链管理：友链的添加、编辑、删除操作
- 说说功能：发布和管理动态内容
- 搜索功能：全文搜索笔记内容

**技术实现**:
- 使用Next.js API路由处理HTTP请求
- 通过Prisma ORM操作数据库
- 实现RESTful API设计规范
- 集成NextAuth进行身份验证

### 数据层模块
数据层模块负责数据的存储和管理，使用Prisma ORM作为数据库访问层。

**核心功能**:
- 数据模型：定义Note、AdminUser、User等数据结构
- 数据持久化：确保数据的可靠存储
- 关系管理：处理不同数据模型之间的关联关系
- 迁移管理：支持数据库结构的版本控制

**技术实现**:
- 使用PostgreSQL作为主数据库
- 通过Prisma Schema定义数据模型
- 支持数据库迁移和种子数据填充
- 实现数据验证和约束

### 认证服务模块
认证服务模块负责用户身份验证和权限管理。

**核心功能**:
- GitHub登录：集成GitHub OAuth认证
- 会话管理：维护用户登录状态
- 权限控制：限制对敏感功能的访问
- 管理员验证：验证管理员身份

**技术实现**:
- 使用NextAuth.js实现认证功能
- 配置多种认证提供者
- 实现JWT令牌管理
- 提供中间件进行权限验证

## 贡献指南

我们欢迎社区贡献！如果您想为本项目做出贡献，请遵循以下指南：

### 1. 开发流程

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 2. 代码规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 代码规范
- 保持代码结构清晰，组件模块化
- 为新功能添加适当的类型定义

### 3. 提交信息规范

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 4. 开发设置

在开始开发前，请确保：

1. 安装 Node.js 22.17.0 或更高版本
2. 安装 PostgreSQL 数据库
3. 配置环境变量
4. 运行 `npm install` 安装依赖
5. 运行 `npm run dev` 启动开发服务器

### 5. 测试

在提交代码前，请确保：

- 运行 `npm run lint` 检查代码规范
- 运行 `npm run build` 确保构建成功
- 测试新功能是否正常工作

