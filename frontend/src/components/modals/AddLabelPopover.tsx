// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AddLabelPopoverModal extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function AddLabelPopover({ children }: AddLabelPopoverModal) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Add Label</h4>
                        <p className="text-sm text-muted-foreground">
                            Add a tag to your card.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="label">Label</Label>
                            <Input
                                id="label"
                                defaultValue=""
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}