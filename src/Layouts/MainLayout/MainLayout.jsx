import { Outlet } from 'react-router-dom';

import { Navbar } from '../../Components';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">
        <Outlet />
      </main>

    </div>
  );
};
