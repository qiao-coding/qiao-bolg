import type { CreateNoteInput, Note, NotesPage } from "@/types/note/type";



function createNotes() {


    async function getNote(props?: RequestInit) {
        try {
            const res = await fetch('/api/notes', {
                ...props
            });

            if (!res.ok) {
                throw new Error('笔记数据获取失败');
            }
            const data = await res.json();

            return data
        } catch (error) {

        }
    }


    async function getNoteList(notesID: string) {
        try {
            const res = await fetch(`/api/notes/${notesID}`)
            if (!res.ok) {
                throw new Error(`数据获取失败,http状态码${res.status}`)
            }
            const data = await res.json()
            return data
        } catch (error) {
        }
    }


    async function getNoteListById(notesID: string) {
        try {
            const res = await fetch(`/api/notes/${notesID}`);
            if (!res.ok) {
                throw new Error('获取笔记详情失败');
            }
            const data = await res.json();
            return data
        } catch (error) {

        }

    }

    async function postNote(note: CreateNoteInput): Promise<Note | undefined> {
        try {
            const res = await fetch('/api/notes/post_notes', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            })
            if (!res.ok) {
                throw new Error('新建笔记失败');
            }
            const data = (await res.json()) as Note;
            return data
        } catch (error) {
        }
    }

    async function postNotePage(params: NotesPage) {
        try {
            const res = await fetch(`/api/notes/page/post_notesPage`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            if (!res.ok) {
                throw new Error('新建笔记页面失败');
            }

            const data = await res.json();
            return data
        } catch (error) { }

    }


    async function putNote(note: Note) {
        try {
            const res = await fetch(`/api/notes/put_notes`, {
                method: 'PUT',

                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(note)
            })

            if (!res.ok) {
                throw new Error('更新笔记失败');
            }

            const data = await res.json();
            return data
        } catch (error) {
        }
    }

    async function putNotePage(params: NotesPage) {
        try {
            const res = await fetch(`/api/notes/page/put_notesPage`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
            
            if (!res.ok) {
                throw new Error('更新笔记页面失败');
            }

            const data = await res.json();
            return data
        } catch (error) {

         }

    }



    async function deleteNote(notesID: number) {
        try {
            const res = await fetch(`/api/notes/delete_notes`, {
                method: 'DELETE',
                credentials: 'include',
                body: JSON.stringify({ id: notesID })
            });
            if (!res.ok) {
                throw new Error('删除笔记失败');
            }
            const data = await res.json();
            return data;
        } catch (error) {
        }
    }

    async function deleteNotePage(pageID: string) {
        try {
            const res = await fetch(`/api/notes/page/delete_notesPage`, {
                method: 'DELETE',
                credentials: 'include',
                body: JSON.stringify({ pageID: pageID })
            });
            if (!res.ok) {
                throw new Error('删除笔记页面失败');
            }
            const data = await res.json();
            return data;
        } catch (error) {
        }
    }



    return {
        getNote,
        getNoteList,
        getNoteListById,

        postNote,
        postNotePage,

        putNote,
        putNotePage,

        deleteNote,
        deleteNotePage,
    }

}



export const useNotes = createNotes();