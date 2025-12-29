// app/(protected)/kyc/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { submitKycView, getKYCStatus } from '@/api/client';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function KycErrorPage() {
  const { user } = useAppSelector((s) => s.auth);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || 'N/A';
  const [scanRef, setScanRef] = useState('N/A');
  const [status, setStatus] = useState<string>('LOADING');
  const [explanation, setExplanation] = useState<string>('');

useEffect(() => {
    const storedRef = sessionStorage.getItem('kycScanRef');
    if (storedRef) setScanRef(storedRef);

    const fetchStatus = async () => {
      try {
        const res = await getKYCStatus();
        setStatus(res.data.status);
        setExplanation(res.data.explanation);
      } catch {
        setStatus('ERROR');
        setExplanation('Unable to fetch verification status. Please try again.');
      }
    };

    fetchStatus();

    if (userId !== 'N/A' && storedRef) {
      submitKycView({ scanRef: storedRef, status: 'error' }).catch(() => {});
    }
  }, [userId]);

  if (userId !== 'N/A' && user?.auth0Id && userId !== user.auth0Id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Unauthorized Access</h1>
        <p className="text-lg mb-2">The verification details do not match your account.</p>
        <Link
          href="/kyc"
          className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Return to KYC page
        </Link>
      </div>
    );
  }

  return (
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">Self-guided purchase</p>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
        </div>
      </section>

      <section id="kyc" className="pb-20">
        <div className="container">
          <div className="flex">
            <div className="flex-1 flex-col flex items-center justify-center p-6">
              <div className="bg-blue-500 text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/icons/cross-check-icon.png`}
                  alt="icon"
                  width={75}
                  height={75}
                  className="inline mb-4"
                />
                <h1 className="text-3xl font-bold mb-4 text-white">
                  KYC Verification Failed
                </h1>
                <p className="text-lg mb-2 text-white">{status} : {explanation}</p>
                <p className="text-sm text-white mb-2">
                  If the issue persists, please contact{' '}
                  <a
                    href="mailto:support@suncoredigital.com"
                    className="text-white hover:underline"
                  >
                    support@suncoredigital.com
                  </a>.
                </p>
                <p className="text-sm text-white mt-2">Reference: {scanRef}</p>
                <p className="text-sm text-white">User ID: {userId}</p>
                <Link
                  href="/kyc"
                  className="mt-6 inline-block bg-primary text-white px-20 py-2 rounded-full font-medium hover:bg-light-blue"
                >
                  Return to KYC page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useAppSelector } from '@/store/hooks';
// import Link from 'next/link';
// import { submitKycView, getKYCStatus } from '@/api/client';
// import { toast } from 'react-toastify';
// import Image from 'next/image';
// import { Header } from '@/components/header/header';

// export default function KycErrorPage() {
//   const { user } = useAppSelector((s) => s.auth);
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId') || 'N/A';
//   const [scanRef, setScanRef] = useState('N/A');
//   const [status, setStatus] = useState<string>('LOADING');
//   const [explanation, setExplanation] = useState<string>('');

// useEffect(() => {
//     const storedRef = sessionStorage.getItem('kycScanRef');
//     if (storedRef) setScanRef(storedRef);

//     const fetchStatus = async () => {
//       try {
//         const res = await getKYCStatus();
//         setStatus(res.data.status);
//         setExplanation(res.data.explanation);
//       } catch {
//         setStatus('ERROR');
//         setExplanation('Unable to fetch verification status. Please try again.');
//       }
//     };

//     fetchStatus();

//     if (userId !== 'N/A' && storedRef) {
//       submitKycView({ scanRef: storedRef, status: 'error' }).catch(() => {});
//     }
//   }, [userId]);

