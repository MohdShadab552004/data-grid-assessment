import { useState, useMemo, useCallback } from 'react';
import type { Column, RowData, SortDescriptor } from '../types/types';

export function useDataGridFeatures<T extends RowData>(
    initialColumns: Column<T>[],
    initialRows: T[]
) {
    const [columns, setColumns] = useState(initialColumns);
    const [sortModel, setSortModel] = useState<SortDescriptor[]>([]);

    // Sorting Logic
    const handleSort = useCallback((columnId: string, multi: boolean) => {
        setSortModel((prev) => {
            const existing = prev.find((s) => s.columnId === columnId);
            let nextDirection: 'asc' | 'desc' | null = 'asc';

            if (existing) {
                if (existing.direction === 'asc') nextDirection = 'desc';
                else if (existing.direction === 'desc') nextDirection = null;
            }

            if (!multi) {
                return nextDirection ? [{ columnId, direction: nextDirection, priority: 0 }] : [];
            }

            const filtered = prev.filter((s) => s.columnId !== columnId);
            if (!nextDirection) return filtered;

            return [...filtered, { columnId, direction: nextDirection, priority: filtered.length }];
        });
    }, []);

    const sortedRows = useMemo(() => {
        if (sortModel.length === 0) return initialRows;

        return [...initialRows].sort((a, b) => {
            for (const sort of sortModel) {
                const valA = a[sort.columnId];
                const valB = b[sort.columnId];

                if (valA === valB) continue;

                const multiplier = sort.direction === 'asc' ? 1 : -1;
                if (valA == null) return multiplier;
                if (valB == null) return -multiplier;

                return valA < valB ? -1 * multiplier : 1 * multiplier;
            }
            return 0;
        });
    }, [initialRows, sortModel]);

    // Resizing Logic
    const handleResize = useCallback((columnId: string, width: number) => {
        setColumns((prev) =>
            prev.map((col) => (col.id === columnId ? { ...col, width } : col))
        );
    }, []);

    const handlePin = useCallback((columnId: string, pinned?: 'left' | 'right') => {
        setColumns((prev) =>
            prev.map((col) => (col.id === columnId ? { ...col, pinned } : col))
        );
    }, []);

    return {
        columns,
        sortedRows,
        sortModel,
        handleSort,
        handleResize,
        handlePin,
    };
}
