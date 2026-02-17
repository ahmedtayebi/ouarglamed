// PATH: src/hooks/useTheme.js

import { useEffect } from 'react';
import useAppStore from '@store/useAppStore';

/**
 * Custom hook for theme management.
 * Reads from Zustand store and applies the dark class to <html>.
 * @returns {{ theme: string, toggleTheme: Function }}
 */
const useTheme = () => {
    const theme = useAppStore((state) => state.theme);
    const toggleTheme = useAppStore((state) => state.toggleTheme);
    const initTheme = useAppStore((state) => state.initTheme);

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return { theme, toggleTheme };
};

export default useTheme;
