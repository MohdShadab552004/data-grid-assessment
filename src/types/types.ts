import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortDescriptor {
    columnId: string;
    direction: SortDirection;
    priority: number;
}

export interface Column<T> {
    id: string;
    header: ReactNode;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    pinned?: 'left' | 'right';
    resizable?: boolean;
    sortable?: boolean;
    visible?: boolean;

    // Custom Renderers
    cellRenderer?: (params: CellParams<T>) => ReactNode;
    headerRenderer?: (params: HeaderParams<T>) => ReactNode;

    // Editing
    editable?: boolean;
    editorRenderer?: (params: EditParams<T>) => ReactNode;
    validator?: (value: any, row: T) => Promise<string | null> | string | null;
}

export interface CellParams<T> {
    value: any;
    row: T;
    column: Column<T>;
    rowIndex: number;
}

export interface HeaderParams<T> {
    column: Column<T>;
}

export interface EditParams<T> extends CellParams<T> {
    onCommit: (value: any) => void;
    onCancel: () => void;
}

export interface GridState {
    columnWidths: Record<string, number>;
    columnOrder: string[];
    pinnedColumns: string[];
    sortModel: SortDescriptor[];
    hiddenColumns: Set<string>;
}

export interface RowData {
    id: string | number;
    [key: string]: any;
}
