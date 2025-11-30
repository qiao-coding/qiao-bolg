import { miscellaneousType } from "@/types/miscellaneous/type";


function createMiscellaneous() {
    // 获取所有说说数据
    async function getMiscellaneousList() {
        try {
            const res = await fetch('/api/miscellaneous');
            if (!res.ok) {
                throw new Error('获取说说数据失败');
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('获取说说数据失败:', error);
            throw error;
        }
    }


    async function postMiscellaneous(params: miscellaneousType) {
        try {
            const res = await fetch('/api/miscellaneous/post_miscellaneous', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            if (!res.ok) {
                throw new Error('Failed to post miscellaneous item');
            }
            return await res.json();
        } catch (error) {
            console.error('添加新说说失败:', error);
            throw error;
        }
    }


    async function putMiscellaneous(params: miscellaneousType) {
        try {
            const response = await fetch('/api/miscellaneous/put_miscellaneous', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error('Failed to patch miscellaneous item');
            }
        } catch (error) {
            console.error('更新说说失败:', error);
            throw error;
        }
    }


    async function deleteMiscellaneous(paramsId: number) {
        try {
            const response = await fetch('/api/miscellaneous/delete_miscellaneous', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: paramsId})
            });
            if (!response.ok) {
                throw new Error('Failed to delete miscellaneous item');
            }
        } catch (error) {
            console.error('删除说说失败:', error);
            throw error;
        }
    }

    return {
        getMiscellaneousList,
        postMiscellaneous,
        putMiscellaneous,
        deleteMiscellaneous,
    };
}

export const useMiscellaneous = createMiscellaneous();