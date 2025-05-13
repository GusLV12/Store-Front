import { Modal, Box } from '@mui/material';

import { useModal } from '@/Context/ModalContext/ModalContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const GlobalModalRenderer = () => {
  const { modalOpen, modalContent, closeModal } = useModal();

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <Box sx={modalStyle}>
        {modalContent}
      </Box>
    </Modal>
  );
};
