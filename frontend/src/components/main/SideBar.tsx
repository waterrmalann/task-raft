import { cn } from "@/lib/utils"
import { Button } from "@components/ui/button"

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function SideBar({ className }: SideBarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Recent Boards
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                            </svg>
                            Personal Project
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                            </svg>
                            Meetings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                            </svg>
                            Side Project
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="m16 6 4 14" />
                                <path d="M12 6v14" />
                                <path d="M8 8v12" />
                                <path d="M4 4v16" />
                            </svg>
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="m16 6 4 14" />
                                <path d="M12 6v14" />
                                <path d="M8 8v12" />
                                <path d="M4 4v16" />
                            </svg>
                            Boards
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Teams
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="m16 6 4 14" />
                                <path d="M12 6v14" />
                                <path d="M8 8v12" />
                                <path d="M4 4v16" />
                            </svg>
                            Templates
                        </Button>
                        <Button variant="ghost" className="pt-10 w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="m16 6 4 14" />
                                <path d="M12 6v14" />
                                <path d="M8 8v12" />
                                <path d="M4 4v16" />
                            </svg>
                            Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}