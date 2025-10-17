"use client"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Github } from "lucide-react"

export function GithubSignIn() {
    return (
        <div>
            <motion.button
                onClick={() => signIn("github", { redirectTo: "/" })}
                whileHover={{ scale: 1.02, translateY: -10, transition: { duration: 0.5 } }}
                className="px-6 py-3 text-white bg-black rounded-lg hover:bg-black  shadow-md"
            >
                <Github className="inline-block mr-2" />
                登录你的github账户
            </motion.button>
        </div>

    )
}