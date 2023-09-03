import { useRef, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import useCreateBoardMutation from "@hooks/user/useCreateBoardMutation";
import { useToast } from "@components/ui/use-toast";
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button";
import { RxPlus } from 'react-icons/rx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@components/ui/textarea";
import useUser from '@hooks/user/useUser';

function CreateBoardButton() {

    const boardCreationMutation = useCreateBoardMutation();
    const { toast } = useToast();
    const navigate = useNavigate();

    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        const title = titleRef.current?.value;
        if (!title) {
            toast({ variant: "destructive", title: "Error", description: "Please specify a title." });
            return;
        }

        const description = descriptionRef.current?.value;

        try {
            const result = await boardCreationMutation.mutateAsync({
                title,
                description,
                visibility: "PRIVATE"
            });

            if (result.success) {
                toast({ title: result.message });
                setCreationModal(false);
                navigate(`/dash/boards/${result.boardId}`);
            }

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occured." });
        }
    }

    const [creationModal, setCreationModal] = useState(false);

    return (
        <Dialog open={creationModal} onOpenChange={setCreationModal}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start"><RxPlus className="mr-2 h-4 w-4" /> Create Board</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Board</DialogTitle>
                    <DialogDescription>
                        Create a new kanban board. Specify a title and a description for your board.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Board Title
                            </Label>
                            <Input id="name" placeholder="Untitled Board" className="col-span-3" ref={titleRef} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Description
                            </Label>
                            <Textarea id="description" placeholder="A board with many things..." className="col-span-3" ref={descriptionRef} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={boardCreationMutation.isLoading} type="submit">{boardCreationMutation.isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

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
                            <NavLink key={board._id} to={`/dash/boards/${board._id}`}>
                                <Button variant="ghost" className="w-full justify-start">
                                    <BoardIcon />
                                    {board.title}
                                </Button>
                            </NavLink>
                        )}
                        <CreateBoardButton />
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <BoardIcon />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <BoardIcon />
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