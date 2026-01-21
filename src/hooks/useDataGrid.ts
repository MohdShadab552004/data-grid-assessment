import { useMemo, useEffect, useState, useCallback } from 'react';
import type { Column, RowData } from '../types/types';
import { useScrollSync } from './useScrollSync';
import { useVirtualization } from './useVirtualization';
import { useDataGridFeatures } from './useDataGridFeatures';
import { useEditing } from './useEditing';

export interface UseDataGridParams<T> {
    initialColumns: Column<T>[];
    initialRows: T[];
    rowHeight: number;
    headerHeight: number;
    onDataChange?: (rows: T[]) => void;
    validate?: (columnId: string, value: any, row: T) => Promise<string | null> | string | null;
}

export function useDataGrid<T extends RowData>({
    initialColumns,
    initialRows,
    rowHeight,
    headerHeight,
    onDataChange,
    validate,
}: UseDataGridParams<T>) {
    const [data, setData] = useState(initialRows);
    const { scrollState, onScroll, containerRef } = useScrollSync();
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 600 });
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    const [focusedCell, setFocusedCell] = useState<{ rowIndex: number, columnId: string } | null>(null);

    const {
        columns,
        sortedRows,
        sortModel,
        handleSort,
        handleResize,
        handlePin,
    } = useDataGridFeatures(initialColumns, data);

    const {
        editing,
        errors,
        startEdit,
        commitEdit,
        cancelEdit,
        setEditingValue,
        undo,
        canUndo,
    } = useEditing(data, (newData) => {
        setData(newData);
        onDataChange?.(newData);
    }, validate);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === container) {
                    setContainerDimensions({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                    setScrollbarWidth(container.offsetWidth - container.clientWidth);
                }
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [containerRef]);

    const { leftPinned, rightPinned, scrollable, allColumnIds, totalWidth, leftPinnedWidth, rightPinnedWidth } = useMemo(() => {
        const lp: Column<T>[] = [];
        const rp: Column<T>[] = [];
        const sc: Column<T>[] = [];
        let lpw = 0;
        let rpw = 0;
        columns.forEach(col => {
            const w = col.width || 150;
            if (col.pinned === 'left') {
                lp.push(col);
                lpw += w;
            } else if (col.pinned === 'right') {
                rp.push(col);
                rpw += w;
            } else {
                sc.push(col);
            }
        });
        return {
            leftPinned: lp,
            rightPinned: rp,
            scrollable: sc,
            allColumnIds: [...lp, ...sc, ...rp].map(c => c.id),
            totalWidth: columns.reduce((acc, col) => acc + (col.width || 150), 0),
            leftPinnedWidth: lpw,
            rightPinnedWidth: rpw
        };
    }, [columns]);

    // Scroll Into View logic
    useEffect(() => {
        if (!focusedCell || !containerRef.current) return;

        const { rowIndex, columnId } = focusedCell;
        const container = containerRef.current;
        const col = columns.find(c => c.id === columnId);
        if (!col) return;

        // Vertical Scroll
        const targetTop = rowIndex * rowHeight;
        const viewportHeight = containerDimensions.height;
        const currentScrollTop = container.scrollTop;

        if (targetTop < currentScrollTop) {
            container.scrollTop = targetTop;
        } else if (targetTop + rowHeight > currentScrollTop + viewportHeight) {
            container.scrollTop = targetTop - viewportHeight + rowHeight;
        }

        // Horizontal Scroll (only for scrollable columns)
        if (!col.pinned) {
            let colLeft = 0;
            for (const c of scrollable) {
                if (c.id === columnId) break;
                colLeft += (c.width || 150);
            }

            const colWidth = col.width || 150;
            const currentScrollLeft = container.scrollLeft;
            const scrollableViewportWidth = containerDimensions.width - leftPinnedWidth - rightPinnedWidth;

            if (colLeft < currentScrollLeft) {
                container.scrollLeft = colLeft;
            } else if (colLeft + colWidth > currentScrollLeft + scrollableViewportWidth) {
                container.scrollLeft = colLeft - scrollableViewportWidth + colWidth;
            }
        }
    }, [focusedCell, columns, rowHeight, containerDimensions, leftPinnedWidth, rightPinnedWidth, scrollable]);

    const { items: virtualRows, totalSize: totalContentHeight } = useVirtualization({
        itemCount: sortedRows.length,
        itemSize: rowHeight,
        containerSize: containerDimensions.height - headerHeight,
        scrollOffset: scrollState.scrollTop,
    });

    const onColumnResize = useCallback((columnId: string, e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.pageX;
        const startWidth = columns.find(c => c.id === columnId)?.width || 150;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.pageX - startX;
            handleResize(columnId, Math.max(50, startWidth + delta));
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [columns, handleResize]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (editing) {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') cancelEdit();
            return;
        }

        if (!focusedCell) return;

        const { rowIndex, columnId } = focusedCell;
        const colIndex = allColumnIds.indexOf(columnId);

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                setFocusedCell({ rowIndex: Math.max(0, rowIndex - 1), columnId });
                break;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedCell({ rowIndex: Math.min(sortedRows.length - 1, rowIndex + 1), columnId });
                break;
            case 'ArrowLeft':
                e.preventDefault();
                setFocusedCell({ rowIndex, columnId: allColumnIds[Math.max(0, colIndex - 1)]! });
                break;
            case 'ArrowRight':
                e.preventDefault();
                setFocusedCell({ rowIndex, columnId: allColumnIds[Math.min(allColumnIds.length - 1, colIndex + 1)]! });
                break;
            case 'Enter':
                e.preventDefault();
                const col = columns.find(c => c.id === columnId);
                if (col?.editable !== false) {
                    startEdit(rowIndex, columnId, sortedRows[rowIndex]![columnId]);
                }
                break;
            case 'z':
            case 'Z':
                if ((e.ctrlKey || e.metaKey) || e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    undo();
                }
                break;
        }
    }, [focusedCell, allColumnIds, sortedRows, editing, commitEdit, cancelEdit, startEdit, undo, columns]);

    return {
        data,
        columns,
        sortedRows,
        sortModel,
        handleSort,
        handleResize: onColumnResize,
        handlePin,
        editing,
        errors,
        startEdit,
        commitEdit,
        cancelEdit,
        setEditingValue,
        undo,
        canUndo,
        scrollState,
        onScroll,
        containerRef,
        focusedCell,
        setFocusedCell,
        leftPinned,
        rightPinned,
        scrollable,
        allColumnIds,
        totalWidth,
        virtualRows,
        totalContentHeight,
        handleKeyDown,
        scrollbarWidth,
    };
}