//   if (userId !== 'N/A' && user?.auth0Id && userId !== user.auth0Id) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
//         <h1 className="text-3xl font-bold mb-4 text-red-600">Unauthorized Access</h1>
//         <p className="text-lg mb-2">The verification details do not match your account.</p>
//         <Link
//           href="/kyc"
//           className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Return to KYC page
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-cover bg-center bg-fixed min-h-screen"
//       style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/dashbg.jpg)` }}>
//       <div className="md:py-0 py-10 mx-auto">
//         <Header />
//         <div className="flex h-screen">
//           <div className="flex-1 flex-col flex items-center justify-center p-6">
//             <div className="bg-white text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
//               <Image
//                 src="/assets/icons/cross-check-icon.png"
//                 alt="icon"
//                 width={75}
//                 height={75}
//                 className="inline mb-4"
//               />
//               <h1 className="text-3xl font-bold mb-4 text-blue-600">
//                 KYC Verification Failed
//               </h1>
//               <p className="text-lg mb-2 text-blue-600">{status} : {explanation}</p>
//               <p className="text-sm text-blue-500 mb-2">
//                 If the issue persists, please contact{' '}
//                 <a
//                   href="mailto:support@suncoredigital.com"
//                   className="text-blue-600 hover:underline"
//                 >
//                   support@suncoredigital.com
//                 </a>.
//               </p>
//               <p className="text-sm text-blue-500 mt-2">Reference: {scanRef}</p>
//               <p className="text-sm text-blue-500">User ID: {userId}</p>
//               <Link
//                 href="/kyc"
//                 className="mt-6 inline-block bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700"
//               >
//                 Return to KYC page
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// // app/(protected)/kyc/error/page.tsx B4 MERGING ALIP
// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useAppSelector } from '@/store/hooks';
// import Link from 'next/link';
// import { submitKycView, getKYCStatus } from '@/api/client';
// import { toast } from 'react-toastify';
// import Image from 'next/image';

// export default function KycErrorPage() {
//   const { user } = useAppSelector((s) => s.auth);
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId') || 'N/A';
//   const [scanRef, setScanRef] = useState('N/A');
//   const [status, setStatus] = useState<string>('LOADING');
//   const [explanation, setExplanation] = useState<string>('');

// useEffect(() => {
//     const storedRef = sessionStorage.getItem('kycScanRef');
//     if (storedRef) setScanRef(storedRef);

//     const fetchStatus = async () => {
//       try {
//         const res = await getKYCStatus();
//         setStatus(res.data.status);
//         setExplanation(res.data.explanation);
//       } catch {
//         setStatus('ERROR');
//         setExplanation('Unable to fetch verification status. Please try again.');
//       }
//     };

//     fetchStatus();

//     if (userId !== 'N/A' && storedRef) {
//       submitKycView({ scanRef: storedRef, status: 'error' }).catch(() => {});
//     }
//   }, [userId]);

//   if (userId !== 'N/A' && user?.auth0Id && userId !== user.auth0Id) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
//         <h1 className="text-3xl font-bold mb-4 text-red-600">Unauthorized Access</h1>
//         <p className="text-lg mb-2">The verification details do not match your account.</p>
//         <Link
//           href="/kyc"
//           className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Return to KYC page
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="bg-white text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
//         <Image
//           src="/assets/icons/cross-check-icon.png"
//           alt="icon"
//           width={75}
//           height={75}
//           className="inline mb-4"
//         />
//         <h1 className="text-3xl font-bold mb-4 text-blue-600">
//           KYC Verification Failed
//         </h1>
//         <p className="text-lg mb-2 text-blue-600">{status} : {explanation}</p>
//         <p className="text-sm text-blue-500 mb-2">
//           If the issue persists, please contact{' '}
//           <a
//             href="mailto:support@suncoredigital.com"
//             className="text-blue-600 hover:underline"
//           >
//             support@suncoredigital.com
//           </a>.
//         </p>
//         <p className="text-sm text-blue-500 mt-2">Reference: {scanRef}</p>
//         <p className="text-sm text-blue-500">User ID: {userId}</p>
//         <Link
//           href="/kyc"
//           className="mt-6 inline-block bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700"
//         >
//           Return to KYC page
//         </Link>
//       </div>
//     </div>
//   );
// }