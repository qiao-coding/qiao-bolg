'use client'
import { Button } from "@/components/ui/shadcnComponents/button";
import { Input } from "@/components/ui/shadcnComponents/input";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { UserAvatar } from "../home/login/UserAvatar";

// 定义回复接口
interface ReplyComment {
    id: string;
    author: string;
    content: string;
    date: string;
}

// 定义评论接口
interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    replies?: ReplyComment[];
    avatar?: string;
}


export const RenderComment = ({ comments ,notesId }: { comments: Comment[] ,notesId: string }) => {
    const { theme } = useTheme();
    const [openCommentReplyForm, setOpenCommentReplyForm] = useState<string | null>(null)

    // const [commentAnswers, setCommentAnswers] = useState<Comment[]>([])

    // const foundComment = comments.find(comment => comment.id === notesId);
    // setCommentAnswers(foundComment ? [foundComment] : []);

    const handleShowReplyForm = (commentId: string) => {
        setOpenCommentReplyForm(commentId)

    }

    const [commentContent, setCommentContent] = useState<string>('')

    //评论回复
  const handleCommentContent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentContent) {
        return
    }
    const newComment = {
        id: Date.now().toString(),
        author: '匿名用户',
        content: commentContent,
        date: new Date().toLocaleString(),
        avatar:<UserAvatar/>

    }

    


  }



    return (
        <div>
            <div className="flex justify-between items-center lg:w-[45vw]  mt-8 mb-4">
                <h2 className={`text-2xl font-bold  ${theme === 'light' ? 'text-[#2D3748]' : 'text-gray-100'}`}>
                    评论
                </h2>
                <div>
                    <form action="" className="flex items-center gap-2" onSubmit={handleCommentContent}>
                        <Input
                            placeholder="在这里写下你的评论..."
                            className={`w-full p-2 border ${theme === 'light' ? 'border-[#EDEFF2] text-[#2D3748]' : 'border-gray-700 text-gray-100'}`}
                            onChange={(e) => setCommentContent(e.target.value)}                        
                        />
                        <Button>
                            提交
                        </Button>
                    </form>

                </div>

            </div>
            {comments.map(comment => (
                comment.id===notesId &&
                <div
                    key={comment.id}
                    className={`py-6 ${theme === 'light' ? 'border-b border-[#EDEFF2]' : 'border-b border-gray-700'}`}
                >
                    <div className="flex items-center mb-3">
                        <Image className={`w-6 h-6 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`} src={comment?.avatar||''} alt={comment.author} />
                        <span className={`ml-2 font-medium ${theme === 'light' ? 'text-[#2D3748]' : 'text-gray-100'}`}>
                            {comment.author}
                        </span>
                        <span className={`ml-4 text-sm ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                            {comment.date}
                        </span>
                    </div>
                    <p className={`${theme === 'light' ? 'text-[#4A5568]' : 'text-gray-300'}`}>
                        {comment.content}
                    </p>
                    <div>
                        <span className="flex cursor-pointer">
                            <span
                                onClick={() => (
                                    openCommentReplyForm === comment.id ? setOpenCommentReplyForm(null) : handleShowReplyForm(comment.id)
                                )}
                                className={`text-sm p-2 flex w-50  ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                                回复
                            </span>

                        </span>

                        {openCommentReplyForm === comment.id && (
                            <form action="" className="flex items-center gap-2 mt-2 w-[40vw]">
                                <Image className={`w-6 h-6 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`} src={comment?.avatar||''} alt={comment.author} />

                                <Input
                                    placeholder="在这里写下你的回复..."
                                    className={`w-full p-2 border ${theme === 'light' ? 'border-[#EDEFF2] text-[#2D3748]' : 'border-gray-700 text-gray-100'}`}
                                />
                                <Button>
                                    提交
                                </Button>
                            </form>
                        )}
                    </div>
                    {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="ml-8">
                            {comment.replies.map(reply => (
                                <div
                                    key={reply.id}
                                    className={`py-6 ${theme === 'light' ? 'border-b border-[#EDEFF2]' : 'border-b border-gray-700'}`}
                                >
                                    <div className="flex items-center mb-3">
                                        <User className={`w-6 h-6 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`} />
                                        <span className={`ml-2 font-medium ${theme === 'light' ? 'text-[#2D3748]' : 'text-gray-100'}`}>
                                            {reply.author}
                                        </span>
                                        <span className={`ml-4 text-sm ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                                            {reply.date}
                                        </span>
                                    </div>
                                    <p className={`${theme === 'light' ? 'text-[#4A5568]' : 'text-gray-300'}`}>
                                        {reply.content}
                                    </p>
                                    <div className=" mt-2 ">
                                        <span
                                            onClick={() => (
                                                openCommentReplyForm === reply.id ? setOpenCommentReplyForm(null) : handleShowReplyForm(reply.id)
                                            )}
                                            className={`text-sm cursor-pointer p-1 flex w-50 items-center ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`}>
                                            回复
                                        </span>
                                        {openCommentReplyForm === reply.id && (
                                            <form action="" className="flex items-center gap-2 mt-2 w-[40vw]">
                                                <User className={`w-6 h-6 ${theme === 'light' ? 'text-[#8A94A6]' : 'text-gray-400'}`} />

                                                <Input
                                                    placeholder="在这里写下你的回复..."
                                                    className={`w-full p-2 border ${theme === 'light' ? 'border-[#EDEFF2] text-[#2D3748]' : 'border-gray-700 text-gray-100'}`}
                                                />
                                                <Button>
                                                    提交
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


