import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-[600px] rounded-lg bg-white shadow-lg'>
        <div className='flex justify-between px-4 pt-2'>
          <h2 className='text-lg font-semibold'>Video Tutorial</h2>
          <button onClick={onClose} className='text-black'>
            <X size={18} />
          </button>
        </div>
        <div className='px-4 pb-4'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
