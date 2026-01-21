import React from 'react';
import type { Column, RowData, SortDescriptor } from '../../types/types';
import { HeaderCell } from './HeaderCell';

interface GridHeaderProps<T> {
    leftPinned: Column<T>[];
    rightPinned: Column<T>[];
    scrollable: Column<T>[];
    headerHeight: number;
    sortModel: SortDescriptor[];
    onSort: (columnId: string, multi: boolean) => void;
    onPin: (columnId: string, pinned?: 'left' | 'right') => void;
    onResize: (columnId: string, e: React.MouseEvent) => void;
    scrollbarWidth: number;
}

export function GridHeader<T extends RowData>({
    leftPinned,
    rightPinned,
    scrollable,
    headerHeight,
    sortModel,
    onSort,
    onPin,
    onResize,
    scrollbarWidth,
}: GridHeaderProps<T>) {
    const renderCell = (column: Column<T>) => (
        <HeaderCell
            key={column.id}
            column={column}
            sort={sortModel.find((s: any) => s.columnId === column.id)}
            multiSort={sortModel.length > 1}
            onSort={onSort}
            onPin={onPin}
            onResize={onResize}
        />
    );

    return (
        <div
            role="rowgroup"
            className="flex sticky top-0 z-30 bg-grid-header-bg border-b-2 border-grid-border font-semibold overflow-hidden"
            style={{ height: `${headerHeight}px` }}
        >
            <div role="row" className="flex w-full">
                <div role="presentation" className="flex flex-shrink-0 sticky left-0 z-40 bg-grid-header-bg border-r border-grid-border shadow-md">
                    {leftPinned.map(renderCell)}
                </div>

                <div
                    role="presentation"
                    className="flex flex-1"
                >
                    {scrollable.map(renderCell)}
                </div>

                <div
                    role="presentation"
                    className="flex flex-shrink-0 sticky z-40 bg-grid-header-bg border-l border-grid-border shadow-md"
                    style={{ right: `${scrollbarWidth}px` }}
                >
                    {rightPinned.map(renderCell)}
                </div>
                {scrollbarWidth > 0 && <div role="presentation" style={{ width: scrollbarWidth, flexShrink: 0 }} className="bg-grid-header-bg border-l border-grid-border" />}
            </div>
        </div>
    );
}
