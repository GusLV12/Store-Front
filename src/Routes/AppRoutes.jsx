import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CreateProduct, EditProducts, Products } from '@/Views/products';

import { MainLayout } from '../Layouts';
import { Billing, Counts, Credits, Home, Login, Profile, Promotion, Reports, Suppliers } from '../Views';
import { AuthProvider, ProtectedRoute } from '../Context';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<ProtectedRoute allowedRole={['user','admin']}><Home /></ProtectedRoute>}/>
            <Route path="/suppliers" element={<ProtectedRoute allowedRole={['user', 'admin']}><Suppliers/></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute allowedRole={['user', 'admin']}><Credits/></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRole={['admin']}><Reports/></ProtectedRoute>}/>
            <Route path="/counts" element={<ProtectedRoute allowedRole={['admin']}><Counts/></ProtectedRoute>}/>
            <Route path="/billing" element={<ProtectedRoute allowedRole={['admin','user']}><Billing/></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRole={['admin','user']}><Profile/></ProtectedRoute>} />
            <Route path="/promotions" element={<ProtectedRoute allowedRole={['admin']}><Promotion/></ProtectedRoute>} />

            {/* Vistas Prodcuts */}
            <Route path="/products" element={<ProtectedRoute allowedRole={['admin']}><Products /></ProtectedRoute>} />
            <Route path="/products/create" element={<ProtectedRoute allowedRole={['admin']}><CreateProduct /></ProtectedRoute>} />
            <Route path="/products/edit/:id" element={<ProtectedRoute allowedRole={['admin']}><EditProducts /></ProtectedRoute>} />
          </Route>

          {/* Rutas sin Navbar y Footer */}
          <Route path="/login" element={<Login />} />

          {/* Página 404 (si la ruta no existe) */}
          <Route path="*" element={<h1 className="text-center text-3xl">404 - Página no encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
