import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
// import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"


interface RegisterResponse {
    success: boolean;
    message: string;
}

interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

const useRegister = () => {
    // const navigate = useNavigate();
    const { toast } = useToast();

    const registerMutation = useMutation<RegisterResponse, Error, RegisterParams>(
        async ({ username, email, password }) => {
            const response = await fetch(API_ROUTES.POST_REGISTER_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json() as RegisterResponse;
            if (!data.success) {
                throw new Error(data.message);
            } else {
                return data;
            }
        },
        {
            onSuccess: () => {
                // navigate('/login');
                toast({
                    title: "Success!",
                    description: "Your account has been registered successfully.",
                })
            }
        }
    );

    return registerMutation;
};

export default useRegister;