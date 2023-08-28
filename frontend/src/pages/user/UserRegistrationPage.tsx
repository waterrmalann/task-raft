import { buttonVariants } from "@/components/ui/button"
import React, { useState } from 'react';

import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { RegisterForm } from '@components/forms/RegisterForm';

function SideHalf() {
    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                TaskRaft
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg">
                        &ldquo;Time isn’t the main thing, it is the only thing.&rdquo;
                    </p>
                    <footer className="text-sm">Miles Davis</footer>
                </blockquote>
            </div>
        </div>
    );
}

function TermsAndPrivacy() {
    return (
        <>
            <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    to="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    to="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </>
    );
}


export default function UserRegistrationPage() {
    const [isRegistered, setRegistered] = useState(false);

    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    to="/login"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Login
                </Link>
                <SideHalf />
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {
                            isRegistered ? (
                                <React.Fragment>
                                    <div className="flex flex-col space-y-2 text-center">
                                        <h1 className="text-2xl font-semibold tracking-tight">
                                            Verify your email.
                                        </h1>
                                        <p className="text-sm text-muted-foreground">
                                            Check your email for an account verification link.
                                        </p>
                                        <p className="px-8 text-center text-sm text-muted-foreground">
                                            Continue to{" "}
                                            <Link
                                                to="/login"
                                                className="underline underline-offset-4 hover:text-primary"
                                            >
                                                Login
                                            </Link>.
                                        </p>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className="flex flex-col space-y-2 text-center">
                                        <h1 className="text-2xl font-semibold tracking-tight">
                                            Create an account.
                                        </h1>
                                        <p className="text-sm text-muted-foreground">
                                            Enter your email below to create your account.
                                        </p>
                                    </div>
                                    <RegisterForm setRegistered={setRegistered} />
                                    <TermsAndPrivacy />

                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}