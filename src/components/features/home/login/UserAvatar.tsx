import Image from "next/image"
import { auth } from "../../../../../auth"
import { useSession } from "next-auth/react"

export function UserAvatar() {
    const { data: session } = useSession()
    if (!session?.user) return <Image src="/avatar.png" alt="User Avatar" />
    return (
        <div>
            <Image src={session.user.image || ''} alt="User Avatar" width={40} height={40} className="rounded-full" />
        </div>
    )
}

