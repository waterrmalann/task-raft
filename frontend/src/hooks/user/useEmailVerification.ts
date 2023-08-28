import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';

export interface VerificationResponse {
    success: boolean;
    message: string;
}

const useEmailVerification = (verificationCode: string, uid: string) => {
    const verifyQuery = useQuery<VerificationResponse, Error>(['emailVerification'], async () => {
        const response = await fetch(API_ROUTES.POST_VERIFY_EMAIL + `${verificationCode}?uid=${uid}`);
        const data = await response.json() as VerificationResponse;
        if (!data.success) {
            throw new Error(data.message);
        } else {
            return data;
        }
    });

    return verifyQuery;
};

export default useEmailVerification;