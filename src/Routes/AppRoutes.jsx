import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CreateProduct, EditProducts, Products } from '@/Views/products';
import { Suppliers, CreateSupplier, EditSupplier } from '@/Views/Suppliers';
import { CreateCount, EditCounts, Counts } from '@/Views/Counts';
import { CreateCredit, Credits, EditCredit, PayCredit } from '@/Views/Credits';

import { MainLayout } from '../Layouts';
import { Billing,  Home, Login, Profile, Promotion, Reports } from '../Views';
import { AuthProvider, ProtectedRoute } from '../Context';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<ProtectedRoute allowedRole={['user','admin']}><Home /></ProtectedRoute>}/>
            <Route path="/reports" element={<ProtectedRoute allowedRole={['admin']}><Reports/></ProtectedRoute>}/>

            {/*Vistas users*/}
            <Route path="/counts" element={<ProtectedRoute allowedRole={['admin']}><Counts/></ProtectedRoute>}/>
            <Route path="/counts/create" element={<ProtectedRoute allowedRole={['admin']}><CreateCount /></ProtectedRoute>} />
            <Route path="/counts/edit/:id" element={<ProtectedRoute allowedRole={['admin']}><EditCounts /></ProtectedRoute>} />

            <Route path="/billing" element={<ProtectedRoute allowedRole={['admin','user']}><Billing/></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRole={['admin','user']}><Profile/></ProtectedRoute>} />
            <Route path="/promotions" element={<ProtectedRoute allowedRole={['admin']}><Promotion/></ProtectedRoute>} />

            {/* Rutas de créditos */}
            <Route path="/credits" element={<ProtectedRoute allowedRole={['user', 'admin']}><Credits/></ProtectedRoute>} />
            <Route path="/credits/create" element={<ProtectedRoute allowedRole={['user', 'admin']}><CreateCredit /></ProtectedRoute>} />
            <Route path="/credits/edit/:id" element={<ProtectedRoute allowedRole={['user', 'admin']}><EditCredit /></ProtectedRoute>} />
            <Route path="/credits/pay" element={<ProtectedRoute allowedRole={['user', 'admin']}><PayCredit /></ProtectedRoute>} />

            {/* Vistas Products */}
            <Route path="/products" element={<ProtectedRoute allowedRole={['admin']}><Products /></ProtectedRoute>} />
            <Route path="/products/create" element={<ProtectedRoute allowedRole={['admin']}><CreateProduct /></ProtectedRoute>} />
            <Route path="/products/edit/:id" element={<ProtectedRoute allowedRole={['admin']}><EditProducts /></ProtectedRoute>} />

            {/* Rutas de proveedores */}
            <Route path="/suppliers" element={<ProtectedRoute allowedRole={['user', 'admin']}><Suppliers/></ProtectedRoute>} />
            <Route path="/suppliers/create" element={<ProtectedRoute allowedRole={['user', 'admin']}><CreateSupplier/></ProtectedRoute>} />
            <Route path="/suppliers/edit/:id" element={<ProtectedRoute allowedRole={['user', 'admin']}><EditSupplier/></ProtectedRoute>} />
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
