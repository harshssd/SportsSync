import { UserAuthForm } from '@/components/auth/UserAuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link className="text-primary hover:underline font-medium" href="/login">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <UserAuthForm mode="signup" />
          </div>
        </div>
      </div>
    </div>
  );
}
