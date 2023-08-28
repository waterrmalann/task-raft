import React, {useRef} from "react"

import { cn } from "@/lib/utils"

import {LuLoader2} from 'react-icons/lu';
import {BiLogoGoogle} from 'react-icons/bi';

import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { Input } from "@components/ui/input"
import useLogin from "@hooks/user/useLogin";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function LoginForm({ className, ...props }: LoginFormProps) {
    
    const loginQuery = useLogin();
    
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);


    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (username && password) {
            loginQuery.mutate({ username, password });
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
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
                            disabled={loginQuery.isLoading}
                            ref={usernameRef}
                        />
                        <Input
                            id="password"
                            placeholder="password"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={loginQuery.isLoading}
                            className="mt-1"
                            ref={passwordRef}
                        />
                    </div>
                    <Button disabled={loginQuery.isLoading}>
                        {loginQuery.isLoading && (
                            <LuLoader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        Log In
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
            <Button variant="outline" type="button" disabled={loginQuery.isLoading}>
                {loginQuery.isLoading ? (
                    <LuLoader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                    <BiLogoGoogle className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            {loginQuery.isError && <p className="text-red-500 text-center">{loginQuery.error?.message}</p>}
        </div>
    )
}