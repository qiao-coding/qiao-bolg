import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/shadcnComponents/button';
import { FaGithub } from 'react-icons/fa';

const GitHubLoginButton = () => {

  return (
    <form action={async()=>{
      await signIn('github', { redirect: true , callbackUrl: '/' });
    }}>
    <Button 
      className="w-full flex items-center justify-center gap-2"
      // onClick={handleGitHubLogin}
    >
      <FaGithub size={18} />
      使用 GitHub 账号登录
    </Button>
    </form>
  );
};

export default GitHubLoginButton;