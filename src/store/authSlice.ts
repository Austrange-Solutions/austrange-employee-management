import { TUser } from "@/models/user.model";
import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    user: TUser | null;
    // eslint-disable-next-line no-unused-vars
    updateUser?: (user: TUser) => void;
    logout?: () => void;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
}

const useAuthStore = create<AuthState>((set) => ({
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated,
    updateUser: (user: TUser) => set(() => ({
        user,
        isAuthenticated: true
    })),
    logout: () => set(() => initialState)
}));


export default useAuthStore;