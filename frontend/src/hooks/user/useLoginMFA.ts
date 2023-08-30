import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { SuccessResponse, LoginResponse} from './useLogin';

/** Parameters required for multi-factor authentication operation. */
interface MFALoginParams {
    otp: string;
    username: string;
    password: string;
}

/**
 * A custom hook for handling user login (w/ MFA).
 * 
 * @returns An object containing the mfaLoginMutation function that triggers the login process.
 */
const useLoginMFA = () => {
    const queryClient = useQueryClient();

    const mfaLoginMutation = useMutation<SuccessResponse, Error, MFALoginParams>(
        async ({ otp, username, password }) => {
            
            const response = await fetch(API_ROUTES.POST_LOGIN_USER_MFA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp, username, password }),
            });

            const data = await response.json() as LoginResponse;
            if (!data.success) {
                throw new Error(data.message);
            } else {
                return data;
            }
        },
        {
            onSuccess: (user) => {
                queryClient.setQueryData(['user'], user.user);
            }
        }
    );

    return mfaLoginMutation;
};

export default useLoginMFA;