'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Camera, Save, MapPin, User as UserIcon, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { data: session, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          reset({
            name: data.name || '',
            bio: data.bio || '',
            location: data.location || '',
            country: data.country || '',
            city: data.city || '',
          });
          setAvatarUrl(data.image);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session, reset]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${session?.user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setIsUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (data) {
        setAvatarUrl(data.publicUrl);
        // Update user profile with new image URL immediately
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: data.publicUrl }),
        });
        await updateSession();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(t('errors.uploadFailed') || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      await updateSession();
      alert(t('success'));
    } catch (error) {
      console.error(error);
      alert(t('errors.generic') || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-xl relative bg-muted flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="w-20 h-20 text-muted-foreground" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
            
            <p className="text-sm text-muted-foreground text-center">
              {t('uploadAvatar')}
            </p>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2 bg-card rounded-lg border shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {t('personalInfo')}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('name')}
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    {...register('name')}
                  />
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                  {t('bio')}
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    {...register('bio')}
                  />
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.bio && (
                  <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    {t('location')}
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      {...register('location')}
                    />
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-2">
                    {t('country')}
                  </label>
                  <input
                    id="country"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('country')}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
