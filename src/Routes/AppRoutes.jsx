import { Route, Routes } from 'react-router-dom';

export const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Rutas sin Navbar y Footer */}
      {/* <Route path="/login" element={<Login />} /> */}

      {/* Página 404 (si la ruta no existe) */}
      {/* <Route path="*" element={<h1 className="text-center text-3xl">404 - Página no encontrada</h1>} /> */}
    </Routes>
  );
};
