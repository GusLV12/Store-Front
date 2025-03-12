import { Outlet } from 'react-router-dom';

import { Navbar } from '../../Components';
import { ThemeLayout } from '../themeLayout/themeLayout';

export const MainLayout = () => {
  return (
    <ThemeLayout>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    </ThemeLayout>
  );
};
