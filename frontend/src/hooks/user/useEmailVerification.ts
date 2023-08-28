import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';

export enum VerificationType {
    VerifyEmail = 'verify_email',
    PasswordReset = 'password_reset'
}

interface VerificationParams {
    token: string;
    type: VerificationType;
}

export interface VerificationResponse {
    success: boolean;
    message: string;
}

const useEmailVerification = (verificationCode: string) => {
    const verifyMutation = useMutation<VerificationResponse, Error, VerificationParams>(
        async ({ token, type }) => {
            const response = await fetch(API_ROUTES.POST_VERIFY_EMAIL + verificationCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, type }),
            });

            const data = await response.json() as VerificationResponse;
            if (!data.success) {
                throw new Error(data.message);
            } else {
                return data;
            }
        }
    );

    return verifyMutation;
};

export default useEmailVerification;