'use client';

// FIX: Import React to provide types for component props and events.
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// FIX: Convert interface to a type alias with an intersection to correctly extend HTMLAttributes.
type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  mode: 'login' | 'signup';
};

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
      name?: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    if (mode === 'signup') {
      const name = target.name?.value;
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        // Automatically sign in after successful signup
        const signInResponse = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (signInResponse?.ok) {
          router.push('/dashboard');
        } else {
          setError(signInResponse?.error || 'An error occurred during sign-in.');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'An unexpected error occurred.');
      }
    } else { // login mode
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        setError(result?.error || 'Invalid credentials.');
      }
    }

    setIsLoading(false);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          {mode === 'signup' && (
            <div className="grid gap-1">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your Name"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
          )}
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              disabled={isLoading}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button disabled={isLoading}>
            {isLoading ? 'Loading...' : (mode === 'signup' ? 'Sign Up' : 'Sign In')}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground dark:bg-gray-800">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      >
        Google
      </Button>
    </div>
  );
}
