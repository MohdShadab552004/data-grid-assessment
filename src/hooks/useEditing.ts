import { useState, useCallback } from 'react';
import type { RowData } from '../types/types';

interface EditState {
    rowIndex: number;
    columnId: string;
    value: any;
    originalValue: any;
}

export function useEditing<T extends RowData>(
    data: T[],
    onUpdate: (data: T[]) => void,
    validate?: (columnId: string, value: any, row: T) => Promise<string | null> | string | null
) {
    const [editing, setEditing] = useState<EditState | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [history, setHistory] = useState<T[][]>([]);

    const startEdit = useCallback((rowIndex: number, columnId: string, value: any) => {
        setEditing({ rowIndex, columnId, value, originalValue: value });
        setErrors((prev) => {
            const { [`${rowIndex}-${columnId}`]: _, ...rest } = prev;
            return rest;
        });
    }, []);

    const commitEdit = useCallback(async () => {
        if (!editing) return;

        const { rowIndex, columnId, value, originalValue } = editing;
        if (value === originalValue) {
            setEditing(null);
            return;
        }

        // Optimistic Update
        const newData = [...data];
        const prevData = [...data];
        newData[rowIndex] = { ...newData[rowIndex]!, [columnId]: value };
        onUpdate(newData);
        setHistory((prev) => [...prev, prevData]);

        if (validate) {
            const error = await validate(columnId, value, newData[rowIndex]!);
            if (error) {
                setErrors((prev) => ({ ...prev, [`${rowIndex}-${columnId}`]: error }));
                // Rollback on error
                onUpdate(prevData);
            }
        }

        setEditing(null);
    }, [editing, data, onUpdate, validate]);

    const cancelEdit = useCallback(() => {
        setEditing(null);
    }, []);

    const undo = useCallback(() => {
        if (history.length === 0) return;
        const prev = history[history.length - 1]!;
        setHistory((h) => h.slice(0, -1));
        onUpdate(prev);
    }, [history, onUpdate]);

    return {
        editing,
        errors,
        startEdit,
        commitEdit,
        cancelEdit,
        setEditingValue: (value: any) => setEditing((prev) => prev ? { ...prev, value } : null),
        undo,
        canUndo: history.length > 0,
    };
}
