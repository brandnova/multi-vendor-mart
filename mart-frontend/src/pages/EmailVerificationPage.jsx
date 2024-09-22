import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';

export default function EmailVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://127.0.0.1:8000/accounts/verify-email/${token}/`);
        setVerificationStatus('success');
      } catch (error) {
        console.error('Verification failed:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Email Verification</h1>
        
        {verificationStatus === 'pending' && (
          <Alert>
            <AlertTitle>Verifying your email</AlertTitle>
            <AlertDescription>
              Please wait while we verify your email address...
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'success' && (
          <Alert variant="success">
            <AlertTitle>Email Verified!</AlertTitle>
            <AlertDescription>
              Your email has been successfully verified. You can now log in to your account.
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              We couldn't verify your email. The link may have expired or is invalid.
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus !== 'pending' && (
          <Button onClick={handleContinue} className="w-full">
            {verificationStatus === 'success' ? 'Continue to Login' : 'Try Again'}
          </Button>
        )}
      </div>
    </div>
  );
}