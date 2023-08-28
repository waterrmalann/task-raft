import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { EmailVerifier } from '@components/EmailVerifier';

export default function UserEmailVerificationPage() {
    return (
        <>
            <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
                <Link
                    to="/login"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Login
                </Link>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Email Verification
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Please wait while your email address is being verified.
                            </p>
                        </div>
                        <EmailVerifier />
                    </div>
                </div>
            </div>
        </>
    )
}