import type { Column, RowData } from '../../types/types';
import { useDataGrid } from '../../hooks/useDataGrid';
import { GridHeader } from './GridHeader';
import { GridCell } from './GridCell';

interface DataGridProps<T> {
    columns: Column<T>[];
    rows: T[];
    rowHeight?: number;
    headerHeight?: number;
    height?: number | string;
    onDataChange?: (rows: T[]) => void;
    validate?: (columnId: string, value: any, row: T) => Promise<string | null> | string | null;
}

export function DataGrid<T extends RowData>({
    columns: initialColumns,
    rows: initialRows,
    rowHeight = 40,
    headerHeight = 40,
    height = '600px',
    onDataChange,
    validate,
}: DataGridProps<T>) {
    const {
        sortedRows,
        sortModel,
        handleSort,
        handleResize,
        handlePin,
        editing,
        errors,
        startEdit,
        commitEdit,
        setEditingValue,
        canUndo,
        onScroll,
        containerRef,
        focusedCell,
        setFocusedCell,
        leftPinned,
        rightPinned,
        scrollable,
        totalWidth,
        virtualRows,
        totalContentHeight,
        handleKeyDown,
        scrollbarWidth,
    } = useDataGrid({
        initialColumns,
        initialRows,
        rowHeight,
        headerHeight,
        onDataChange,
        validate,
    });

    return (
        <div
            className="relative flex flex-col w-fit max-w-full min-w-0 border border-grid-border overflow-hidden bg-white text-sm text-slate-900 outline-none"
            style={{ height }}
        >
            <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 w-full overflow-auto relative focus:outline-none"
                role="grid"
                aria-rowcount={sortedRows.length}
                aria-colcount={initialColumns.length}
                aria-label="Data Grid"
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <GridHeader
                    leftPinned={leftPinned}
                    rightPinned={rightPinned}
                    scrollable={scrollable}
                    headerHeight={headerHeight}
                    sortModel={sortModel}
                    onSort={handleSort}
                    onPin={handlePin}
                    onResize={handleResize}
                    scrollbarWidth={scrollbarWidth}
                />
                <div
                    role="rowgroup"
                    style={{ height: `${totalContentHeight}px`, width: `${totalWidth}px`, position: 'relative' }}
                    className="min-w-full"
                >
                    {virtualRows.map((virtualRow) => (
                        <div
                            key={virtualRow.index}
                            role="row"
                            aria-rowindex={virtualRow.index + 1}
                            className="flex hover:bg-grid-row-hover border-b border-grid-border absolute top-0 left-0 group"
                            style={{
                                height: `${rowHeight}px`,
                                width: `${totalWidth}px`,
                                transform: `translateY(${virtualRow.offset}px)`,
                            }}
                        >
                            {[leftPinned, scrollable, rightPinned].map((group, gIdx) => (
                                <div
                                    key={gIdx}
                                    role="presentation"
                                    className={`flex ${gIdx === 0 ? 'sticky left-0 z-10 bg-white group-hover:bg-grid-row-hover border-r border-grid-border shadow-md flex-shrink-0' : gIdx === 2 ? 'sticky right-0 z-10 bg-white group-hover:bg-grid-row-hover border-l border-grid-border shadow-md flex-shrink-0' : ''}`}
                                >
                                    {group.map(col => {
                                        const isEditing = editing?.rowIndex === virtualRow.index && editing?.columnId === col.id;
                                        const isFocused = focusedCell?.rowIndex === virtualRow.index && focusedCell?.columnId === col.id;
                                        const error = errors[`${virtualRow.index}-${col.id}`];

                                        return (
                                            <GridCell
                                                key={col.id}
                                                col={col}
                                                row={sortedRows[virtualRow.index]!}
                                                rowIndex={virtualRow.index}
                                                isEditing={isEditing}
                                                isFocused={isFocused}
                                                error={error}
                                                editValue={editing?.value}
                                                onEditChange={setEditingValue}
                                                onEditCommit={commitEdit}
                                                onFocus={() => setFocusedCell({ rowIndex: virtualRow.index, columnId: col.id })}
                                                onStartEdit={() => col.editable !== false && startEdit(virtualRow.index, col.id, sortedRows[virtualRow.index]![col.id])}
                                                onResize={handleResize}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="sr-only" aria-live="polite">
                {focusedCell ? `Cell ${focusedCell.columnId} in row ${focusedCell.rowIndex + 1}` : 'No cell selected'}
                {canUndo && 'Undo available.'}
            </div>
        </div>
    );
}
