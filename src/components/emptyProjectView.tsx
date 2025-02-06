import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ButtonComponent';
import { FolderPlus } from 'lucide-react';
import FolderOpen from "../../public/logo/folderopen.png";

const EmptyProjectView = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-[200px]">
      <div className='flex flex-col items-center justify-center text-center pt-1'>
      <span>
        <Image src={FolderOpen} alt="folderopen-Icon" />
      </span>
      <p className="text-deepBlackColor mt-1 text-[16px] font-medium">No Projects Added</p>
      <p className="text-sm text-inputFooterColor pt-1">Get started by creating a new project.</p>
      </div>
      <Link href={`/projects/create`}>
        <Button className="mt-4">
          <FolderPlus size={16} className="mr-1" />
          Create Project
        </Button>
      </Link>
    </div>
  );
};

export default EmptyProjectView;