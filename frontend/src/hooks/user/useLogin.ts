import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';

/**
 * Response from a successful login.
 */
export interface SuccessResponse {
    success: true;
    user: {
        _id: string;
        name?: string;
        username: string;
        email: string;
        premium: boolean;
        preferences: {
            emailNotifications: boolean;
            mfa: boolean;
        };
    };
}

/**
 * Response from a failed login attempt.
 */
interface ErrorResponse {
    success: false;
    message: string;
}

/** 
 * The possible responses from a login attempt. 
 */
export type LoginResponse = SuccessResponse | ErrorResponse;

/** Parameters required for the login operation. */
interface LoginParams {
    username: string;
    password: string;
}

/**
 * A custom hook for handling user login.
 * 
 * @returns An object containing the loginMutation function that triggers the login process.
 */
const useLogin = () => {
    const queryClient = useQueryClient();

    const loginMutation = useMutation<SuccessResponse, Error, LoginParams>(
        async ({ username, password }) => {

            const response = await fetch(API_ROUTES.POST_LOGIN_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
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
                // If the user has MFA, we shouldn't cache the data too early as they haven't authenticated fully.
                if (!user.user.preferences.mfa) {
                    // Update user data in the cache
                    queryClient.setQueryData(['user'], user.user);
                }
            }
        }
    );

    return loginMutation;
};

export default useLogin;