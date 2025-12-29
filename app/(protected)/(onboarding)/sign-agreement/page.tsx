//app/(protected)/(onboarding)/sign-agreement/page.tsx
'use client';

import { useAppSelector } from '@/store/hooks';
import { AlertCircle, CheckCircle, FileText, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignAgreementPage() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const [checkCount, setCheckCount] = useState(0);
  const [showResendOption, setShowResendOption] = useState(false);

  // useEffect(() => {
  //   // Redirect to dashboard if already signed
  //   if (user?.hasSigned) {
  //     router.push('/dashboard');
  //     return;
  //   }

  //   // Redirect to products if deposit not paid
  //   if (!user?.depositPaid) {
  //     router.push('/products');
  //     return;
  //   }

  //   // Show resend option after 2 minutes
  //   const resendTimer = setTimeout(() => {
  //     setShowResendOption(true);
  //   }, 120000);

  //   // Poll for signature status every 15 seconds
  //   const interval = setInterval(() => {
  //     setCheckCount((prev) => prev + 1);
  //     // Refresh to check signature status
  //     router.refresh();
  //   }, 15000);

  //   return () => {
  //     clearTimeout(resendTimer);
  //     clearInterval(interval);
  //   };
  // }, [user?.hasSigned, user?.depositPaid, router]);

  // Prevent accessing other pages
  
  useEffect(() => {
    // Lock the user on this page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!user?.hasSigned) {
        e.preventDefault();
        e.returnValue = 'Please complete signing the agreement before leaving.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user?.hasSigned]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header with Lock Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6 animate-pulse">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Signature Required
          </h1>
          <p className="text-lg text-gray-600">
            You must sign the agreement to continue
          </p>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-blue-200">
          {/* Status Steps */}
          <div className="space-y-6 mb-8">
            {/* Step 1: Deposit Confirmed */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">Deposit Payment Confirmed</h3>
                <p className="text-gray-600 mt-1">
                  Your ${user.depositAmount || '1,000'} deposit has been successfully processed.
                </p>
              </div>
            </div>

            {/* Step 2: Agreement Sent */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">Agreement Sent to Your Email</h3>
                <p className="text-gray-600 mt-1">
                  Check your email at <strong className="text-blue-600">{user.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Subject: {"SunCore Purchase & Management Agreement - Please Review and Sign"}
                </p>
              </div>
            </div>

            {/* Step 3: Waiting for Signature */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 animate-pulse">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-yellow-900">Awaiting Your Signature</h3>
                <p className="text-gray-600 mt-1">
                  You cannot proceed until you sign the agreement.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-4">How to Sign:</h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">1.</span>
                <span>Open your email inbox for <strong>{user.email}</strong></span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">2.</span>
                <span>Find the email from PandaDoc (check spam folder if needed)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">3.</span>
                <span>Click the <strong>{`"Review Document"`}</strong> button</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">4.</span>
                <span>Review the agreement carefully</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">5.</span>
                <span>Sign the document electronically</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-3 text-blue-600">6.</span>
                <span>You{"'"}ll be automatically redirected once complete</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-yellow-900 mb-2">Account Access Restricted</h4>
              <p className="text-yellow-800 text-sm">
                Your account access is temporarily restricted until you complete the signing process. 
                This is required to continue with your order.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        {showResendOption && (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-3">
              <strong>Still haven{"'"}t received the email?</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please check your spam/junk folder or contact support for assistance.
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@suncoredigital.com?subject=Agreement Email Not Received'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Contact Support
            </button>
          </div>
        )}

        {/* Auto-check indicator */}
        {checkCount > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <span>Checking signature status... (Check #{checkCount})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




//// build failing due to appostrophe issues
// 'use client';

// import { useAppSelector } from '@/store/hooks';
// import { AlertCircle, CheckCircle, FileText, Mail } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function SignAgreementPage() {
//   const router = useRouter();
//   const { user } = useAppSelector((s) => s.auth);
//   const [checkCount, setCheckCount] = useState(0);
//   const [showResendOption, setShowResendOption] = useState(false);

//   useEffect(() => {
//     // Redirect to dashboard if already signed
//     if (user?.hasSigned) {
//       router.push('/dashboard');
//       return;
//     }

//     // Redirect to products if deposit not paid
//     if (!user?.depositPaid) {
//       router.push('/products');
//       return;
//     }

//     // Show resend option after 2 minutes
//     const resendTimer = setTimeout(() => {
//       setShowResendOption(true);
//     }, 120000);

//     // Poll for signature status every 15 seconds
//     const interval = setInterval(() => {
//       setCheckCount((prev) => prev + 1);
//       // Refresh to check signature status
//       router.refresh();
//     }, 15000);

//     return () => {
//       clearTimeout(resendTimer);
//       clearInterval(interval);
//     };
//   }, [user?.hasSigned, user?.depositPaid, router]);

//   // Prevent accessing other pages
//   useEffect(() => {
//     // Lock the user on this page
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (!user?.hasSigned) {
//         e.preventDefault();
//         e.returnValue = 'Please complete signing the agreement before leaving.';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [user?.hasSigned]);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full">
//         {/* Header with Lock Icon */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6 animate-pulse">
//             <FileText className="w-10 h-10 text-blue-600" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">
//             Signature Required
//           </h1>
//           <p className="text-lg text-gray-600">
//             You must sign the agreement to continue
//           </p>
//         </div>

//         {/* Main Status Card */}
//         <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-blue-200">
//           {/* Status Steps */}
//           <div className="space-y-6 mb-8">
//             {/* Step 1: Deposit Confirmed */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
//                   <CheckCircle className="w-6 h-6 text-green-600" />
//                 </div>
//               </div>
//               <div className="ml-4 flex-1">
//                 <h3 className="text-lg font-bold text-gray-900">Deposit Payment Confirmed</h3>
//                 <p className="text-gray-600 mt-1">
//                   Your ${user.depositAmount || '1,000'} deposit has been successfully processed.
//                 </p>
//               </div>
//             </div>

//             {/* Step 2: Agreement Sent */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
//                   <Mail className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="ml-4 flex-1">
//                 <h3 className="text-lg font-bold text-gray-900">Agreement Sent to Your Email</h3>
//                 <p className="text-gray-600 mt-1">
//                   Check your email at <strong className="text-blue-600">{user.email}</strong>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Subject: "SunCore Purchase & Management Agreement - Please Review and Sign"
//                 </p>
//               </div>
//             </div>

//             {/* Step 3: Waiting for Signature */}
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 animate-pulse">
//                   <AlertCircle className="w-6 h-6 text-yellow-600" />
//                 </div>
//               </div>
//               <div className="ml-4 flex-1">
//                 <h3 className="text-lg font-bold text-yellow-900">Awaiting Your Signature</h3>
//                 <p className="text-gray-600 mt-1">
//                   You cannot proceed until you sign the agreement.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
//             <h3 className="text-lg font-bold text-blue-900 mb-4">📧 How to Sign:</h3>
//             <ol className="space-y-3 text-blue-800">
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">1.</span>
//                 <span>Open your email inbox for <strong>{user.email}</strong></span>
//               </li>
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">2.</span>
//                 <span>Find the email from PandaDoc (check spam folder if needed)</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">3.</span>
//                 <span>Click the <strong>"Review Document"</strong> button</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">4.</span>
//                 <span>Review the agreement carefully</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">5.</span>
//                 <span>Sign the document electronically</span>
//               </li>
//               <li className="flex items-start">
//                 <span className="font-bold mr-3 text-blue-600">6.</span>
//                 <span>You'll be automatically redirected once complete</span>
//               </li>
//             </ol>
//           </div>
//         </div>

//         {/* Alert Box */}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
//           <div className="flex items-start">
//             <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
//             <div>
//               <h4 className="font-bold text-yellow-900 mb-2">Account Access Restricted</h4>
//               <p className="text-yellow-800 text-sm">
//                 Your account access is temporarily restricted until you complete the signing process. 
//                 This is required to continue with your order.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Help Section */}
//         {showResendOption && (
//           <div className="bg-gray-100 rounded-lg p-6 text-center">
//             <p className="text-gray-700 mb-3">
//               <strong>Still haven't received the email?</strong>
//             </p>
//             <p className="text-sm text-gray-600 mb-4">
//               Please check your spam/junk folder or contact support for assistance.
//             </p>
//             <button
//               onClick={() => window.location.href = 'mailto:support@suncoredigital.com?subject=Agreement Email Not Received'}
//               className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//             >
//               Contact Support
//             </button>
//           </div>
//         )}

//         {/* Auto-check indicator */}
//         {checkCount > 0 && (
//           <div className="mt-6 text-center">
//             <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
//               <span>Checking signature status... (Check #{checkCount})</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
