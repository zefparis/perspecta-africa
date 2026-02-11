'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/navigation';

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          locale,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t('errors.generic'));
      }

      // Login after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError(t('errors.credentials'));
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errors.generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            {t('signup')}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t('or')}{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/90"
            >
              {t('signin')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-3"
                placeholder={t('name')}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-3"
                placeholder={t('email')}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 pl-3"
                placeholder={t('password')}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isLoading ? t('uploading') : t('signup')}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                {t('or')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
          >
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 20.45c4.656 0 8.3542-3.15 9.778-7.5625h-9.778v-4.125h14.542c.162.9.2395 1.7625.2395 2.625 0 7.3125-5.2605 12.5625-12.875 12.5625-7.18 0-13-5.82-13-13s5.82-13 13-13c3.51 0 6.6455 1.2917 9.073 3.5625l-3.354 3.229c-1.396-1.3333-3.375-2.2083-5.719-2.2083-4.708 0-8.5207 3.8125-8.5207 8.5208s3.8127 8.5208 8.5207 8.5208z"
                fill="#4285F4"
              />
              <path
                d="M3.4795 8.9583l3.3542 2.5834c.8958-2.6667 3.4166-4.5834 6.375-4.5834 1.8333 0 3.51.6459 4.8437 1.7083l3.5938-3.5937C19.4687 3.0104 15.9375 1.75 12.0003 1.75c-5.552 0-10.323 3.198-12.5208 7.2083z"
                fill="#EA4335"
              />
              <path
                d="M21.573 10.7708c.1615.9.2396 1.7625.2396 2.625 0 1.052-.1667 2.0625-.4584 3.0312l-3.6666-3.0937c-.3646-.8646-.625-1.7812-.625-2.5625H21.573z"
                fill="#FBBC05"
              />
              <path
                d="M12.0003 22.25c3.3437 0 6.2812-1.125 8.448-3.0312l-3.625-3.0105c-1.1667.7917-2.7396 1.3438-4.823 1.3438-2.9583 0-5.4792-1.9167-6.375-4.5833L2.146 15.6563C4.3437 19.9375 7.875 22.25 12.0003 22.25z"
                fill="#34A853"
              />
            </svg>
            <span className="text-sm font-semibold leading-6">{t('google')}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
