import React from 'react';
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';

const ChangePasswordPage = () => {
  return (
    <div className="container mx-auto p-4 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
