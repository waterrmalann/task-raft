import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@components/ui/button";

interface SideBarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        title: string
        to: string
    }[]
}

export function SideBarNav({ className, items, ...props }: SideBarNavProps) {

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => {
                        if (isActive) {
                            return cn(buttonVariants({ variant: "ghost" }), 'bg-muted hover:bg-muted', 'justify-start');
                        } else {
                            return cn(
                                buttonVariants({ variant: "ghost" }),
                                'hover:bg-transparent hover:underline',
                                'justify-start'
                            );
                        }
                    }}
                >
                    {item.title}
                </NavLink>
            ))}
        </nav>
    )
}