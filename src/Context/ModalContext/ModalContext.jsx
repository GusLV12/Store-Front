import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ modalOpen, modalContent, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal  = () => useContext(ModalContext);
