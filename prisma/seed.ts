import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


// 配置连接池参数
let databaseUrl = process.env.DATABASE_URL || '';
if (databaseUrl && !databaseUrl.includes('connection_limit') && !databaseUrl.includes('pool_timeout')) {
  // URL
  const separator = databaseUrl.includes('?') ? '&' : '?';
  databaseUrl += `${separator}connection_limit=5&pool_timeout=30&connect_timeout=30`;
}

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// 重试
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      console.log(`操作失败，${delay}ms后重试 (${i + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // 指数退避
    }
  }
  throw new Error('重试次数已达上限');
}

async function main() {
  console.log(`开始导入数据...`);

  try {
    console.log("测试数据库连接...");
    await retryOperation(async () => {
      await prisma.$connect();
      console.log("数据库连接成功");
    });

    console.log("清空现有数据...");
    await retryOperation(async () => {
      await prisma.notesPage.deleteMany();
    });
    await retryOperation(async () => {
      await prisma.note.deleteMany();
    });

    // 主笔记分类
    console.log("正在创建笔记分类...");
    const createdNotes = await prisma.note.createMany({
      data: [
        {
          id: 1,
          title: "Javascript",
          tags: ["Javascript"],
          titlePicture: "/titleImage/title-js.jpg",
        },
        {
          id: 2,
          title: "TypeScript",
          tags: ["TypeScript"],
          titlePicture: "/titleImage/title-ts.webp",
        },
        {
          id: 3,
          title: "Tailwind",
          tags: ["Tailwind"],
          titlePicture: "/titleImage/title-tailwind.webp",
        },
        {
          id: 4,
          title: "React",
          tags: ["React"],
          titlePicture: "/titleImage/title_react.webp",
        },
        {
          id: 5,
          title: "Next",
          tags: ["Next"],
          titlePicture: "/titleImage/title-next.jpg",
        },
      ],
      skipDuplicates: true,
    });
    console.log(`已创建 ${createdNotes.count} 个笔记分类`);

    //笔记页
    console.log("正在创建笔记页面...");  
    const createdPages = await prisma.notesPage.createMany({
      data: [
        // Javascript 
        {
          pageId: 1,
          uid: 1,
          title: "JS 变量声明",
          content: "JavaScript 变量声明有 var、let、const 三种方式。var 存在变量提升，作用域为函数级；let 和 const 是 ES6 新增，作用域为块级，let 声明可变变量，const 声明常量（不可重新赋值）。",
          author: "HaoWhite",
          dateStart: "2025-07-16",
          dateEnd: "2025-08-04",
          pageTags: ["js", "变量", "声明"],
          noteId: 1,
        },
        {
          pageId: 2,
          uid: 2,
          title: "JS 函数参数",
          content: "JavaScript 函数参数具有灵活性，支持默认参数、剩余参数（...），可通过 arguments 对象获取所有传入参数（箭头函数无 arguments）。参数传递方式为值传递（基本类型）或引用传递（对象类型）。",
          author: "HaoWhite",
          dateStart: "2025-07-17",
          dateEnd: "2025-08-05",
          pageTags: ["js", "函数", "参数"],
          noteId: 1,
        },
        {
          pageId: 3,
          uid: 3,
          title: "JS 异步编程",
          content: "JavaScript 是单线程语言，异步操作用于避免阻塞。早期用回调函数处理异步，但易形成回调地狱；ES6 引入 Promise，通过 then/catch 链式调用解决，使异步代码更清晰。",
          author: "HaoWhite",
          dateStart: "2025-07-18",
          dateEnd: "2025-08-06",
          pageTags: ["js", "异步", "Promise"],
          noteId: 1,
        },
        
        // TypeScript 
        {
          pageId: 4,
          uid: 1,
          title: "TS 类型注解基础",
          content: "TypeScript 通过类型注解指定变量、函数参数及返回值的类型，在编译阶段进行类型检查，减少运行时错误。类型注解使用冒号 : 后跟类型名称的语法。",
          author: "HaoWhite",
          dateStart: "2025-07-21",
          dateEnd: "2025-08-09",
          pageTags: ["ts", "类型注解", "基础"],
          noteId: 2,
        },
        {
          pageId: 5,
          uid: 2,
          title: "TS 接口 Interface",
          content: "TypeScript 接口用于定义对象的结构（属性和方法），作为类型契约约束对象的形状，支持可选属性、只读属性和方法定义，不产生运行时代码，仅用于类型检查。",
          author: "HaoWhite",
          dateStart: "2025-07-22",
          dateEnd: "2025-08-10",
          pageTags: ["ts", "interface", "接口"],
          noteId: 2,
        },
        
        // Tailwind CSS
        {
          pageId: 6,
          uid: 1,
          title: "Tailwind 基础概念",
          content: "Tailwind CSS 是一个功能类优先的 CSS 框架，通过预定义的原子类快速构建 UI，无需编写自定义 CSS。其核心是 utility-first 方法，使样式复用和维护更加高效。",
          author: "HaoWhite",
          dateStart: "2025-07-26",
          dateEnd: "2025-08-14",
          pageTags: ["tailwind", "css", "基础"],
          noteId: 3,
        },
        {
          pageId: 7,
          uid: 2,
          title: "Tailwind 配置定制",
          content: "Tailwind CSS 提供灵活的配置系统，可通过 tailwind.config.js 文件自定义主题（颜色、字体、间距等）、添加自定义工具类、配置插件等，满足项目特定需求。",
          author: "HaoWhite",
          dateStart: "2025-07-27",
          dateEnd: "2025-08-15",
          pageTags: ["tailwind", "配置", "定制"],
          noteId: 3,
        },
        
        // React 
        {
          pageId: 8,
          uid: 1,
          title: "React 组件基础",
          content: "React 组件是构建 UI 的基本单元，分为函数组件和类组件两种类型。函数组件是纯函数，接收 props 并返回 React 元素；类组件继承 React.Component，有自己的状态和生命周期方法。",
          author: "HaoWhite",
          dateStart: "2025-07-31",
          dateEnd: "2025-08-19",
          pageTags: ["react", "组件", "基础"],
          noteId: 4,
        },
        {
          pageId: 9,
          uid: 2,
          title: "React Hooks 详解",
          content: "React Hooks 是 React 16.8 新增的特性，允许在函数组件中使用状态和其他 React 特性。常用 Hooks 包括 useState（状态管理）、useEffect（副作用处理）、useContext（上下文访问）等。",
          author: "HaoWhite",
          dateStart: "2025-08-01",
          dateEnd: "2025-08-20",
          pageTags: ["react", "hooks", "状态"],
          noteId: 4,
        },
        
        // Next.js 
        {
          pageId: 10,
          uid: 1,
          title: "Next.js 基础概念",
          content: "Next.js 是基于 React 的全栈框架，提供服务端渲染（SSR）、静态站点生成（SSG）、路由、API 路由等功能。它简化了 React 应用的构建过程，提供更好的开发体验和性能优化。",
          author: "HaoWhite",
          dateStart: "2025-08-05",
          dateEnd: "2025-08-24",
          pageTags: ["next.js", "基础", "react"],
          noteId: 5,
        },
        {
          pageId: 11,
          uid: 2,
          title: "Next.js 路由系统",
          content: "Next.js 使用文件系统为基础的路由，页面文件放在 pages 目录下自动生成路由。支持动态路由（[id].js）、嵌套路由、路由参数、客户端导航（next/link）等功能。",
          author: "HaoWhite",
          dateStart: "2025-08-06",
          dateEnd: "2025-08-25",
          pageTags: ["next.js", "路由", "导航"],
          noteId: 5,
        },
      ],
      skipDuplicates: true,
    });
    console.log(`已创建 ${createdPages.count} 个笔记页面`);

    //原学习记录，现在已经删除
    console.log("正在创建技术学习记录...");

    const createdTech = await prisma.technology.createMany({
      data: [
        { id: 1, content: "HTML+CSS+JavaScript", period: "2025-3" },
        { id: 2, content: "前端工程化+CSS基础补充", period: "2025-6" },
        { id: 3, content: "React+JavaScript基础补充", period: "2025-6" },
        { id: 4, content: "Tailwind基础+React基础补充", period: "2025-7" },
        {
          id: 5,
          content: "Router+Redux+React+JS+工程化补充",
          period: "2025-8",
        },
        { id: 6, content: "TS学习+JS补习", period: "2025-8" },
        { id: 7, content: "JS算法+JS能力提升", period: "2025-8" },
        { id: 8, content: "Next入门+JS和TS基础补习", period: "2025-8" },
        { id: 9, content: "Next+数据库prisma+postgresql", period: "2025-8" },
      ],
      skipDuplicates: true,
    });
    console.log(`已创建 ${createdTech.count} 个技术学习记录`);

    //说说
    console.log("正在创建杂项记录...");

    const createdMisc = await prisma.miscellaneous.createMany({
      data: [
        {
          id: 1,
          content: "终于弄好一点react的基础了，弄个网页练习一下",
          date: "2025-7-25",
        },
        {
          id: 2,
          content:
            "今天把网页的内容完善一下，为部署上线做点准备，笔记什么的得加进入了",
          date: "2025-8-3",
        },
        {
          id: 3,
          content: "写完一部分的功能了，明天继续吧",
          date: "2025-8-26",
        },
        {
          id: 4,
          content: "数据库终于弄完了，终于把数据连接到云了，方便做后台管理面板",
          date: "2025-8-26",
        },
        {
          id: 5,
          content: "后台管理面板终于弄完了大体功能了，接下来完善一下逻辑和样式了",
          date: "2025-9-9",
        },
        {
          id: 6,
          content: "终于搞完手头的东西了，接下来继续完善一下",
          date: "2025-9-20",
        },
        {
          id: 7,
          content: "还在完善项目了...",
          date: "2025-10-04",
        },
      ],
      skipDuplicates: true,
    });
    console.log(`已创建 ${createdMisc.count} 个杂项记录`);
    console.log("正在创建用户...");
    const hashedPassword = await bcrypt.hash('123456', 10);
    const createdUser = await prisma.user.createMany({
      data: [{
        username: "HaoWhite",
        password: hashedPassword, 
      }],
      skipDuplicates: true,
    });
    
    const hashedAdminPassword = await bcrypt.hash('341244', 10);
    const createdAdminUser = await prisma.adminUser.createMany({
      data: [{
        username: "adminHaoWhite",
        password: hashedAdminPassword, 
        role: "admin"
      }],
      skipDuplicates: true,
    })
    
    console.log(`已创建 ${createdUser.count} 个用户`);
    console.log(`已创建 ${createdAdminUser.count} 个管理员用户`);
    
    const noteCount = await prisma.note.count();
    const pageCount = await prisma.notesPage.count();
    const userCount = await prisma.user.count();
    console.log(
      `验证: 数据库中存在 ${noteCount} 条 Note 记录和 ${pageCount} 条 NotesPage 记录, ${pageCount} 条 NotesPage 记录, ${userCount} 条 User 记录`
    );
    
    console.log("数据导入完成！");
  } catch (error) {
    console.error(`导入数据时出错:`, error);
    
    if (error instanceof Error && error.message.includes('connection pool')) {
      console.error('连接池超时错误。可能的原因：');
      console.error('1. 数据库连接数已达到上限');
      console.error('2. 网络连接不稳定');
      console.error('3. 数据库服务器响应缓慢');
      console.error('建议：检查数据库连接配置，或稍后重试');
    }
    
    throw error;
  } finally {
    try {
      await prisma.$disconnect();
      console.log("已断开数据库连接");
    } catch (disconnectError) {
      console.error("断开数据库连接时出错:", disconnectError);
    }
  }
}

main()
  .catch((e) => {
    console.error(`种子脚本执行失败:`, e);
    process.exit(1);
  });

//记忆命令

//npx prisma generate 更新数据库模型文件到最新状态
// npx prisma db push  推送数据库架构更改
  //npx prisma migrate dev --name init 创建迁移文件

  //npx prisma studio 可以打开数据库可视化界面
  //npx prisma db push 应用迁移到数据库
  //npx prisma seed 运行种子脚本

  //npm run seed 运行种子脚本
