'use client'
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/context/AuthContext';
import UserList from '@/components/profile/UserList';

export default function ProfilePage() {
  const { profileData } = useAuth();
  
  return (
    <div className="">
      <ProfileForm />
      {profileData?.role === 'ADMIN' && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">User List</h2>
          <UserList />
        </div>
      )}
    </div>
  );
}