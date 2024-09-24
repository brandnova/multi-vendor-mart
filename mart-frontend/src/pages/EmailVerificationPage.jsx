import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../config/api';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performEmailVerification = async () => {
      try {
        await verifyEmail(token);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to verify email. Please try again later.');
        console.error('Error verifying email:', err);
      } finally {
        setIsLoading(false);
      }
    };

    performEmailVerification();
  }, [token, navigate]);

  if (isLoading) return <div>Verifying your email...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return null;
};

export default EmailVerificationPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { verifyEmail } from '../config/api';

// const EmailVerificationPage = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const performEmailVerification = async () => {
//       try {
//         await verifyEmail(token);
//         setSuccess(true);
//       } catch (err) {
//         setError('Failed to verify email. Please try again later.');
//         console.error('Error verifying email:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     performEmailVerification();
//   }, [token, navigate]);

//   const handleGoHome = () => navigate('/');
//   const handleGoDashboard = () => navigate('/dashboard');

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-700">Verifying your email...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-red-600">{error}</div>
//           <button 
//             onClick={handleGoHome} 
//             className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700">
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-green-600">Email verified successfully!</div>
//           <div className="mt-4">
//             <button 
//               onClick={handleGoHome} 
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
//               Go Home
//             </button>
//             <button 
//               onClick={handleGoDashboard} 
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default EmailVerificationPage;
