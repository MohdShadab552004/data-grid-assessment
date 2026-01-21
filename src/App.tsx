import { DataGrid } from './components/DataGrid/DataGrid';
import type { Column } from './types/types';
import './App.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

function App() {
  const columns: Column<UserData>[] = [
    { id: 'id', header: 'ID', width: 80, pinned: 'left' },
    { id: 'name', header: 'Name', width: 200, pinned: 'left' },
    { id: 'email', header: 'Email', width: 250 },
    { id: 'role', header: 'Role', width: 150 },
    { id: 'status', header: 'Status', width: 150, pinned: 'right' },
  ];

  const rows: UserData[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : 'User',
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }));

  return (
    <div className="w-full h-screen bg-red-50">
      <header className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Advanced Data Grid - Main App</h1>
      </header>
      <main className="flex-1 p-8 overflow-hidden">
        <div className="h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <DataGrid
            columns={columns}
            rows={rows}
            height="200px"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
