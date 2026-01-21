import type { StoryObj, Meta } from '@storybook/react';
import { DataGrid } from './DataGrid';
import type { Column, RowData } from '../../types/types';
import '../../index.css';

const meta: Meta<typeof DataGrid> = {
    title: 'Components/DataGrid',
    component: DataGrid,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        rows: { control: false },
        columns: { control: false },
    },
};

export default meta;

interface DemoRow extends RowData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const columns: Column<DemoRow>[] = [
    { id: 'id', header: 'ID', width: 90 },
    { id: 'name', header: 'Name', width: 200 },
    { id: 'email', header: 'Email', width: 250 },
    { id: 'role', header: 'Role', width: 150 },
    { id: 'status', header: 'Status', width: 120 },
];

const generateRows = (count: number): DemoRow[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'User',
        status: i % 2 === 0 ? 'Active' : 'Inactive',
    }));
};

export const LargeDataset: StoryObj<typeof DataGrid> = {
    args: {
        columns: columns as any,
        rows: generateRows(50000),
        height: '600px',
    },
};

export const PinnedColumns: StoryObj<typeof DataGrid> = {
    args: {
        columns: [
            { id: 'id', header: 'ID', width: 90, pinned: 'left' },
            { id: 'name', header: 'Name', width: 200, pinned: 'left' },
            { id: 'email', header: 'Email', width: 250 },
            { id: 'role', header: 'Role', width: 150 },
            { id: 'status', header: 'Status', width: 120, pinned: 'right' },
        ] as any,
        rows: generateRows(100),
        height: '400px',
    },
};
