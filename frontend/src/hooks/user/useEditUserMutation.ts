import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useToast } from '@components/ui/use-toast';

interface Preferences {
    emailNotifications?: boolean;
    mfa?: boolean;
}

interface EditUserData {
    name?: string;
    username?: string;
    email?: string;
    preferences?: Preferences; // Use the Preferences interface
}

interface EditUserDataResponse {
    success: boolean;
    message: string;
}

export const useEditUserMutation = () => {
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
                console.log(responseData);
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
                queryClient.invalidateQueries(['user']);
            }
        }
    );

    return editUserMutation;
};