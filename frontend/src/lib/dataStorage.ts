import { User } from "@hooks/user/useUser";
import { STORAGE_KEYS } from "@constants/storage";

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER_QUERY, JSON.stringify(user));
}

export function getUser(): User | undefined {
  const user = localStorage.getItem(STORAGE_KEYS.USER_QUERY);
  return user ? JSON.parse(user) : undefined;
}

export function removeUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_QUERY);
}