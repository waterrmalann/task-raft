import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';

/**
 * Represents the response structure from the email verification API.
 */
export interface VerificationResponse {
    success: boolean;
    message: string;
}

/**
 * Custom hook for verification via email (for registration, password resets, etc...)
 * 
 * This hook performs an email verification by making a network request to the verification API.
 * 
 * @param verificationCode - The verification code received via email.
 * @param uid - The user's unique identifier.
 * @returns The result of the email verification query.
 */
const useEmailVerification = (verificationCode: string, uid: string) => {
    const verifyQuery = useQuery<VerificationResponse, Error>(['emailVerification'], async () => {

        const response = await fetch(API_ROUTES.POST_VERIFY_EMAIL + `${verificationCode}?uid=${uid}`);
        
        const data = await response.json() as VerificationResponse;
        if (!data.success) {
            throw new Error(data.message);
        } else {
            return data;
        }
    }, {
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });

    return verifyQuery;
};

export default useEmailVerification;