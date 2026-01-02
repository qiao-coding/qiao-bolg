import { AdminUser } from "@prisma/client";

interface AdminUserCredentials {
  username: string;
  password: string;
  isDynamicEmail?: boolean;
}

interface UpdateAdminUserParams {
  id: number;
  isDynamicEmail: boolean;
}

function createAdminUser() {
  // 获取管理员用户列表
  async function getAdminUsers(props?: RequestInit) {
    try {
      const res = await fetch('/api/adminUser', {
        ...props
      });

      if (!res.ok) {
        throw new Error('管理员用户数据获取失败');
      }
      const data = await res.json();

      return data;
    } catch (error) {
      console.error('获取管理员用户数据失败:', error);
      throw error;
    }
  }

  // 创建或更新管理员用户
  async function postAdminUser(userData: AdminUserCredentials): Promise<{ message: string } | undefined> {
    try {
      const res = await fetch('/api/adminUser/post_adminUser', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        throw new Error('创建或更新管理员用户失败');
      }

      const data = (await res.json());
      return data;
    } catch (error) {
      console.error('创建或更新管理员用户失败:', error);
      throw error;
    }
  }

  // 更新管理员用户
  async function putAdminUser(userData: UpdateAdminUserParams): Promise<{ message: string; user: AdminUser } | undefined> {
    try {
      const res = await fetch('/api/adminUser/put_adminUser', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        throw new Error('更新管理员用户失败');
      }

      const data = (await res.json());
      return data;
    } catch (error) {
      console.error('更新管理员用户失败:', error);
      throw error;
    }
  }

  // 删除管理员用户
  async function deleteAdminUser(id: number): Promise<{ message: string } | undefined> {
    try {
      const res = await fetch(`/api/adminUser/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('删除管理员用户失败');
      }

      const data = (await res.json());
      return data;
    } catch (error) {
      console.error('删除管理员用户失败:', error);
      throw error;
    }
  }

  return {
    getAdminUsers,
    postAdminUser,
    putAdminUser,
    deleteAdminUser
  };

}

export const useAdminUser = createAdminUser();