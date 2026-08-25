import { LoginForm } from "@/components/features/login/login-form"
import TechBackgroundNoGrid from "@/components/ui/public/background_img"


export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <TechBackgroundNoGrid>
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-24 md:px-10">
      <div className="w-full max-w-sm md:max-w-2xl">
        <LoginForm locale={locale} />
      </div>
    </div>
    </TechBackgroundNoGrid>
  )
}
