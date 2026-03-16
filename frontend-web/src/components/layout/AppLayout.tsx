import { Outlet } from 'react-router-dom';
import { AppNavbar } from './AppNavbar';

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
      <AppNavbar />
      <main className="rounded-2xl bg-base-100 p-4 shadow-panel md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
