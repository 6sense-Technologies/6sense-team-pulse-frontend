import { z } from 'zod';
import { passwordRegex } from '../globalConstants';

export const LoginSchema = z.object({
  emailAddress: z
    .string({ required_error: 'Email address is required.' })
    .min(1, { message: 'Email address is required.' })
    .email('Incorrect email.'),
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
      .email('Incorrect email.'),
    password: z
      .string({ required_error: 'Password is required.' })
      .regex(passwordRegex, 'Must contain uppercase, lower case and special character.'),
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