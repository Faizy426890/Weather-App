'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      localStorage.setItem('selectedRole', role);
    }
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn path="/sign-in" routing="path" afterSignUpUrl="/set-role" />
    </div>
  );
}
