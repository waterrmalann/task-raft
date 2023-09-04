import { API_ROUTES } from '@constants/routes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Column, Id, Task } from '@components/kanban/KanbanBoard';
import { useRefetch } from '@/stores/useRefetch';
interface ErrorResponse {
    success: false;
    message: string;
    stack?: string;
}

interface SuccessResponse {
    success: true;
    message: string;
}

export type GenericResponse = ErrorResponse | SuccessResponse;

interface Collaborator {
    user: string; // Assuming the user is identified by a string (e.g., user's ID)
    active: boolean;
    role: "EDITOR" | "GUEST";
}

interface Board {
    _id: string;
    title: string;
    description?: string | null; // Description is optional and can be null
    visibility: "PUBLIC" | "PRIVATE";
    createdBy: string;
    collaborators: Collaborator[];
    createdAt: Date;
    updatedAt: Date;
}

interface BoardData {
    board: Board;
    columns: Column[];
    tasks: Task[];
}

type GetBoardResponse = { success: true; data: BoardData } | ErrorResponse;


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
    userEmail: string;
    role: "EDITOR" | "VIEWER";
}

interface AddListParams {
    columnId: Id;
    title: string;
}

interface EditListParams {
    listId: Id;
    data: {
        title: string;
    }
}

interface AddCardParams {
    title: string;
    taskId: Id;
    columnId: Id;
}

interface EditCardParams {
    cardId: Id;
    data: {
        title: string;
        description?: string;
    }
}

/**
 * A custom hook for handling and managing boards.
 * 
 * @param {String} boardId
 * @returns An object containing the loginMutation function that triggers the login process.
 */
const useBoard = (boardId: string) => {
    const {isEnabled} = useRefetch();

    const queryKey = ['board', boardId];

    const getBoardQuery = useQuery<BoardData, Error>(
        queryKey,
        async () => {
            // Fetch the board data based on the boardId
            const response = await fetch(API_ROUTES.BOARD.GET(boardId));
            console.log("Requested.");
            const data = await response.json() as GetBoardResponse;
            if (!data.success) {
                throw new Error(data.message);
            }
            return data.data;
        }, {
            refetchInterval: 5000,
            staleTime: 5000,
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            enabled: isEnabled
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
                method: 'POST',
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
                method: 'POST',
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

    const deleteListMutation = useMutation<SuccessResponse, Error, Id>(
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
                method: 'POST',
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

    const deleteCardMutation = useMutation<SuccessResponse, Error, Id>(
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