import React from 'react';
import { Link } from 'react-router-dom';

export default function RegistrationSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 text-center bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
        <p className="mb-4">Thank you for registering. Please check your email to verify your account.</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}