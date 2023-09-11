import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { GenericResponse } from './useBoard';

/**
 * Represents the response structure from the invitation API.
 */
export interface SuccessResponse {
    success: boolean;
    message: string;
}

/**
 * Custom hook for accepting collaborator requests.
 * 
 * This hook can accept collaborator requests to a board.
 * 
 * @param {String} boardId - The board id for which the invite was made.
 * @returns The result of the email verification query.
 */
const useInviteAccept = (boardId: string) => {
    const acceptInviteQuery = useQuery<SuccessResponse, Error>(['collaboratorInvite'], async () => {

        const response = await fetch(API_ROUTES.COLLABORATOR.ACCEPT_GET(boardId));

        const data = await response.json() as GenericResponse;
        if (!data.success) {
            throw new Error(data.message);
        } else {
            return data;
        }
    }, {
        refetchOnMount: false,
        refetchOnWindowFocus: false
    });

    return acceptInviteQuery;
};

export default useInviteAccept;