import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateBoardMutation from "@hooks/user/useCreateBoardMutation";
import { useToast } from "@components/ui/use-toast";

import { Button } from "@/components/ui/button";
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

interface CreateBoardModalProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function CreateBoardModal({ children }: CreateBoardModalProps) {

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
                {children}
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
                            <Label htmlFor="description" className="text-right">
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