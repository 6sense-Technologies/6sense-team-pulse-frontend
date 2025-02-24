'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Logo from '../../../../public/logo/Ops4TeamLogo.png';
import { Button } from '@/components/ButtonComponent';
import GoogleLogo from '../../../../public/logo/googleLogo.svg';
import FacebookLogo from '../../../../public/logo/facebookLogo.svg';
import AppleLogo from '../../../../public/logo/appleLogo.svg';
import OrDivider from '../_components/orDivider';
import { useRouter, useSearchParams } from 'next/navigation';
import FooterTexts from '../_components/footerTexts';
import AuthPageHeader from '../_components/authPageHeader';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TBasicSignupFormInputs } from '@/types/Auth.types';
import { SignupSchema } from '../../../../Zodschema/authSchema';
import { useMutation } from '@tanstack/react-query';
import { handleBasicSignup } from '../../../../helpers/Auth/authApi';
import { BaseInput } from '@/components/BaseInput';
import { Circle } from '@phosphor-icons/react';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { signIn, useSession } from 'next-auth/react';
import Loader from '@/components/loader';
import { Eye, EyeOff } from 'lucide-react';
import SmallLogo from '../../../../public/logo/Ops4TeamLogo.svg';
import axios from 'axios';
import comingSoonAlert from '@/components/comingSoonAlert';
import { Toaster } from '@/components/ui/toaster';

