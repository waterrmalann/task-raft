import { useRef } from 'react';
import { useToast } from "@components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { BoardData } from '@hooks/user/useBoard';
import useEditBoardMutation from '@hooks/user/useEditBoardMutation';

interface EditBoardSheetProps extends React.HTMLAttributes<HTMLDivElement> {
    boardData: BoardData | undefined;
    children: React.ReactNode;
}

export default function EditBoardSheet({ boardData, children }: EditBoardSheetProps) {

    const boardEditMutation = useEditBoardMutation(boardData?.board._id || '');
    const { toast } = useToast();

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
            await boardEditMutation.editBoard.mutateAsync({
                title,
                description,
                visibility: "PRIVATE"
            });

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occured." });
        }
    }

    async function deleteBoard() {
        try {
            await boardEditMutation.deleteBoard.mutateAsync();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occured." });
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Board</SheetTitle>
                    <SheetDescription>
                        Make changes to your board here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">

                            <Label htmlFor="name" className="text-right">
                                Board Title
                            </Label>
                            <Input id="name" defaultValue={boardData?.board.title} placeholder="Untitled Board" className="col-span-3" ref={titleRef} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                         <Textarea id="description" defaultValue={boardData?.board.description || ''} placeholder="A board with many things..." className="col-span-3" ref={descriptionRef} />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button disabled={boardEditMutation.editBoard.isLoading} type="submit">{boardEditMutation.editBoard.isLoading ? "Saving..." : "Save changes"}</Button>
                        <SheetClose asChild>
                            <Button disabled={boardEditMutation.deleteBoard.isLoading} type="button" onClick={deleteBoard}>Delete Board</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}