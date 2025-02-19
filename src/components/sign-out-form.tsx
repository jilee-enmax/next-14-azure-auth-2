import { signOut } from '@/auth';

export async function SignOutForm() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button className="px-4 py-2 rounded min-w-60 text-center bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-white disabled:opacity-50 disabled:pointer-events-none hover:underline underline-offset-4">
        Sign out
      </button>
    </form>
  );
}

