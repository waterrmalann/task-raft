import { Link, NavLink } from "react-router-dom";

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button";
import useUser from '@hooks/user/useUser';
import CreateBoardModal from "@components/modals/CreateBoardModal";
import {RxPlus, RxGear} from 'react-icons/rx';

function BoardIcon() {
    return (
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
    )
}

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
}

export function SideBar({ isOpen, className }: SideBarProps) {

    const {data: userData} = useUser();

    if (!isOpen) {
        return <></>
    }

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Recent Boards
                    </h2>
                    <div className="space-y-1">
                        {userData?.boards.map(board =>
                            <NavLink 
                            key={board._id} 
                            to={`/dash/boards/${board._id}`}
                            className={({ isActive }) => {
                                if (isActive) {
                                    return cn(buttonVariants({ variant: "ghost" }), 'bg-muted hover:bg-muted', 'w-full justify-start');
                                } else {
                                    return cn(
                                        buttonVariants({ variant: "ghost" }),
                                        'hover:bg-transparent',
                                        'w-full justify-start'
                                    );
                                }
                            }}
                            >
                                    <BoardIcon />
                                    {board.title}
                            </NavLink>
                        )}
                        <CreateBoardModal>
                            <Button variant="ghost" className="w-full justify-start"><RxPlus className="mr-2 h-4 w-4" /> Create Board</Button>
                        </CreateBoardModal>

                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        <Link to="/dash">
                            <Button variant="ghost" className="w-full justify-start">
                                <BoardIcon />
                                Dashboard
                            </Button>
                        </Link>
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
                        <div className="py-5"></div>
                        <Link to="/user/">
                            <Button variant="ghost" className="w-full justify-start">
                                <RxGear className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}