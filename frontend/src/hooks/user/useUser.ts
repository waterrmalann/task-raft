import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '@constants/routes';
import { getUser, removeUser, saveUser } from '@/lib/dataStorage';

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
}

const useUser = () => {
    const userQuery = useQuery<User, Error>(['user'], async () => {
        const response = await fetch(API_ROUTES.GET_USER);
        if (!response.ok) {
            throw new Error('Unable to fetch user data');
        }
        const userData: User = await response.json();
        return userData;
    }, {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        initialData: getUser,
        onError: () => {
            removeUser();
        }
    });

    useEffect(() => {
        if (!userQuery.data) removeUser();
        else saveUser(userQuery.data);
    }, [userQuery.data]);

    return userQuery;
};

export default useUser;
