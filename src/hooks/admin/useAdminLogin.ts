interface AdminLoginCredentials {
  username: string;
  password: string;
}

function createAdminLogin() {
  // 管理员登录
  async function postAdminLogin(credentials: AdminLoginCredentials) {
    try {
      const res = await fetch('/api/adminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('管理员登录失败');
      }
      
      return await res.json();
    } catch (error) {
      console.error('管理员登录失败:', error);
      throw error;
    }
  }

  return {
    postAdminLogin
  };
}

export const useAdminLogin = createAdminLogin();
export default useAdminLogin;