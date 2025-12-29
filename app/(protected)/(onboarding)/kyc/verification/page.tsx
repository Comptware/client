// // // app/(protected)/kyc/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useFormik } from 'formik';
import { submitKYC } from '@/api/client';
import { KycSubmitPayload, KycSubmitResponse } from '@/types';
import {
  countries,
  initialValues,
  validationSchema,
  allowedDocTypes,
  docTypeLabels,
} from '@/components/validations/kycValidation';
import { toast } from 'react-toastify';
import { Header } from '@/components/header/header';
import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useGetKycDocumentTypesQuery,
} from '@/store/features/geo/geoApi';

export default function KycVerificationPage() {
  const { user } = useAppSelector((s) => s.auth);
  const [redirectUrl, setRedirectUrl] = useState('');

   const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const { data: countries = [] } = useGetCountriesQuery();
  const { data: docTypes = [] } = useGetKycDocumentTypesQuery();
  const { data: states = [] } = useGetStatesQuery(selectedCountry, {
    skip: !selectedCountry,
  });
  const { data: cities = [] } = useGetCitiesQuery(
    { countryIso: selectedCountry, stateIso: selectedState },
    { skip: !selectedCountry || !selectedState }
  );

  // sync country → formik
useEffect(() => {
  if (selectedCountry) formik.setFieldValue('country', selectedCountry);
}, [selectedCountry]);

// sync state → formik
useEffect(() => {
  formik.setFieldValue('state', selectedState || '');
}, [selectedState]);

// reset city when state changes
useEffect(() => {
  if (!selectedState) {
    formik.setFieldValue('city', '');
  }
}, [selectedState]);


  // Formik setup
  const formik = useFormik<KycSubmitPayload>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: KycSubmitPayload = {
          ...values,
          country: values.country ? values.country.toLowerCase() : undefined,
        };
        const data: KycSubmitResponse = await submitKYC(payload);

        sessionStorage.setItem('kycScanRef', data.scanRef);

        toast.success(data.message || 'KYC initiated successfully');
        setRedirectUrl(data.redirectUrl);

        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 2000); // Delay redirect to show toast
      } catch (err: any) {
        console.error(err);
        toast.error(
          err.response?.data?.message || err.message || 'Something went wrong'
        );
      }
    },
  });

  return (
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/dashbg.jpg)` }}>
      <div className="md:py-0 py-10 mx-auto">
        <Header />
        <div className="flex h-screen">
          <div className="flex-1 flex-col flex items-center justify-center p-6">
            <div className="bg-white text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
              <h2 className="lg:text-2xl text-xl text-center font-semibold lg:mb-6 mb-1">
                KYC Verification
              </h2>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <select
          name="documents"
          value={formik.values.documents}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.documents && formik.errors.documents
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
        >
          <option value="" disabled>
            Select document type
          </option>
          {docTypes.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
                  {formik.touched.documents && formik.errors.documents && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.documents}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="documentNumber"
                    placeholder="Document Number"
                    value={formik.values.documentNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.documentNumber && formik.errors.documentNumber
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.documentNumber && formik.errors.documentNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.documentNumber}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.address && formik.errors.address
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    name="country"
                    // value={formik.values.country}
                    // onChange={formik.handleChange}
                    value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState('');
          }}
                    onBlur={formik.handleBlur}
                    className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.country && formik.errors.country
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a country (optional)</option>
                    {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.emoji} {c.name}
            </option>
          ))}
                  </select>
                  {formik.touched.country && formik.errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.country}
                    </p>
                  )}
                </div>

      {states.length > 0 && (
        <div>
          <select
            name="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
             className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.state && formik.errors.state
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
          >
            <option value="">Select state (optional)</option>
            {states.map((s) => (
              <option key={s.iso2} value={s.iso2}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {cities.length > 0 && (
        <div>
          <select
            name="city"
            onChange={formik.handleChange}
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formik.touched.city && formik.errors.city
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
          >
            <option value="">Select city (optional)</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

                <div className="flex justify-between items-center space-x-4">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 ${
                      formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {formik.isSubmitting ? 'Submitting...' : 'Start KYC'}
                  </button>
                  <a
                    href="/auth/logout"
                    className="text-blue-600 rounded-md border border-blue-600 px-4 py-2 hover:underline font-medium"
                  >
                    Logout
                  </a>
                </div>
              </form>

              {redirectUrl && (
                <p className="mt-4 text-sm text-green-600">
                  Redirecting to verification...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







// // // // app/(protected)/kyc/page.tsx Hardcoded Country and document types
// 'use client';

// import { useState } from 'react';
// import { useAppSelector } from '@/store/hooks';
// import { useFormik } from 'formik';
// import { submitKYC } from '@/api/client';
// import { KycSubmitPayload, KycSubmitResponse } from '@/types';
// import {
//   countries,
//   initialValues,
//   validationSchema,
//   allowedDocTypes,
//   docTypeLabels,
// } from '@/components/validations/kycValidation';
// import { toast } from 'react-toastify';
// import { Header } from '@/components/header/header';

// export default function KycVerificationPage() {
//   const { user } = useAppSelector((s) => s.auth);
//   const [redirectUrl, setRedirectUrl] = useState('');

//   // Formik setup
//   const formik = useFormik<KycSubmitPayload>({
//     initialValues,
//     validationSchema,
//     onSubmit: async (values) => {
//       try {
//         const payload: KycSubmitPayload = {
//           ...values,
//           country: values.country ? values.country.toLowerCase() : undefined,
//         };
//         const data: KycSubmitResponse = await submitKYC(payload);

//         sessionStorage.setItem('kycScanRef', data.scanRef);

//         toast.success(data.message || 'KYC initiated successfully');
//         setRedirectUrl(data.redirectUrl);

//         setTimeout(() => {
//           window.location.href = data.redirectUrl;
//         }, 2000); // Delay redirect to show toast
//       } catch (err: any) {
//         console.error(err);
//         toast.error(
//           err.response?.data?.message || err.message || 'Something went wrong'
//         );
//       }
//     },
//   });

//   return (
//     <div
//       className="bg-cover bg-center bg-fixed min-h-screen"
//       style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/images/dashbg.jpg)` }}>
//       <div className="md:py-0 py-10 mx-auto">
//         <Header />
//         <div className="flex h-screen">
//           <div className="flex-1 flex-col flex items-center justify-center p-6">
//             <div className="bg-white text-center rounded-xl shadow-lg p-8 max-w-xl w-full">
//               <h2 className="lg:text-2xl text-xl text-center font-semibold lg:mb-6 mb-1">
//                 KYC Verification
//               </h2>

