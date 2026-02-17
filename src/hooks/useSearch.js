// PATH: src/hooks/useSearch.js

import { useCallback } from 'react';
import useAppStore from '@store/useAppStore';

/**
 * Hook wrapping the Zustand search slice.
 * Search runs against all modules in academicData (new shape).
 */
const useSearch = () => {
    const query = useAppStore((s) => s.query);
    const results = useAppStore((s) => s.results);
    const setQuery = useAppStore((s) => s.setQuery);
    const clearSearch = useAppStore((s) => s.clearSearch);

    const handleSearch = useCallback(
        (q) => {
            setQuery(q);
        },
        [setQuery],
    );

    return { query, results, handleSearch, clearSearch };
};

export default useSearch;
