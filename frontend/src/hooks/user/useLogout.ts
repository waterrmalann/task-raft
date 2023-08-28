import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES  } from '@constants/routes';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@components/ui/use-toast';
import { removeUser } from '@/lib/dataStorage';

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {toast} = useToast();

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
        removeUser();
        toast({title: "Logged out successfully."});
        navigate('/login', {replace: true});
      },
    }
  );

  return logoutMutation;
};

export default useLogout;
