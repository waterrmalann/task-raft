import { User } from "@hooks/user/useUser";
import { STORAGE_KEYS } from "@constants/storage";

/**
 * Saves the user object to local storage.
 *
 * @param user - The user object to be saved.
 */
export function saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_QUERY, JSON.stringify(user));
}

/**
 * Retrieves the user object from local storage.
 *
 * @returns The user object if found, otherwise undefined.
 */
export function getUser(): User | undefined {
    const userJSON = localStorage.getItem(STORAGE_KEYS.USER_QUERY);
    return userJSON ? JSON.parse(userJSON) : undefined;
}

/**
 * Removes the user object from local storage.
 */
export function removeUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_QUERY);
}
