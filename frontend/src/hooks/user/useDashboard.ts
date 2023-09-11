import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';

export interface Board {
    _id: string;
    title: string;
    description: string;
    updatedAt: Date;
}

interface RecentBoard {
    boardName: string;
    createdBy: string;
    boardId: string;
    timestamp: Date;
}

type SuccessResponse = {
    success: true;
    data: {
        boards: Board[],
        recentBoards: RecentBoard[]
    }
}

type ErrorResponse = {
    success: false;
    message: string;
}

/**
 * Custom hook to fetch dashboard data.
 * @returns  The result of the dashboard query.
 */
const useDashboard = () => {
    const dashboardQuery = useQuery<SuccessResponse['data'], Error>(['dasboard'], async () => {

        const response = await fetch(API_ROUTES.DASHBOARD.GET);
        const userData = await response.json() as SuccessResponse | ErrorResponse;

        if (userData.success) {
            return userData.data;
        } else {
            throw new Error(userData.message);
        }
    });

    return dashboardQuery;
};

export default useDashboard;