import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


// model Comment {
//   id        String   @id @default(cuid())
//   content   String
//   author    User      @relation(fields: [authorId], references: [id])
//   authorId  String
//   publicComment      publicComment     @relation(fields: [postId], references: [id])
//   postId    String
//   parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
//   parentId  String?
//   replies   Comment[] @relation("CommentReplies")
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        const { notesId, comment, parentId, authorId } = body;
        if (!notesId || !comment) {
            return NextResponse.json({ error: 'notesId and comment are required' }, { status: 400 });
        }
        const response = await prisma.comment.create({
            data: {
                content: comment,
                postId: notesId,
                notesId: notesId,
                author: {
                    connect: { id: authorId }
                },
                publicComment: {
                    connect: { id: notesId }
                },
                parent: parentId ? { connect: { id: parentId } } : undefined,

            }
        })

        if (!response) {
            throw new Error('Failed to create comment');
        }
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

}