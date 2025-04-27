"use client";
import React, { useEffect, useState } from 'react';
import { UserIcon, EnvelopeIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import type { SVGProps } from 'react';

interface UserDetailsGridProps {
  userId?: string; 
}

interface DetailItemProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

const UserDetailsGrid: React.FC<UserDetailsGridProps> = ({ userId }) => {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState<{
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  }>({
    name: 'Guest User',
    email: 'N/A',
    emailVerified: null,
    image: null,
  });
  const [planType, setPlanType] = useState('Free Plan');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return; 

      const currentUserId = userId || session?.user?.id;


      if (!currentUserId) {
        console.warn('[UserDetailsGrid] No userId available');
        if (session?.user) {
          setUserDetails({
            name: session.user.name || 'Guest User',
            email: session.user.email || 'N/A',
            emailVerified: null, 
            image: session.user.image || null,
          });
          setPlanType('Pro Plan');
          setError(null);
        } else {
          setError('No user ID available');
          setPlanType('Free Plan');
        }
        return;
      }

      try {
        const response = await fetch(`/api/user?userId=${encodeURIComponent(currentUserId)}`);
        if (response.ok) {
          const user = await response.json();
          setUserDetails({
            name: user.name || 'Guest User',
            email: user.email || 'N/A',
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            image: user.image || null,
          });
          setError(null);
        } else {
          console.warn(`[UserDetailsGrid] No user found for userId: ${currentUserId}`);
          setError('User not found');
          if (session?.user) {
            setUserDetails({
              name: session.user.name || 'Guest User',
              email: session.user.email || 'N/A',
              emailVerified: null,
              image: session.user.image || null,
            });
            setPlanType('Pro Plan');
          }
        }
      } catch (error) {
        console.error('[UserDetailsGrid] Error fetching user data:', error);
        setError('Failed to fetch user data');
        if (session?.user) {
          setUserDetails({
            name: session.user.name || 'Guest User',
            email: session.user.email || 'N/A',
            emailVerified: null,
            image: session.user.image || null,
          });
          setPlanType('Pro Plan');
        }
      }

      setPlanType(session ? 'Pro Plan' : 'Free Plan');
    };

    fetchData();
  }, [userId, session, status]);

  const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value }) => (
    <motion.div
      className="p-4 bg-white/70 rounded-xl border-2 border-primary backdrop-blur-sm overflow-hidden"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg border-2 border-primary">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm">{label}</p>
          <p className="text-lg font-semibold text-primary">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  if (error && !session?.user) {
    return (
      <div className="space-y-4 p-6 bg-white/70 rounded-xl border-2 border-primary backdrop-blur-sm">
        <h2 className="text-xl font-bold text-primary mb-2">User Details</h2>
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-white/70 rounded-xl border-2 border-primary backdrop-blur-sm">
      <h2 className="text-xl font-bold text-primary mb-2">User Details</h2>
      <div className="flex flex-col items-center gap-6">
        {/* User Profile Image */}
        <motion.div
          className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {userDetails.image ? (
            <Image
              src={userDetails.image}
              alt={`${userDetails.name}'s profile picture`}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-gray-500" />
            </div>
          )}
        </motion.div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <DetailItem
            icon={UserIcon}
            label="Full Name"
            value={userDetails.name || 'N/A'}
          />
          <DetailItem
            icon={EnvelopeIcon}
            label="Email Address"
            value={userDetails.email || 'N/A'}
          />
          <DetailItem
            icon={CalendarIcon}
            label="Account Created"
            value={
              userDetails.emailVerified
                ? new Date(userDetails.emailVerified).toLocaleDateString()
                : 'N/A'
            }
          />
          <DetailItem icon={TagIcon} label="Current Plan" value={planType} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsGrid;