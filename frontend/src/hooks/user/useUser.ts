import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { getUser, removeUser, saveUser } from '@/lib/dataStorage';

interface Board {
    _id: string;
    title: string;
}

/**
 * Represents a user's data.
 */
export interface User {
    _id: string;
    name?: string;
    username: string;
    email: string;
    premium: boolean;
    preferences: {
        emailNotifications: boolean;
        mfa: boolean;
    };
    boards: Board[];
}

/**
 * Custom hook to fetch and manage user data.
 * @returns  The result of the user query.
 */
const useUser = () => {
    const userQuery = useQuery<User, Error>(['user'], async () => {

        const response = await fetch(API_ROUTES.GET_USER);

        if (!response.ok) {
            throw new Error('Unable to fetch user data');
        }

        const userData = await response.json() as User;

        return userData;
    }, {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,

        // Load the initial data from localStorage
        initialData: getUser,
        onError: () => {
            removeUser();
        }
    });

    // Save or remove user data based on query results.
    useEffect(() => {
        if (!userQuery.data) {
            removeUser();
        } else {
            saveUser(userQuery.data);
        }
    }, [userQuery.data]);

    return userQuery;
};

export default useUser;