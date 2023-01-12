import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useIdeaStore = create(
    persist(
        (set, get) => ({
            user: null,
            setUser: (newUser) => set({ user: newUser }),
        }),
        { name: 'ideas' }
    )
)