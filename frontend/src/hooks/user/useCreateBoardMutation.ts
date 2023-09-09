import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useToast } from '@components/ui/use-toast';

/**
 * Information for the new board.
 */
interface CreateBoardParams {
    title: string;
    description?: string | null;
    visibility: "PUBLIC" | "PRIVATE";
}

/**
 * Response format after creating board.
 */
interface CreateBoardSuccess {
    success: true;
    message: string;
    boardId: string;
}

interface ErrorResponse {
    success: false;
    message: string;
}

type CreateBoardResponse = CreateBoardSuccess | ErrorResponse;

/**
 * Custom hook for creating a new board.
 *
 * @returns An object containing createBoardMutation function to trigger the board creation mutation.
 */
const useCreateBoardMutation = () => {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const createBoardMutation = useMutation<CreateBoardResponse, Error, CreateBoardParams>(
        async (newBoardData) => {

            try {
                const response = await fetch(API_ROUTES.BOARD.POST, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBoardData),
                });
                
                const responseData = await response.json() as CreateBoardResponse;
                if (responseData.success) {
                    toast({title: "Board", description: responseData.message});
                } else {
                    toast({variant:"destructive", title: "Creation Error", description: responseData.message});
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

    return createBoardMutation;
};

export default useCreateBoardMutation;