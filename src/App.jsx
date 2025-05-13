import { GlobalModalRenderer } from './Context/ModalContext/GlobalModalRenderer';
import { ModalProvider } from './Context/ModalContext/ModalContext';
import { AppRoutes } from './Routes/AppRoutes';

export const App = () => {

  return (
    <>
      <ModalProvider>
        <AppRoutes />
        <GlobalModalRenderer />
      </ModalProvider>
    </>
  );
};
