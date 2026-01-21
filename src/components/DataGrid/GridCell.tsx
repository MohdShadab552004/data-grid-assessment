import type { Column, RowData } from '../../types/types';

interface GridCellProps<T> {
    col: Column<T>;
    row: T;
    rowIndex: number;
    isEditing?: boolean;
    isFocused?: boolean;
    error?: string;
    editValue?: any;
    onEditChange: (val: any) => void;
    onEditCommit: () => void;
    onFocus: () => void;
    onStartEdit: () => void;
    onResize?: (columnId: string, e: React.MouseEvent) => void;
}

export function GridCell<T extends RowData>({
    col, row, rowIndex, isEditing, isFocused, error, editValue, onEditChange, onEditCommit, onFocus, onStartEdit, onResize
}: GridCellProps<T>) {
    const content = col.cellRenderer
        ? col.cellRenderer({ value: row[col.id], row, column: col, rowIndex })
        : String(row[col.id] ?? '');

    return (
        <div
            role="gridcell"
            onClick={onFocus}
            onDoubleClick={onStartEdit}
            className={`flex items-center px-grid-cell-x py-grid-cell-y border-r border-grid-border last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap bg-inherit relative ${isFocused ? 'ring-2 ring-inset ring-brand-primary bg-brand-primary/5 z-20 shadow-[0_0_0_1px_inset_rgba(59,130,246,0.5)]' : ''} ${error ? 'bg-red-50 ring-1 ring-red-500' : ''}`}
            style={{ width: col.width || 150, flexShrink: 0 }}
        >
            {isEditing ? (
                <input
                    autoFocus
                    className="absolute inset-0 w-full h-full px-grid-cell-x py-grid-cell-y border-none outline-none bg-white z-30"
                    value={editValue ?? ''}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onEditCommit}
                />
            ) : (
                <span className="flex-1 overflow-hidden text-ellipsis">
                    {content}
                </span>
            )}
            {error && (
                <div className="absolute top-full left-0 bg-red-600 text-white text-[10px] px-1 rounded z-40 pointer-events-none">
                    {error}
                </div>
            )}
            {col.resizable !== false && onResize && (
                <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-brand-primary opacity-0 group-hover:opacity-50 transition-opacity z-10"
                    onMouseDown={(e) => onResize(col.id, e)}
                    onClick={(e) => e.stopPropagation()}
                />
            )}
        </div>
    );
}
