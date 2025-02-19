'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function signInAction(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn('microsoft-entra-id', formData);
    return undefined; // Successful sign-in
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      console.error('Microsoft Entra ID authentication error:', error);
      return 'Something went wrong with Microsoft Entra ID authentication.';
    }
    console.error('Unexpected error during sign-in:', error);
    throw error; // Rethrow unexpected errors
  }
}


