import { z } from 'zod';
import { passwordRegex } from '../globalConstants';

export const LoginSchema = z.object({
  emailAddress: z
    .string({ required_error: 'Email is required.' })
    .min(1, { message: 'Email is required.' })
    .email('Incorrect email.'),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(1, { message: 'Password is required.' })
});

export const SignupSchema = z
  .object({
    displayName: z
      .string({ required_error: 'Full name is required.' })
      .min(1, { message: 'Full name is required.' }),
    emailAddress: z
      .string({ required_error: 'Email is required.' })
      .min(1, { message: 'Email is required.' })
      .email('Incorrect email.'),
    password: z
      .string({ required_error: 'Password is required.' })
      .regex(passwordRegex, 'Password must contain uppercase, lower case and special character.'),
  });


  export const VerifyEmailSchema = z.object({
    token: z.string({ required_error: 'OTP is required.' })
  });

  export const OrganizationSchema = z.object({
    organizationName: z
      .string({ required_error: 'Organization name is required.' })
      .min(1, { message: 'Organization name is required.' }),
      domainName: z
      .string({ required_error: 'Domain is required.' })
      .min(1, { message: 'Domain is required.' }),
  });