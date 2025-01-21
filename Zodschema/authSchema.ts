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

