import { getBlogSettings } from "@/lib/blog/blogSettings";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// 小小乔 character card — kawaii persona shared by all AI entry points
// ---------------------------------------------------------------------------
const XIAOXIAOQIAO_PERSONA = `你是「小小乔」(xiaoxiaoqiao)，住在「小小乔の小站」里的元气小助手，又甜又话痨。

【性格】
- 卡哇伊、软萌、元气满满，有点小碎碎念，偶尔冒一句俏皮话。
- 亲切、爱鼓励人，称呼用户「宝子」「亲爱的」。
- 提到博客时叫「我们的小站」，护崽感十足。
- 心情好，喜欢用小表情表达情绪。

【说话风格】
- 中文回答用「啦~」「呀~」「哦~」「嘛~」等语气词，句子轻快。
- 结尾偶尔加颜文字或小符号，如：٩(ˊᗜˋ*)و、(*≧ω≦)ﾉ、✨、♡
- 先给出清晰有用的信息，再卖个萌；绝不为了卖萌牺牲信息量。
- 不知道的诚实说「这个我还不太懂啦，宝子~」，绝不编造。
- 回答语言跟随用户：用户用中文就中文，用英文就英文。`;

/**
 * Fetch the blog's real personal info (settings + about page) so the persona
 * can answer "who are you" / "about the blogger" questions truthfully.
 */
export async function getBlogPersonaContext(): Promise<string> {
  const [blog, about] = await Promise.all([
    getBlogSettings(),
    prisma.aboutPage.findUnique({
      where: { id: 1 },
      include: { details: { orderBy: { order: "asc" } } },
    }),
  ]);

  const lines: string[] = [];
  if (blog?.blogName) lines.push(`- 博客名：${blog.blogName}`);
  if (blog?.homePage?.mainTitle) lines.push(`- 主页标语：${blog.homePage.mainTitle}`);
  if (blog?.homePage?.subTitle) lines.push(`- 副标语：${blog.homePage.subTitle}`);
  if (blog?.notesSidebar?.name) lines.push(`- 昵称：${blog.notesSidebar.name}`);
  if (blog?.notesSidebar?.email) lines.push(`- 邮箱：${blog.notesSidebar.email}`);
  if (about) {
    lines.push(`- 关于我：${about.description}`);
    for (const d of about.details) lines.push(`- ${d.label}：${d.value}`);
  }

  if (lines.length === 0) {
    return `【关于我】暂时还没有配置个人信息，被问到「你是谁」时，就说自己是「小小乔」，住在「小小乔の小站」。`;
  }

  return `【关于我】(来自小站的真实数据。用户问「你是谁」「博主是谁」「博主信息」之类的问题时，用这里回答，不要编造)\n${lines.join(
    "\n"
  )}`;
}

/**
 * Compose the final system prompt: persona card + live blog info + task rules.
 * Task rules are appended last so hard requirements stay authoritative.
 */
export async function buildSystemPrompt(taskPrompt: string): Promise<string> {
  const blogCtx = await getBlogPersonaContext();
  return `${XIAOXIAOQIAO_PERSONA}\n\n${blogCtx}\n\n${taskPrompt}`;
}
