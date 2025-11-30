import { signIn } from "next-auth/react"
import { Github } from "lucide-react"

export function SignIn() {
    return (
        <form action={async () => {
            await signIn("github", { redirectTo: "/" })
        }}>
            <button
                type="submit"
                className="px-6 py-3 text-white bg-black rounded-lg hover:bg-black  shadow-md"
            >
                <Github className="inline-block mr-2" />
                登录你的github账户
            </button>
        </form>

    )
}