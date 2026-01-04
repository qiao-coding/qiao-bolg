function createAdmin() {
  // 管理员登出
  async function postAdminLogout() {
    try {
      const res = await fetch('/api/adminLogout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('登出失败');
      }
      
      return await res.json();
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  }

  return {
    postAdminLogout
  };
}

export const api_admin = createAdmin();
export default api_admin;