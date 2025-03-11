import { BaseInput } from '@/components/BaseInput';
import React, { FC, useState } from 'react';
import ProjectDropdown from './projectDropdown';
import { Info } from 'lucide-react';
import Modal from '@/components/customModal';
import { Button } from '@/components/ButtonComponent';

type WorkInfoAreaProps = {
  control: any;
  errors: any;
};

const WorkInfoArea: FC<WorkInfoAreaProps> = ({ control, errors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const getVideoUrl = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'jira':
        return 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4';
      case 'trello':
        return 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4';
      case 'github':
        return 'https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4';
      default:
        return '';
    }
  };

  const handleShieldQuestionClick = (toolName: string): void => {
    setSelectedTool(toolName);
    setIsModalOpen(true);
  };

  return (
    <div className='flex w-full max-w-[872px] flex-col items-start pt-8 lg:flex-row lg:gap-x-[220px] lg:pt-12'>
      <div className='pl-[6px] pt-4 lg:pt-0'>
        <h1 className='text-[16px] font-semibold lg:text-headingXXS'>
          Work Info
        </h1>
      </div>
      <div className='w-full max-w-[420px]'>
        <div className='w-full max-w-[553px] pt-4 lg:pl-0 lg:pt-0'>
          <ProjectDropdown
            control={control}
            name='projects'
            placeholder='Select'
            errors={errors.tools?.[0]?.toolName?.message}
            index={0}
          />
        </div>
        <div className='w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8'>
          <label htmlFor='jiraId' className='text-sm font-medium text-black'>
            Jira <span className='text-[10px] text-subHeading'>(Optional)</span>
          </label>
          <div className='flex items-center gap-2'>
            <BaseInput
              control={control}
              name='jiraId'
              type='text'
              placeholder='Jira'
              className='mt-[4px] w-full placeholder:text-subHeading'
              additionalText='Enter the Jira Account ID'
              errors={errors}
              errorclassName='mt-1'
            />
            <div className='relative mt-1 h-9 w-10'>
              <Info
                size={16}
                className='absolute right-[6px] top-3 ml-2 cursor-pointer'
                onClick={() => handleShieldQuestionClick('jira')}
              />
            </div>
          </div>
        </div>
        <div className='w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8'>
          <label htmlFor='trelloId' className='text-sm font-medium text-black'>
            Trello ID
            <span className='text-[10px] text-subHeading'>(Optional)</span>
          </label>
          <div className='flex items-center gap-2'>
            <BaseInput
              control={control}
              name='trelloId'
              type='text'
              placeholder='Trello ID'
              className='mt-[4px] w-full placeholder:text-subHeading'
              additionalText='Enter the Trello Account ID'
              errors={errors}
              errorclassName='mt-1'
            />
            <div className='relative mt-1 h-9 w-10'>
              <Info
                size={16}
                className='absolute right-[6px] top-3 ml-2 cursor-pointer'
                onClick={() => handleShieldQuestionClick('trello')}
              />
            </div>
          </div>
        </div>
        <div className='w-full max-w-[553px] pl-2 pt-8 lg:pl-0 lg:pt-8'>
          <label
            htmlFor='githubUserName'
            className='text-sm font-medium text-black'
          >
            GitHub Username
            <span className='text-[10px] text-subHeading'>(Optional)</span>
          </label>
          <div className='flex items-center gap-2'>
            <BaseInput
              control={control}
              name='githubUserName'
              type='text'
              placeholder='GitHub Username'
              className='mt-[4px] w-full placeholder:text-subHeading'
              additionalText='Enter the GitHub Account Name'
              errors={errors}
              errorclassName='mt-1'
            />
            <div className='relative mt-1 h-9 w-10'>
              <Info
                size={16}
                className='absolute right-[6px] top-3 ml-2 cursor-pointer'
                onClick={() => handleShieldQuestionClick('github')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for video */}
      {isModalOpen && (
        <Modal toolName={selectedTool}>
          <div>
            <video controls className='mt-4 w-full'>
              <source src={getVideoUrl(selectedTool || '')} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
            <div className='mb-3 mt-8 flex lg:justify-end w-full mx-auto'>
              <Button
                variant='lightex'
                size='xsExtended'
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WorkInfoArea;
