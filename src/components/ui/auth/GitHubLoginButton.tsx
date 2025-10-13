import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/shadcnComponents/button';
import { FaGithub } from 'react-icons/fa';

const GitHubLoginButton = () => {
  const handleGitHubLogin = async () => {
    try {
      await signIn('github', { redirect: true , callbackUrl: '/' });
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };

  return (
    <Button 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGitHubLogin}
    >
      <FaGithub size={18} />
      使用 GitHub 账号登录
    </Button>
  );
};

export default GitHubLoginButton;