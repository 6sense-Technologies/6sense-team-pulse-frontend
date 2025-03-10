'use client';
import { BaseInput } from '@/components/BaseInput';
import GlobalBreadCrumb from '@/components/globalBreadCrumb';
import PageHeading from '@/components/pageHeading';
import PageTitle from '@/components/PageTitle';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ButtonComponent';
import ToolDropdown from './_components/ToolDropdown';
import WorkspaceURL from './_components/WorkspaceURL';
import { Circle, ShieldQuestion, Trash2 } from 'lucide-react';
import { ProjectTools } from '@/types/Project.types';
import { useMutation } from '@tanstack/react-query';
import { CreateProject } from '../../../../../helpers/projects/projectApi';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import AvatarMenu from '@/components/AvatarMenu';
import { toast } from '@/hooks/use-toast';
import Modal from '@/components/customModal';

const ProjectCreate = () => {
  const router = useRouter();
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedTool, setSelectedTool] = useState<string | null>(null); // State to store selected tool
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<ProjectTools>({
    defaultValues: {
      tools: [{ toolName: '', toolUrl: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  });

  const handleAddtools = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    append({ toolName: '', toolUrl: '' });
  };

  const validateURL = (url: string) => {
    const urlRegex =
      /^https:\/\/((?!-)(?!.*--)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}(\/[^\s]*)?$/;
    return urlRegex.test(url);
  };

  const validate = (data: ProjectTools) => {
    let valid = true;
    if (!data.name) {
      setError('name', {
        type: 'manual',
        message: 'Project name is required.',
      });
      valid = false;
    } else {
      clearErrors('name');
    }

    data.tools.forEach((tool, index) => {
      if (index === 0) {
        // First pair is mandatory
        if (!tool.toolName) {
          setError(`tools.${index}.toolName`, {
            type: 'manual',
            message: 'Minimum one tool must be selected.',
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolName`);
        }

        if (!tool.toolUrl) {
          setError(`tools.${index}.toolUrl`, {
            type: 'manual',
            message: 'Workspace URL is required.',
          });
          valid = false;
        } else if (!validateURL(tool.toolUrl)) {
          setError(`tools.${index}.toolUrl`, {
            type: 'manual',
            message: 'Invalid URL.',
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolUrl`);
        }
      } else {
        // Subsequent pairs are optional but must be provided together
        if (tool.toolName && !tool.toolUrl) {
          setError(`tools.${index}.toolUrl`, {
            type: 'manual',
            message: 'Workspace URL is required.',
          });
          valid = false;
        } else if (tool.toolUrl && !validateURL(tool.toolUrl)) {
          setError(`tools.${index}.toolUrl`, {
            type: 'manual',
            message: 'Invalid URL.',
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolUrl`);
        }

        if (!tool.toolName && tool.toolUrl) {
          setError(`tools.${index}.toolName`, {
            type: 'manual',
            message: 'Minimum one tool must be selected.',
          });
          valid = false;
        } else {
          clearErrors(`tools.${index}.toolName`);
        }
      }
    });

    return valid;
  };

  const projectMutation = useMutation({
    mutationFn: (data: ProjectTools) => CreateProject(data, session),
    onSuccess: () => {
      toast({
        title: 'Project Created!',
        description: 'Your project has been created successfully.',
      });
      router.push('/projects');
    },
    onError: (error) => {
      if (error.message === 'Request failed with status code 409') {
        setError('name', {
          type: 'manual',
          message: 'Project name already exists.',
        });
      }
    },
  });

  const onSubmit = (data: ProjectTools) => {
    if (validate(data)) {
      const filteredData = {
        ...data,
        tools: data.tools.filter(
          (tool) => tool.toolName.trim() !== '' && tool.toolUrl.trim() !== ''
        ),
      };

      projectMutation.mutate(filteredData);
    }
  };

  const getVideoUrl = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'codacy':
        return 'https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4';
      case 'jira':
        return 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4';
      case 'trello':
        return 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4';
      default:
        return '';
    }
  };

  const handleShieldQuestionClick = () => {
    const selectedTool = getValues(`tools.${0}.toolName`);
    setSelectedTool(selectedTool);
    setIsModalOpen(true);
  };

  return (
    <div className='w-full'>
      <PageTitle title='Create Project • Ops4 Team' />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full px-4 pb-8 pt-8 lg:pl-[24px] lg:pr-[14px]'>
          <div className='flex items-center justify-between pb-4 md:hidden'>
            <span className='pl-1 md:hidden'>
              <SidebarTrigger />
            </span>
            <AvatarMenu />
          </div>
          <div className='flex items-center justify-between'>
            <GlobalBreadCrumb
              initialData='Projects'
              initalLink='/projects'
              secondayData='Create Project'
              secondayLink='/projects/create'
            />
            <span className='hidden pr-2 md:flex'>
              <AvatarMenu />
            </span>
          </div>
          <PageHeading
            title='Create Project'
            className='pl-[7px] pt-1 lg:pl-[5px]'
          />

          <div className='flex w-full max-w-[872px] flex-col items-start lg:flex-row lg:items-center lg:justify-between lg:pt-4'>
            <div className='py-4 pl-[6px] lg:pt-0'>
              <h1 className='text-[16px] font-semibold lg:pb-2 lg:text-headingXXS'>
                Project Info
              </h1>
            </div>
            <div className='w-full max-w-[553px] pl-2 lg:pl-0 lg:pt-8'>
              <label
                htmlFor='projectName'
                className='text-sm font-medium text-black'
              >
                Project Name <span className='text-destructive'>*</span>
              </label>
              <BaseInput
                control={control}
                name='name'
                type='text'
                placeholder='Project Name'
                className='mt-[4px] w-full placeholder:text-subHeading'
                additionalText='The project name you used in your code project'
                errors={errors}
                errorclassName='mt-1'
              />
            </div>
          </div>

          <div className='mt-8 flex w-full flex-col items-start lg:mt-5 lg:max-w-[872px] lg:flex-row lg:items-center lg:justify-between'>
            <div className='pl-2 pt-3 lg:pl-[6px] lg:pt-4'>
              <h1 className='pb-1 text-headingXXS font-semibold'>
                Project Management Tool
              </h1>
            </div>
            <ToolDropdown
              control={control}
              name='tools[0].toolName'
              placeholder='Select'
              errors={errors.tools?.[0]?.toolName?.message}
              index={0}
            />
          </div>
          <div className='flex h-full w-full gap-x-[6px] pl-2 pt-3 lg:pl-[320px]'>
            <WorkspaceURL
              control={control}
              name='tools[0].toolUrl'
              errors={errors.tools?.[0]?.toolUrl?.message}
              index={0}
            />
            <div className='relative mt-[62px] h-9 w-10 rounded-lg border lg:mt-[71px]'>
              <ShieldQuestion
                className='absolute right-2 top-2 h-4 w-4 cursor-pointer font-normal text-black md:right-3'
                onClick={handleShieldQuestionClick}
              />
            </div>
          </div>

          {fields.slice(1).map((field, index) => (
            <div
              key={field.id}
              className='h-full w-full flex-col items-center pl-1 pt-6 lg:pl-[320px]'
            >
              <div className='flex items-end justify-start gap-x-[6px]'>
                <ToolDropdown
                  control={control}
                  name={`tools[${index + 1}].toolName`}
                  errors={errors.tools?.[index + 1]?.toolName?.message}
                  index={index + 1}
                />
                <div className='relative h-9 w-10 rounded-lg border'>
                  <Trash2
                    className='absolute right-2 top-2 h-4 w-4 cursor-pointer font-normal text-black md:right-3'
                    onClick={() => remove(index + 1)}
                  />
                </div>
              </div>
              <div className='flex items-center gap-4 pl-2 pt-4 lg:pl-0 lg:pt-0'>
                <WorkspaceURL
                  control={control}
                  name={`tools[${index + 1}].toolUrl`}
                  errors={errors.tools?.[index + 1]?.toolUrl?.message}
                  index={index + 1}
                />
              </div>
            </div>
          ))}

          <div className='mb-10 ml-2 mt-14 flex-col items-start lg:ml-[320px] lg:items-center'>
            <div className='w-full'>
              <Button
                variant='extralight'
                size='xsExtended'
                onClick={handleAddtools}
                className='mb-6 md:max-w-[90px]'
              >
                Add Tool
              </Button>
            </div>
            <div className='w-full'>
              <Button
                variant='darkish'
                size='lgExtended'
                type='submit'
                className='mt-3 w-full md:max-w-[128px]'
              >
                {projectMutation.isPending ? (
                  <Circle className='animate-spin' size={14} />
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal for video */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div>
            <video controls className='mt-4 w-full'>
              <source src={getVideoUrl(selectedTool || '')} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectCreate;
