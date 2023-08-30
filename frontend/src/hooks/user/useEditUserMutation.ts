import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useToast } from '@components/ui/use-toast';

/**
 * User preferences for notifications and multi-factor authentication.
 */
interface Preferences {
    emailNotifications?: boolean;
    mfa?: boolean;
}

/**
 * Data to be edited in the user's profile.
 */
interface EditUserData {
    name?: string;
    username?: string;
    email?: string;
    preferences?: Preferences;
}

/**
 * Response format after editing user data.
 */
interface EditUserDataResponse {
    success: boolean;
    message: string;
}

/**
 * Custom hook for handling the user profile editing mutation.
 *
 * @returns An object containing editUserMutation function to rigger the edit user mutation.
 */
const useEditUserMutation = () => {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const editUserMutation = useMutation<EditUserDataResponse, Error, EditUserData>(
        async (updatedUserData) => {

            try {
                const response = await fetch(API_ROUTES.PATCH_USER_PROFILE, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUserData),
                });
                
                const responseData = await response.json() as EditUserDataResponse;
                if (responseData.success) {
                    toast({title: "User Profile", description: responseData.message});
                } else {
                    toast({variant:"destructive", title: "Error", description: responseData.message});
                }

                return responseData;
            } catch (error) {
                throw new Error(`An error occurred: ${error}`);
            }
        },
        {
            onSuccess: () => {
                // Invalidate the 'user' query upon successful mutation.
                queryClient.invalidateQueries(['user']);
            }
        }
    );

    return editUserMutation;
};

export default useEditUserMutation;