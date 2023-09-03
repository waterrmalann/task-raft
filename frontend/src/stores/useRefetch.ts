import {create} from 'zustand';

interface RefetchState {
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

export const useRefetch = create<RefetchState>()((set) => ({
    isEnabled: false,
    setEnabled: (enabled: boolean) => set({ isEnabled: enabled }),
}));