'use client';

import { useAppSelector } from '@/store/hooks';
import { CheckCircle, Clock, FileText, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AgreementPendingPage() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    // If user has already signed, redirect to dashboard
    if (user?.hasSigned) {
      router.push('/dashboard');
      return;
    }

    // Poll for signature status every 30 seconds
    const interval = setInterval(() => {
      setCheckCount((prev) => prev + 1);
      // Refresh user data by redirecting to current page
      router.refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.hasSigned, router]);

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agreement Signature Required
          </h1>
          <p className="text-gray-600">
            Please check your email to sign the SunCore Digital Management Agreement
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            {/* Step 1: Deposit Paid */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Deposit Payment Received</h3>
                <p className="text-gray-600 mt-1">
                  Your ${user.depositAmount || '1,000'} deposit has been successfully processed.
                </p>
              </div>
            </div>

            {/* Step 2: Agreement Sent */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Agreement Sent to Your Email</h3>
                <p className="text-gray-600 mt-1">
                  We{"'"}ve sent the SunCore Digital Management Agreement to <strong>{user.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please check your inbox (and spam folder) for an email from PandaDoc.
                </p>
              </div>
            </div>

            {/* Step 3: Awaiting Signature */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                  <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Awaiting Your Signature</h3>
                <p className="text-gray-600 mt-1">
                  Once you sign the agreement, you{"'"}ll be able to proceed with your full payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What to do next:</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Check your email inbox for a message from PandaDoc</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Click the {`"Review Document"`} button in the email</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Review the agreement carefully</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Sign the document electronically</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">5.</span>
              <span>Return to this page - you{"'"}ll be automatically redirected once signed</span>
            </li>
          </ol>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Didn{"'"}t receive the email?</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Check your spam folder or contact our support team for assistance.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {/* Auto-refresh indicator */}
        {checkCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Page automatically checking for updates... (Check #{checkCount})
            </p>
          </div>
        )}
      </div>
    </>
  );
}



//// build failing due to appostrophe issues
// 'use client';

// import { Layout } from '@/components/layout/layout';
// import { useAppSelector } from '@/store/hooks';
// import { CheckCircle, Clock, FileText, Mail } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function AgreementPendingPage() {
//   const router = useRouter();
//   const { user } = useAppSelector((s) => s.auth);
//   const [checkCount, setCheckCount] = useState(0);

//   useEffect(() => {
//     // If user has already signed, redirect to dashboard
//     if (user?.hasSigned) {
//       router.push('/dashboard');
//       return;
//     }

//     // Poll for signature status every 30 seconds
//     const interval = setInterval(() => {
//       setCheckCount((prev) => prev + 1);
//       // Refresh user data by redirecting to current page
//       router.refresh();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [user?.hasSigned, router]);

//   if (!user) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
//             <FileText className="w-8 h-8 text-blue-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Agreement Signature Required
//           </h1>
//           <p className="text-gray-600">
//             Please check your email to sign the SunCore Digital Management Agreement
//           </p>
//         </div>

//         {/* Status Card */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <div className="space-y-6">
//             {/* Step 1: Deposit Paid */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Deposit Payment Received</h3>
//                 <p className="text-gray-600 mt-1">
//                   Your ${user.depositAmount || '1,000'} deposit has been successfully processed.
//                 </p>
//               </div>
//             </div>

//             {/* Step 2: Agreement Sent */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
//                   <Mail className="w-5 h-5 text-blue-600" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Agreement Sent to Your Email</h3>
//                 <p className="text-gray-600 mt-1">
//                   We've sent the SunCore Digital Management Agreement to <strong>{user.email}</strong>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Please check your inbox (and spam folder) for an email from PandaDoc.
//                 </p>
//               </div>
//             </div>

//             {/* Step 3: Awaiting Signature */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
//                   <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Awaiting Your Signature</h3>
//                 <p className="text-gray-600 mt-1">
//                   Once you sign the agreement, you'll be able to proceed with your full payment.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Instructions Card */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold text-blue-900 mb-3">What to do next:</h3>
//           <ol className="space-y-2 text-blue-800">
//             <li className="flex items-start">
//               <span className="font-semibold mr-2">1.</span>
//               <span>Check your email inbox for a message from PandaDoc</span>
//             </li>
//             <li className="flex items-start">
//               <span className="font-semibold mr-2">2.</span>
//               <span>Click the "Review Document" button in the email</span>
//             </li>
//             <li className="flex items-start">
//               <span className="font-semibold mr-2">3.</span>
//               <span>Review the agreement carefully</span>
//             </li>
//             <li className="flex items-start">
//               <span className="font-semibold mr-2">4.</span>
//               <span>Sign the document electronically</span>
//             </li>
//             <li className="flex items-start">
//               <span className="font-semibold mr-2">5.</span>
//               <span>Return to this page - you'll be automatically redirected once signed</span>
//             </li>
//           </ol>
//         </div>

//         {/* Help Section */}
//         <div className="bg-gray-50 rounded-lg p-6 text-center">
//           <p className="text-gray-700 mb-4">
//             <strong>Didn't receive the email?</strong>
//           </p>
//           <p className="text-sm text-gray-600 mb-4">
//             Check your spam folder or contact our support team for assistance.
//           </p>
//           <button
//             onClick={() => router.push('/contact')}
//             className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Contact Support
//           </button>
//         </div>

//         {/* Auto-refresh indicator */}
//         {checkCount > 0 && (
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-500">
//               Page automatically checking for updates... (Check #{checkCount})
//             </p>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// }
