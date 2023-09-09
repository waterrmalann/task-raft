import { useRef, useState } from 'react';
import { useToast } from "@components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { RxGear } from 'react-icons/rx';
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
import { BoardData } from '@hooks/user/useBoard';
import useEditBoardMutation from '@hooks/user/useEditBoardMutation';

interface EditBoardModalProps extends React.HTMLAttributes<HTMLDivElement> {
    boardData: BoardData | undefined;
}


export default function EditBoardModal({ boardData }: EditBoardModalProps) {

    const boardEditMutation = useEditBoardMutation(boardData?.board._id || '');
    const { toast } = useToast();

    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    const [creationModal, setEditModal] = useState(false);

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
            const result = await boardEditMutation.deleteBoard.mutateAsync();

            if (result.success) {
                setEditModal(false);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occured." });
        }
    }

    return (
        <Dialog open={creationModal} onOpenChange={setEditModal}>
            <DialogTrigger asChild>
                <RxGear className="cursor-pointer" size={24} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] sm:min-h-[80%]">
                <DialogHeader>
                    <DialogTitle>Edit Board</DialogTitle>
                    <DialogDescription>
                        Edit information about the board.
                    </DialogDescription>
                </DialogHeader>
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
                    <DialogFooter>
                        <Button disabled={boardEditMutation.editBoard.isLoading} type="submit">{boardEditMutation.editBoard.isLoading ? "Saving..." : "Save changes"}</Button>
                        <Button disabled={boardEditMutation.deleteBoard.isLoading} type="button" onClick={deleteBoard}>Delete Board</Button> 
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}