import React, {useRef} from "react"

import { cn } from "@/lib/utils"

import {LuLoader2} from 'react-icons/lu';

import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { Input } from "@components/ui/input"
import useLoginMFA from "@hooks/user/useLoginMFA";

import { UserCredentials } from "@pages/user/UserLoginPage";

interface OTPFormProps extends React.HTMLAttributes<HTMLDivElement> { 
    getCredentials: UserCredentials;
    setOk: React.Dispatch<React.SetStateAction<boolean>>;
 }

export function OTPForm({ className, getCredentials, setOk, ...props }: OTPFormProps) {
    
    const loginQuery = useLoginMFA();
    
    const otpRef = useRef<HTMLInputElement | null>(null);

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()

        const otp = otpRef.current?.value || '';
        const {username, password} = getCredentials;

        if (otp) {
            try {
                const response = await loginQuery.mutateAsync({ otp, username, password});
                if (response.success) {
                    setOk(true);
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
                        <Label className="sr-only" htmlFor="otp">
                            OTP
                        </Label>
                        <Input
                            id="otp"
                            placeholder="....."
                            type="number"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={loginQuery.isLoading}
                            ref={otpRef}
                        />
                    </div>
                    <Button disabled={loginQuery.isLoading}>
                        {loginQuery.isLoading && (
                            <LuLoader2 className="animate-spin mr-2 h-4 w-4" />
                        )}
                        Validate
                    </Button>
                </div>
            </form>
            {loginQuery.isError && <p className="text-red-500 text-center">{loginQuery.error?.message}</p>}
        </div>
    )
}