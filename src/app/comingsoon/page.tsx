'use client';
import Image from 'next/image';
import React from 'react';
import ComingSoonLogo from "../../../public/logo/comingSoonLogo.svg";
import { Button } from '@/components/ButtonComponent';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='w-full bg-blackishBg min-h-screen flex flex-col'>
      <div className='pt-8 pl-[64px]'>
        <Button variant="blackWhite" size="md" onClick={handleGoBack}>
          <ArrowLeft size={16}/> Go Back
        </Button>
      </div>
      <div className='flex flex-col items-center justify-center flex-grow'>
        <div>
          <Image src={ComingSoonLogo} alt="logo" />
        </div>
        <p className='text-lightShadeWhiteColor text-2xl mt-4'>Coming Soon</p>
      </div>
    </div>
  );
};

export default Page;