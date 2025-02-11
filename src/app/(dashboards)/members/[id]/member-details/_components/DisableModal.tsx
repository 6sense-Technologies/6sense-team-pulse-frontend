import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface DisableModalProps {
  trigger: React.ReactNode;
}

const DisableModal: React.FC<DisableModalProps> = ({ trigger }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive text-[18px] font-semibold">Disable Member</AlertDialogTitle>
          <AlertDialogDescription className='text-sm text-inputFooterColor'>
          This action will temporarily disable the member. You can enable them later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='bg-white text-black hover:bg-white'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-destructive text-white hover:bg-destructive'>Disable</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisableModal;