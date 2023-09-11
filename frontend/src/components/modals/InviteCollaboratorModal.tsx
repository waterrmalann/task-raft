import React, {useRef} from 'react';
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
import {Button} from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';

interface InviteCollaboratorModalProps extends React.HTMLAttributes<HTMLDivElement> {
    inviteCollaborator(collaboratorEmail: string): Promise<boolean>;
    children: React.ReactNode;
}

export default function InviteCollaboratorModal({inviteCollaborator, children}: InviteCollaboratorModalProps) {

    const collaboratorRef = useRef<HTMLInputElement | null>(null);
    const {toast} = useToast();

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        const collaboratorEmail = collaboratorRef.current?.value;
        if (collaboratorEmail === undefined) {
            toast({variant: "destructive", title: "Error", description: "Please specify an email address."});
            return;
        }

        const result = await inviteCollaborator(collaboratorEmail);
        if (result) {
            toast({title: "Board Invite", description: "User has been invited to the board."});
        } else {
            toast({variant: "destructive", title: "Error", description: "Could not invite user."});
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Collaborators</DialogTitle>
                    <DialogDescription>
                        Enter in an email to send an invitation for collaboration to the user.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="collaboratorEmail" className="text-right">
                                Collaborator Email
                            </Label>
                            <Input id="collaboratorEmail" type="email" placeholder="mail@example.com" className="col-span-3" ref={collaboratorRef} />
                        </div>
                       
                    </div>
                    <DialogFooter>
                        <Button type="submit">Invite</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}