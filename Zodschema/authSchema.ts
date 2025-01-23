import { z } from 'zod';
import { passwordRegex } from '../globalConstants';

export const LoginSchema = z.object({
  emailAddress: z
    .string({ required_error: 'Email address is required.' })
    .min(1, { message: 'Email address is required.' })
    .email('Please enter a valid email address.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(1, { message: 'Password is required.' })
});

export const SignupSchema = z
  .object({
    displayName: z
      .string({ required_error: 'Name is required.' })
      .min(1, { message: 'Name is required.' }),
    emailAddress: z
      .string({ required_error: 'Email address is required.' })
      .min(1, { message: 'Email address is required.' })
      .email('Please enter a valid email address.'),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(8, 'Password requirements not fulfilled.')
      .regex(passwordRegex, 'Password requirements not fulfilled.'),
  });


  export const VerifyEmailSchema = z.object({
    otp: z.string({ required_error: 'OTP is required.' }).min(6, 'OTP should be 6 characters long.'),
  });

  export const OrganizationSchema = z.object({
    organizationName: z
      .string({ required_error: 'Organization name is required.' })
      .min(1, { message: 'Organization name is required.' }),
      domainName: z
      .string({ required_error: 'Domain is required.' })
      .min(1, { message: 'Domain is required.' }),
  });