import { CartProvider } from './Context/CartContext/CartContext';
import { ListProductProvider } from './Context/ListProductContext/ListProductContext';
import { GlobalModalRenderer } from './Context/ModalContext/GlobalModalRenderer';
import { ModalProvider } from './Context/ModalContext/ModalContext';
import { AppRoutes } from './Routes/AppRoutes';

export const App = () => {

  return (
    <>
      <ListProductProvider>
        <CartProvider>
          <ModalProvider>
            <AppRoutes />
            <GlobalModalRenderer />
          </ModalProvider>
        </CartProvider>
      </ListProductProvider>
    </>
  );
};
