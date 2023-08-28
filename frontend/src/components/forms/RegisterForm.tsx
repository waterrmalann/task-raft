import React, {useRef} from "react"

import { cn } from "@/lib/utils"

import {LuLoader2} from 'react-icons/lu';
import {BiLogoGoogle} from 'react-icons/bi';

// import { Icons } from "@/components/icons"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { Input } from "@components/ui/input"
import useRegister from "@hooks/user/useRegister";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { 
    setRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RegisterForm({ className, setRegistered, ...props }: RegisterFormProps) {

    const registerQuery = useRegister();

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;

        if (username && password && email) {
            try {
                const response = await registerQuery.mutateAsync({ username, email, password });
                if (response.success) {
                    setRegistered(true);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="username">
                            Username
                        </Label>
                        <Input
                            id="username"
                            placeholder="username"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={registerQuery.isLoading}
                            ref={usernameRef}
                        />
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={registerQuery.isLoading}
                            className="mt-1"
                            ref={emailRef}
                        />
                        <Label className="sr-only" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="password"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={registerQuery.isLoading}
                            className="mt-1"
                            ref={passwordRef}
                        />
                    </div>
                    <Button disabled={registerQuery.isLoading}>
                        {registerQuery.isLoading && (
                            <LuLoader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        Sign in with Email
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={registerQuery.isLoading}>
                {registerQuery.isLoading ? (
                    <LuLoader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                    <BiLogoGoogle className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            {registerQuery.isError && <p className="text-red-500 text-center">{registerQuery.error?.message}</p>}
        </div>
    )
}