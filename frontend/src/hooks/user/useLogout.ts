import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@components/ui/use-toast';
import { removeUser } from '@/lib/dataStorage';

/**
 * Custom hook for handling user logout functionality.
 *
 * @returns An object containing the logoutMutation function that triggers the logout process.
 */
const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();

    const logoutMutation = useMutation<void, Error>(
        async () => {

            const response = await fetch(API_ROUTES.POST_LOGOUT_USER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
        },
        {
            onSuccess: () => {
                // Invalidate the 'user' query to clear the cache
                queryClient.invalidateQueries(['user']);
                // Clear the user from localStorage as well
                removeUser();

                toast({ title: "Logged out successfully." });

                // Navigate back to the login page.
                navigate('/login', { replace: true });
            },
        }
    );

    return logoutMutation;
};

export default useLogout;