//               <form onSubmit={formik.handleSubmit} className="space-y-5">
//                 <div>
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={formik.values.firstName}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.firstName && formik.errors.firstName
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   />
//                   {formik.touched.firstName && formik.errors.firstName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.firstName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={formik.values.lastName}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.lastName && formik.errors.lastName
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   />
//                   {formik.touched.lastName && formik.errors.lastName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.lastName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <select
//                     name="documents"
//                     value={formik.values.documents}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.documents && formik.errors.documents
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="" disabled>
//                       Select a document type
//                     </option>
//                     {allowedDocTypes.map((docType) => (
//                       <option key={docType} value={docType}>
//                         {docTypeLabels[docType]}
//                       </option>
//                     ))}
//                   </select>
//                   {formik.touched.documents && formik.errors.documents && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.documents}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="documentNumber"
//                     placeholder="Document Number"
//                     value={formik.values.documentNumber}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.documentNumber && formik.errors.documentNumber
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   />
//                   {formik.touched.documentNumber && formik.errors.documentNumber && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.documentNumber}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={formik.values.dateOfBirth}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.dateOfBirth && formik.errors.dateOfBirth
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   />
//                   {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.dateOfBirth}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <input
//                     type="text"
//                     name="address"
//                     placeholder="Address"
//                     value={formik.values.address}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.address && formik.errors.address
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   />
//                   {formik.touched.address && formik.errors.address && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.address}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <select
//                     name="country"
//                     value={formik.values.country}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       formik.touched.country && formik.errors.country
//                         ? 'border-red-500'
//                         : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select a country (optional)</option>
//                     {countries.map((country) => (
//                       <option key={country.code} value={country.code}>
//                         {country.name}
//                       </option>
//                     ))}
//                   </select>
//                   {formik.touched.country && formik.errors.country && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.country}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex justify-between items-center space-x-4">
//                   <button
//                     type="submit"
//                     disabled={formik.isSubmitting}
//                     className={`bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 ${
//                       formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {formik.isSubmitting ? 'Submitting...' : 'Start KYC'}
//                   </button>
//                   <a
//                     href="/auth/logout"
//                     className="text-blue-600 rounded-md border border-blue-600 px-4 py-2 hover:underline font-medium"
//                   >
//                     Logout
//                   </a>
//                 </div>
//               </form>

//               {redirectUrl && (
//                 <p className="mt-4 text-sm text-green-600">
//                   Redirecting to verification...
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }