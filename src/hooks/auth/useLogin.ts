interface LoginCredentials {
  username: string;
  password: string;
}

function createLogin() {
  // 用户登录
  async function postLogin(credentials: LoginCredentials) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!res.ok) {
        throw new Error('登录失败');
      }
      
      return await res.json();
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  return {
    postLogin
  };
}

export const useLogin = createLogin();
export default useLogin;