import { LoginForm } from '@components/forms/LoginForm.tsx';

import { buttonVariants } from "@/components/ui/button"
import AuthSideHalf from "@components/AuthSideHalf";

import { cn } from "@/lib/utils"
import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import { OTPForm } from '@components/forms/OTPForm';

// import PasswordResetForm from '@components/forms/PasswordResetForm';

export interface UserCredentials {
    username: string;
    password: string;
}

export default function UserLoginPage() {
    const navigate = useNavigate();

    const [getCredentials, setCredentials] = useState<UserCredentials>({username: '', password: ''});
    const [getMFA, setMFA] = useState(false);
    // const [passwordReset, setPasswordReset] = useState(false);

    // State that determines if we are finally A-Ok for login.
    const [ok, setOk] = useState(false);
    useEffect(() => {
        if (ok) {
            // Invalidate any leftover credentials for security.
            setCredentials({username: '', password: ''})
            // Redirect to dashboard now that  we are logged in.
            navigate('/dash', {replace: true});
        }
    }, [ok, navigate]);

    function handlePasswordReset() {
        // setPasswordReset(true);
    }

    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center sm:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    to="/register"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Register
                </Link>
                <AuthSideHalf />
                <div className="lg:p-8">

                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {getMFA ? '2 Factor Authentication' : 'Login to your account'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {getMFA ? 'Enter your email OTP to login.' : 'Enter your email and password below to login.'}
                            </p>
                        </div>
                        {
                            getMFA ? (
                                <React.Fragment>
                                    <OTPForm setOk={setOk} getCredentials={getCredentials} />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <LoginForm setOk={setOk} setCredentials={setCredentials} setMFA={setMFA} />
                                    <p className="px-8 text-center text-sm text-muted-foreground">
                                        <span
                                            onClick={handlePasswordReset}
                                            className="underline underline-offset-4 hover:text-primary cursor-pointer"
                                        >
                                            I forgot my password.
                                        </span>
                                        .
                                    </p>
                                </React.Fragment>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}