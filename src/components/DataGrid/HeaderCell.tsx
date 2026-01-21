import React from 'react';
import type { Column, RowData, SortDescriptor } from '../../types/types';

interface HeaderCellProps<T> {
    column: Column<T>;
    sort?: SortDescriptor;
    multiSort: boolean;
    onSort: (columnId: string, multi: boolean) => void;
    onPin: (columnId: string, pinned?: 'left' | 'right') => void;
    onResize: (columnId: string, e: React.MouseEvent) => void;
}

export function HeaderCell<T extends RowData>({
    column,
    sort,
    multiSort,
    onSort,
    onPin,
    onResize,
}: HeaderCellProps<T>) {
    return (
        <div
            key={column.id}
            role="columnheader"
            aria-sort={sort ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="group relative flex items-center px-grid-cell-x py-grid-cell-y border-r border-grid-border overflow-hidden text-ellipsis whitespace-nowrap bg-inherit select-none cursor-pointer focus:bg-grid-row-selected focus:ring-2 focus:ring-inset focus:ring-brand-primary outline-none"
            style={{
                width: `${column.width || 150}px`,
                flex: '0 0 auto',
                boxSizing: 'border-box'
            }}
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('.pin-action')) return;
                column.sortable !== false && onSort(column.id, e.shiftKey);
            }}
            tabIndex={0}
        >
            <span className="flex-1 overflow-hidden text-ellipsis mr-1">{column.header}</span>
            <div className={`flex items-center gap-1 transition-opacity ${column.pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                    className={`pin-action p-0.5 rounded hover:bg-gray-200 ${column.pinned === 'left' ? 'text-brand-primary' : 'text-gray-400'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPin(column.id, column.pinned === 'left' ? undefined : 'left');
                    }}
                    title="Pin Left"
                >
                    ⊶
                </button>
                <button
                    className={`pin-action p-0.5 rounded hover:bg-gray-200 ${column.pinned === 'right' ? 'text-brand-primary' : 'text-gray-400'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPin(column.id, column.pinned === 'right' ? undefined : 'right');
                    }}
                    title="Pin Right"
                >
                    ⊷
                </button>
                {sort && (
                    <span className="text-xs text-brand-primary">
                        {sort.direction === 'asc' ? '↑' : '↓'}
                        {(multiSort) && <sub className="opacity-70">{sort.priority + 1}</sub>}
                    </span>
                )}
            </div>
            {column.resizable !== false && (
                <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => onResize(column.id, e)}
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </div>
    );
}
