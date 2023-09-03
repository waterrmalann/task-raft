import { API_ROUTES } from '@constants/routes';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ErrorResponse {
    success: false;
    message: string;
    stack?: string;
}

interface SuccessResponse {
    success: true;
    message: string;
}

type GenericResponse = ErrorResponse | SuccessResponse;

interface Collaborator {
    user: string; // Assuming the user is identified by a string (e.g., user's ID)
    active: boolean;
    role: "EDITOR" | "GUEST";
}

interface Board {
    _id: string; // Assuming the board has an ID
    title: string;
    description?: string | null; // Description is optional and can be null
    visibility: "PUBLIC" | "PRIVATE";
    createdBy: string; // Assuming the user is identified by a string (e.g., user's ID)
    collaborators: Collaborator[];
    createdAt: Date;
    updatedAt: Date;
}

type GetBoardResponse = { success: true; data: Board } | ErrorResponse;

// --
interface EditBoardParams {
    title?: string;
    description?: string;
    visibility?: string;
}

interface EditCollaboratorParams {
    collaboratorId: string;
    data: {
        role: string;
    }
}

interface InviteCollaboratorParams {
    userId: string;
    role: string;
}

interface AddListParams {
    columnId: string;
    title: string;
}

interface EditListParams {
    listId: string;
    data: {
        title: string;
    }
}

interface AddCardParams {
    title: string;
    taskId: string;
    columnId: string;
}

interface EditCardParams {
    cardId: string;
    data: {
        title: string;
        description: string;
    }
}

/**
 * A custom hook for handling and managing boards.
 * 
 * @param {String} boardId
 * @returns An object containing the loginMutation function that triggers the login process.
 */
const useBoard = (boardId: string) => {

    const queryKey = ['board', boardId];

    const getBoardQuery = useQuery<Board, Error>(
        queryKey,
        async () => {
            // Fetch the board data based on the boardId
            const response = await fetch(API_ROUTES.BOARD.GET(boardId));
            const data = await response.json() as GetBoardResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data.data;
        }
    );

    const editBoardMutation = useMutation<SuccessResponse, Error, EditBoardParams>(
        async (body) => {
            // Send a request to edit the board data
            const response = await fetch(API_ROUTES.BOARD.PATCH(boardId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json() as GenericResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        }
    );

    const deleteBoardMutation = useMutation<SuccessResponse, Error, void>(
        async () => {
            // Send a request to delete the board.
            const response = await fetch(API_ROUTES.BOARD.DELETE(boardId), {
                method: 'DELETE'
            });
            const data = await response.json() as GenericResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        }
    );

    const inviteCollaboratorMutation = useMutation<SuccessResponse, Error, InviteCollaboratorParams>(
        async (data) => {

            const response = await fetch(API_ROUTES.COLLABORATOR.GENERATE_POST(boardId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const verifyCollaboratorQuery = useQuery<SuccessResponse, Error>(['collaboratorInvite'], async () => {

        const response = await fetch(API_ROUTES.COLLABORATOR.INVITE_GET(boardId));
        
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

    const editCollaboratorMutation = useMutation<SuccessResponse, Error, EditCollaboratorParams>(
        async ({collaboratorId, data}) => {

            const response = await fetch(API_ROUTES.COLLABORATOR.PATCH(boardId, collaboratorId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const removeCollaboratorMutation =  useMutation<SuccessResponse, Error, string>(
        async (collaboratorId) => {
            // Send a request to delete the board.
            const response = await fetch(API_ROUTES.COLLABORATOR.DELETE(boardId, collaboratorId), {
                method: 'DELETE'
            });
            const data = await response.json() as GenericResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        }
    );

    const addListMutation = useMutation<SuccessResponse, Error, AddListParams>(
        async (data) => {

            const response = await fetch(API_ROUTES.LIST.POST(boardId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const editListMutation = useMutation<SuccessResponse, Error, EditListParams>(
        async ({listId, data}) => {

            const response = await fetch(API_ROUTES.LIST.PATCH(boardId, listId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const deleteListMutation = useMutation<SuccessResponse, Error, string>(
        async (listId) => {
            const response = await fetch(API_ROUTES.LIST.DELETE(boardId, listId), {
                method: 'DELETE'
            });
            const data = await response.json() as GenericResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        }
    );

    const addCardMutation = useMutation<SuccessResponse, Error, AddCardParams>(
        async (data) => {

            const response = await fetch(API_ROUTES.CARD.POST(boardId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const editCardMutation = useMutation<SuccessResponse, Error, EditCardParams>(
        async ({cardId, data}) => {

            const response = await fetch(API_ROUTES.CARD.PATCH(boardId, cardId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const res = await response.json() as GenericResponse;
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
    );

    const deleteCardMutation = useMutation<SuccessResponse, Error, string>(
        async (cardId) => {
            // Send a request to delete a card.
            const response = await fetch(API_ROUTES.CARD.DELETE(boardId, cardId), {
                method: 'DELETE'
            });
            const data = await response.json() as GenericResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        }
    );

    return {
        getBoardQuery,
        editBoardMutation,
        deleteBoardMutation,

        verifyCollaboratorQuery,
        inviteCollaboratorMutation,
        editCollaboratorMutation,
        removeCollaboratorMutation,

        addListMutation,
        editListMutation,
        deleteListMutation,

        addCardMutation,
        editCardMutation,
        deleteCardMutation,
    }
}

export default useBoard;