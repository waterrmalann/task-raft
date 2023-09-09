import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { useToast } from '@components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Information for the board.
 */
interface EditBoardParams {
    title?: string;
    description?: string;
    visibility?: string;
}

/**
 * Response format after creating board.
 */
interface EditBoardSuccess {
    success: true;
    message: string;
}

interface ErrorResponse {
    success: false;
    message: string;
}

type EditBoardResponse = EditBoardSuccess | ErrorResponse;

/**
 * Custom hook for editing an existing board.
 *
 * @returns An object containing editBoardMutation function to trigger the board edit mutation.
 */
const useEditBoardMutation = (boardId: string) => {
    const {toast} = useToast();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteBoard = useMutation<EditBoardResponse, Error, void>(
        async () => {
            try {
                const response = await fetch(API_ROUTES.BOARD.DELETE(boardId), {
                    method: 'DELETE'
                });

                const responseData = await response.json() as EditBoardResponse;
                if (responseData.success) {
                    toast({title: "Board", description: responseData.message});
                } else {
                    toast({variant:"destructive", title: "Deletion Error", description: responseData.message});
                }

                return responseData;
            } catch (error) {
                throw new Error(`An error occurred: ${error}`);
            }
        },
        {
            onSuccess: () => {
                navigate(`/dash`);
                // Invalidate the 'user' query upon successful mutation.
                queryClient.invalidateQueries(['user']);
            }
        }
    );

    const editBoard = useMutation<EditBoardResponse, Error, EditBoardParams>(
        async (newBoardData) => {

            try {
                const response = await fetch(API_ROUTES.BOARD.PATCH(boardId), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBoardData),
                });
                
                const responseData = await response.json() as EditBoardResponse;
                if (responseData.success) {
                    toast({title: "Board", description: responseData.message});
                } else {
                    toast({variant:"destructive", title: "Edit Error", description: responseData.message});
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

    return {editBoard, deleteBoard};
};

export default useEditBoardMutation;