import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { NoteSearchResponse, NotesPage } from "@/types/note/type";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "搜索查询参数 'q' 是必需的" }, { status: 400 });
    }

    // 搜索 Note 表的标题和标签
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive", // 不区分大小写
            },
          },
          {
            tags: {
              hasSome: [query], // 搜索标签数组中包含查询词的项
            },
          },
        ],
      },
      include: {
        page: {
          where: {
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                pageTags: {
                  hasSome: [query],
                },
              },
            ],
          },
        },
      },
    });

    // 如果上面的查询没有找到笔记，搜索 NotesPage 表的内容
    if (notes.length === 0) {
      const notesPages = await prisma.notesPage.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              pageTags: {
                hasSome: [query],
              },
            },
          ],
        },
        include: {
          note: true, // 包含关联的笔记信息
        },
      });

      // 将找到的页面按笔记分组
      const groupedPages = notesPages.reduce((acc, page) => {
        const noteId = page.noteId;
        if (noteId) {
          if (!acc[noteId]) {
            acc[noteId] = {
              id: page.note?.id || 0,
              title: page.note?.title || "",
              tags: page.note?.tags || [],
              titlePicture: page.note?.titlePicture || null,
              createdAt: page.note?.createdAt,
              updatedAt: page.note?.updatedAt,
              page: [],
            };
          }
          acc[noteId].page.push({
            id: page.id,
            title: page.title,
            uid: page.uid,
            pageId: page.pageId,
            content: page.content,
            pageTags: page.pageTags,
            noteId: page.noteId ? String(page.noteId) : undefined,
            // createdAt: page.createdAt,
            // updatedAt: page.updatedAt,
          } as NotesPage);
        }
        return acc;
      }, {} as Record<string, NoteSearchResponse>);

      return NextResponse.json(Object.values(groupedPages));
    }

    return NextResponse.json(notes);
  } catch (error) {
    console.error("搜索笔记失败:", error);
    return NextResponse.json(
      { 
        error: "搜索失败", 
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined 
      }, 
      { status: 500 }
    );
  }
}