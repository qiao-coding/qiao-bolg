import { signIn } from "../../../../auth"
import { Github } from "lucide-react"

export function SignIn() {
    return (
        <form action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/" })
        }}>
            <button
                type="submit"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-brand-blue/30 bg-foreground px-5 py-3 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/35"
            >
                <Github className="size-4" />
                使用 GitHub 登录
            </button>
        </form>

    )
}
