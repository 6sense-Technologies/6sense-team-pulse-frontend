import React from 'react';

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  toolName: string | null;
}

const capitalizeFirstLetter = (string: string | null) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Modal: React.FC<ModalProps> = ({ children, toolName }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-[600px] rounded-lg bg-white shadow-lg'>
        <div className='flex justify-between px-4 pt-6'>
          <div className='flex items-center'>
            <h2 className='text-lg font-semibold'>Finding your workspace URL</h2>
            <span className='ml-2 bg-white text-black text-xs px-2.5 py-0.5 rounded-3xl border font-normal'>
              {capitalizeFirstLetter(toolName)}
            </span>
          </div>
        </div>
        <div className='px-4 pb-4'>
          <p className='mt-2 text-sm text-gray-600'>
            Follow these simple steps to locate your workspace URL quickly and easily.
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;