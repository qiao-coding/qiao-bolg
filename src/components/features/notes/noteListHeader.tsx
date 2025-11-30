import ThemePage from "@/components/ui/public/themePage";
import Link from "next/link";



export function NoteListHeader() {

    return (
        <header className="flex justify-between mb-5 container mx-auto px-4 sm:px-6 py-4 flex">
            <Link
                href="/notes"
                className="flex items-center text-[#8A94A6] hover:text-[#4A6FA5] transition-colors cursor-target"
            >
                <svg
                    className="mr-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                <span>返回列表</span>
            </Link>
            <ThemePage />
        </header>
    )

}