import {create} from 'zustand';

interface SidebarState {
    isOpen: boolean;
    toggle: (open: boolean) => void;
}

export const useSidebar = create<SidebarState>()((set) => ({
    isOpen: false,
    toggle: (open: boolean) => set({ isOpen: open }),
}));