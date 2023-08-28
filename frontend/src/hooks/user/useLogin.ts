import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useNavigate } from 'react-router-dom';

interface SuccessResponse {
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

interface ErrorResponse {
    success: false;
    message: string;
}

type LoginResponse = SuccessResponse | ErrorResponse;

interface LoginParams {
    username: string;
    password: string;
}

const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation<SuccessResponse["user"], Error, LoginParams>(
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
                return data.user;
            }
        },
        {
            onSuccess: (user) => {
                queryClient.setQueryData(['user'], user);
                navigate('/dash', {replace: true});
            }
        }
    );

    return loginMutation;
};

export default useLogin;