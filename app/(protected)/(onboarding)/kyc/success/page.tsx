// // // // app/(protected)/kyc/success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getKYCStatus, submitKycView } from '@/api/client';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

export default function KycSuccessPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || 'N/A';
  // const scanRef = searchParams.get('scanRef') || 'N/A';
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
        setExplanation('Unable to fetch KYC status. Please try again.');
      }
    };

    fetchStatus();

  if (userId !== 'N/A' && storedRef) {
      submitKycView({ scanRef: storedRef, status: 'success' }).catch(() => {});
    }
  }, [userId]);
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
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/icons/green-check-icon.png`}
                  alt="icon"
                  width={75}
                  height={75}
                  className="inline mb-4"
                />
                <h1 className="text-3xl font-bold mb-4 text-white">KYC Verification: {status}</h1>
                <p className="text-lg mb-2 text-white">{explanation}</p>
                <p className="text-sm text-white mb-2">Reference: {scanRef}</p>
                {/* <p className="text-sm text-blue-500">{scanRef}</p> */}

                {status === 'APPROVED' && (
                  <Link
                    href="/payment"
                    className="mt-6 inline-block bg-primary text-white px-20 py-2 rounded-full font-medium hover:bg-light-blue"
                  >
                    Proceed to Payment
                  </Link>
                )}

                {(status === 'DENIED' || status === 'EXPIRED') && (
                  <Link
                    href="/kyc"
                    className="mt-6 inline-block bg-red text-white px-20 py-2 rounded-full font-medium hover:bg-red-700"
                  >
                    Retry Verification
                  </Link>
                )}
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
// import { getKYCStatus, submitKycView } from '@/api/client';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Header } from '@/components/header/header';

// export default function KycSuccessPage() {
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId') || 'N/A';
//   // const scanRef = searchParams.get('scanRef') || 'N/A';
//   const [scanRef, setScanRef] = useState('N/A');
//   const [status, setStatus] = useState<string>('LOADING');
//   const [explanation, setExplanation] = useState<string>('');

// useEffect(() => {
//       const storedRef = sessionStorage.getItem('kycScanRef');
//     if (storedRef) setScanRef(storedRef);

//     const fetchStatus = async () => {
//       try {
//         const res = await getKYCStatus();
//         setStatus(res.data.status);
//         setExplanation(res.data.explanation);
//       } catch {
//         setStatus('ERROR');
//         setExplanation('Unable to fetch KYC status. Please try again.');
//       }
//     };

//     fetchStatus();

//   if (userId !== 'N/A' && storedRef) {
//       submitKycView({ scanRef: storedRef, status: 'success' }).catch(() => {});
//     }
//   }, [userId]);

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
//                 src="/assets/icons/green-checkmark.png"
//                 alt="icon"
//                 width={75}
//                 height={75}
//                 className="inline mb-4"
//               />
//               <h1 className="text-3xl font-bold mb-4 text-blue-600">KYC Verification: {status}</h1>
//               <p className="text-lg mb-2 text-blue-600">{explanation}</p>
//               <p className="text-sm text-blue-500 mb-2">Reference: {scanRef}</p>
//               {/* <p className="text-sm text-blue-500">{scanRef}</p> */}

//               {status === 'APPROVED' && (
//                 <Link
//                   href="/payment"
//                   className="mt-6 inline-block bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700"
//                 >
//                   Proceed to Payment
//                 </Link>
//               )}

//               {(status === 'DENIED' || status === 'EXPIRED') && (
//                 <Link
//                   href="/kyc"
//                   className="mt-6 inline-block bg-red-600 text-white px-6 py-4 rounded-xl hover:bg-red-700"
//                 >
//                   Retry Verification
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// // // // // app/(protected)/kyc/success/page.tsx B4 ALIP UPDATE
// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { getKYCStatus, submitKycView } from '@/api/client';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// import Image from 'next/image';

// export default function KycSuccessPage() {
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId') || 'N/A';
//   // const scanRef = searchParams.get('scanRef') || 'N/A';
//   const [scanRef, setScanRef] = useState('N/A');
//   const [status, setStatus] = useState<string>('LOADING');
//   const [explanation, setExplanation] = useState<string>('');

// useEffect(() => {
//       const storedRef = sessionStorage.getItem('kycScanRef');
//     if (storedRef) setScanRef(storedRef);

//     const fetchStatus = async () => {
//       try {
//         const res = await getKYCStatus();
//         setStatus(res.data.status);
//         setExplanation(res.data.explanation);
//       } catch {
//         setStatus('ERROR');
//         setExplanation('Unable to fetch KYC status. Please try again.');
//       }
//     };

//     fetchStatus();

//   if (userId !== 'N/A' && storedRef) {
//       submitKycView({ scanRef: storedRef, status: 'success' }).catch(() => {});
//     }
//   }, [userId]);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="bg-white text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
//         <Image
//           src="/assets/icons/green-checkmark.png"
//           alt="icon"
//           width={75}
//           height={75}
//           className="inline mb-4"
//         />
//         <h1 className="text-3xl font-bold mb-4 text-blue-600">KYC Verification: {status}</h1>
//         <p className="text-lg mb-2 text-blue-600">{explanation}</p>
//         <p className="text-sm text-blue-500 mb-2">Reference: {scanRef}</p>
//         {/* <p className="text-sm text-blue-500">{scanRef}</p> */}

//         {status === 'APPROVED' && (
//           <Link
//             href="/payment"
//             className="mt-6 inline-block bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700"
//           >
//             Proceed to Payment
//           </Link>
//         )}

//         {(status === 'DENIED' || status === 'EXPIRED') && (
//           <Link
//             href="/kyc"
//             className="mt-6 inline-block bg-red-600 text-white px-6 py-4 rounded-xl hover:bg-red-700"
//           >
//             Retry Verification
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }