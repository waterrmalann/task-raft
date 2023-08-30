import { buttonVariants } from "@/components/ui/button"
import React, { useState } from 'react';

import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { RegisterForm } from '@components/forms/RegisterForm';
import AuthSideHalf from "@components/AuthSideHalf";

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
                <AuthSideHalf />
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