const SignUpContent = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inviteData, setInviteData] = useState<{
    displayName: string;
    emailAddress: string;
  } | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TBasicSignupFormInputs>({
    resolver: zodResolver(SignupSchema),
  });
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated' && token) {
      axios
        .post(
          'https://o4t-backend-for-tester.vercel.app/auth/register/verify-invite',
          {
            jwtToken: token,
          }
        )
        .then((response) => {
          const { displayName, emailAddress } = response.data;
          setInviteData({ displayName, emailAddress });
          setValue('displayName', displayName);
          setValue('emailAddress', emailAddress);
        })
        .catch((error) => {
          console.error('Error verifying invite:', error);
          if (error.response && error.response.status === 401) {
            setErrorMessage('Invalid or expired token.');
          } else {
            setErrorMessage('An error occurred while verifying the invite.');
          }
        });
    }
  }, [session.status, token, setValue]);

  const basicSignUpMutation = useMutation({
    mutationFn: handleBasicSignup,
    onSuccess: (data, formData: TBasicSignupFormInputs) => {
      signIn('credentials', {
        redirect: false,
        emailAddress: formData.emailAddress,
        password: formData.password,
      }).then(() => {
        session.update().then(() => {
          localStorage.setItem('user-email', data.userInfo.emailAddress);
          router.push('/sign-up/verification');
        });
      });
    },
    onError: (error: any) => {
      if (error.message) {
        setErrorMessage('Email already exists.');
      }
    },
  });

  const handleSubmission: SubmitHandler<TBasicSignupFormInputs> = (data) => {
    setErrorMessage(null);
    basicSignUpMutation.mutate(data);
  };

  if (session.status === 'loading') {
    return <Loader />;
  }

  if (session.status === 'authenticated') {
    if (!session.data?.isVerified && !session.data?.hasOrganization) {
      router.push('/sign-up/verification');
      return <Loader />;
    }
    if (session.data?.isVerified && !session.data?.hasOrganization) {
      router.push('/sign-up/create-organization');
      return <Loader />;
    }
    if (
      session.data?.isVerified &&
      session.data?.hasOrganization &&
      session.status === 'authenticated'
    ) {
      router.push('/dashboard');
      return <Loader />;
    }
  }

  return (
    <div className='grid h-screen w-full grid-cols-1 overflow-y-hidden md:grid-cols-2'>
      <PageTitle
        pageName='Create Account'
        title='Try Ops4 Team for Free • Ops4 Team'
      />
      <div className='hidden w-full bg-blackishBg md:flex md:flex-col md:justify-between'>
        <div className='pl-[36px] pt-[36px]'>
          <Image src={Logo} alt='Ops4Team Logo' />
        </div>
        <FooterTexts
          heading='“This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before.”'
          subHeading='Sofia Davis'
        />
      </div>
      <div className='w-full overflow-y-auto bg-white pb-4'>
        <Toaster />
        <div className='mx-4 mr-9 mt-9 lg:flex lg:justify-end lg:gap-0'>
          <div className='flex justify-center px-3 text-center md:hidden'>
            <Image src={SmallLogo} alt='Ops4Team Logo' />
          </div>

          <Link href='/sign-in'>
            <Button variant='light' className='hidden text-sm lg:block'>
              Sign in
            </Button>
          </Link>
        </div>

        <div className='mx-auto w-full max-w-[465px] px-8 pb-5 pt-6 lg:px-5 lg:pt-0 xl:pt-8'>
          <div>
            <p className='pt-6 text-3xl font-semibold text-black lg:pb-6'>
              Sign up
            </p>
            <AuthPageHeader
              title='You are one click away'
              subTitle='from being efficient'
              titleclassName='md:text-2xl text-deepBlackColor pt-6 md:pt-0'
              subTitleClassName='pt-[4px] pb-[20px]'
            />
          </div>
          <div className='flex gap-x-4'>
            <Button
              variant='extralight'
              size='minixl'
              onClick={() => comingSoonAlert()}
            >
              SSO
            </Button>
            <div className='flex gap-x-[16px]'>
              <Button
                variant='extralight'
                size='smallest'
                onClick={() => comingSoonAlert()}
              >
                <Image
                  src={GoogleLogo}
                  width={24}
                  height={24}
                  alt='googleLogo'
                />
              </Button>
              <Button
                variant='extralight'
                size='smallest'
                onClick={() => comingSoonAlert()}
              >
                <Image
                  src={FacebookLogo}
                  width={24}
                  height={24}
                  alt='facebookLogo'
                />
              </Button>
              <Button
                variant='extralight'
                size='smallest'
                onClick={() => comingSoonAlert()}
              >
                <Image src={AppleLogo} width={24} height={24} alt='applelogo' />
              </Button>
            </div>
          </div>
          <OrDivider
            text='OR CONTINUE WITH'
            className='text-[12px] text-textMuted'
          />

          <form onSubmit={handleSubmit(handleSubmission)}>
            <div className='w-full pt-2 lg:pt-0'>
              <label
                htmlFor='displayName'
                className='text-sm font-medium text-black'
              >
                Full Name
              </label>
              <BaseInput
                control={control}
                name='displayName'
                errors={errors}
                placeholder='Enter your full name'
                className='mt-[4px] w-full placeholder:text-subHeading'
                disabled={!!inviteData}
              />
            </div>
            <div className='w-full pt-6 lg:pt-5'>
              <label
                htmlFor='emailAddress'
                className='text-sm font-medium text-black'
              >
                Email
              </label>
              <BaseInput
                type='email'
                control={control}
                name='emailAddress'
                errors={errors}
                externalError={errorMessage}
                placeholder='Enter your email'
                className='mt-[4px] w-full placeholder:text-subHeading'
                disabled={!!inviteData}
              />
            </div>
            <div className='w-full pt-6 lg:pt-5'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-black'
              >
                Password
              </label>
              <div className='relative'>
                <BaseInput
                  control={control}
                  name='password'
                  type={passwordVisible ? 'text' : 'password'}
                  errors={errors}
                  placeholder='Password'
                  className='mt-[4px] w-full placeholder:text-subHeading'
                />
                <button
                  type='button'
                  onClick={handlePasswordVisibility}
                  className='absolute right-5 top-2.5'
                >
                  {passwordVisible ? (
                    <Eye size={20} className='text-xl text-deepBlackColor' />
                  ) : (
                    <EyeOff
                      size={20}
                      className='text-xl font-normal text-deepBlackColor'
                    />
                  )}
                </button>
              </div>
            </div>

            <Button variant='dark' className='mt-[52px] w-full lg:mt-8'>
              {basicSignUpMutation.isPending ? (
                <Circle className='animate-spin' />
              ) : (
                'Sign up'
              )}
            </Button>
          </form>

          <div className='mt-4 block lg:hidden'>
            <Link href={'/sign-in'}>
              <Button variant='light' className='w-full text-sm'>
                Sign in
              </Button>
            </Link>
          </div>

          <div>
            <p
              className='px-10 pt-3 text-center text-sm text-textMuted'
              onClick={() => comingSoonAlert()}
            >
              By clicking continue, you agree to our {''}
              <span className='cursor-pointer underline'>
                Terms of Service
              </span>{' '}
              and{' '}
              <span className='cursor-pointer underline'>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUp = () => (
  <Suspense fallback={<Loader />}>
    <SignUpContent />
  </Suspense>
);

export default SignUp;