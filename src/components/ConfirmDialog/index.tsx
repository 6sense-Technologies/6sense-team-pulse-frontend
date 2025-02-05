
import React from 'react';
import { Button } from '../ButtonComponent';

interface IConfirmDialogProps {
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children?: React.ReactNode;
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({ isLoading, isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    const handleCloseDialog = (): void => {
        onClose();
    };

    const handleConfirmDelete = (): void => {
        onConfirm();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleCloseDialog}>
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow" onClick={(e) => { e.stopPropagation(); }}>
                <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                    onClick={handleCloseDialog}
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 className="mb-5 text-sm font-normal text-gray-500">{title}</h3>
                    {children}
                    <div className='flex gap-4 justify-center mt-2'>
                        <Button onClick={handleCloseDialog} variant={"outline"} className="font-normal focus:outline-[0px]">No, Cancel</Button>

                        <Button loading={isLoading} onClick={handleConfirmDelete} variant={"destructive"} className="focus:outline-[0px] w-[108px]">{!isLoading && "Yes, I'm sure"}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
