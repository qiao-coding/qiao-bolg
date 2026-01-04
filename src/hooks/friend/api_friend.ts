import { FriendType } from "@/types/friend/type";


function createFriend() {
  // 获取所有友链数据
  async function getFriendList() {
    try {
      const response = await fetch('/api/friend');
      if (!response.ok) {
        throw new Error('获取友链数据失败');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取友链数据失败:', error);
      throw error;
    }
  }

  // 提交新友链
  async function postFriend(newFriend: Omit<FriendType, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    try {
      const res = await fetch('/api/friend/post_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFriend)
      });
      
      if (!res.ok) {
        throw new Error('提交友链失败');
      }
      
      return await res.json();
    } catch (error) {
      console.error('提交友链失败:', error);
      throw error;
    }
  }
  // 删除友链
  async function deleteFriend(id: number) {
    try {
      const res = await fetch(`/api/friend/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('删除友链失败');
      }
      return await res.json();
    } catch (error) {
      console.error('删除友链失败:', error);
      throw error;
    }
  }

  return {
    getFriendList,
    postFriend,
    deleteFriend
  };
}

export const api_friend = createFriend();