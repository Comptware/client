// //src/components/validations/kycValidation.ts
import * as Yup from 'yup';
import { KycSubmitPayload } from '@/types';

// Static list of countries with display names and alpha-2 codes
export const countries = [
  { name: 'United States', code: 'US' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'United Kingdom', code: 'GB' },
];

// Define DocumentType as a union of allowed document types
export type DocumentType =
  | 'ID_CARD'
  | 'PASSPORT'
  | 'RESIDENCE_PERMIT'
  | 'DRIVER_LICENSE'
  | 'PAN_CARD'
  | 'AADHAAR'
  | 'VISA'
  | 'NATIONAL_PASSPORT'
  | 'PROVISIONAL_DRIVER_LICENSE'
  | 'OLD_ID_CARD'
  | 'MILITARY_CARD'
  | 'ADDRESS_CARD'
  | 'BANK_ID_SE';

// Allowed document types matching the backend
export const allowedDocTypes: DocumentType[] = [
  'ID_CARD',
  'PASSPORT',
  'RESIDENCE_PERMIT',
  'DRIVER_LICENSE',
  'PAN_CARD',
  'AADHAAR',
  'VISA',
  'NATIONAL_PASSPORT',
  'PROVISIONAL_DRIVER_LICENSE',
  'OLD_ID_CARD',
  'MILITARY_CARD',
  'ADDRESS_CARD',
  'BANK_ID_SE',
];

// Human-readable labels for document types
export const docTypeLabels: Record<DocumentType, string> = {
  ID_CARD: 'ID Card',
  PASSPORT: 'Passport',
  RESIDENCE_PERMIT: 'Residence Permit',
  DRIVER_LICENSE: "Driver's License",
  PAN_CARD: 'PAN Card',
  AADHAAR: 'Aadhaar Card',
  VISA: 'Visa',
  NATIONAL_PASSPORT: 'National Passport',
  PROVISIONAL_DRIVER_LICENSE: 'Provisional Driver License',
  OLD_ID_CARD: 'Old ID Card',
  MILITARY_CARD: 'Military Card',
  ADDRESS_CARD: 'Address Card',
  BANK_ID_SE: 'Bank ID (Sweden)',
};

export const initialValues: KycSubmitPayload = {
  firstName: '',
  lastName: '',
  documents: 'PASSPORT', // Default value
  documentNumber: '',
  dateOfBirth: '',
  address: '',
  country: 'US',
  state: '',
  city: '',

};

export const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  documents: Yup.string()
    .required('Document type is required')
    .oneOf(allowedDocTypes, 'Invalid document type') as Yup.Schema<DocumentType>,
  documentNumber: Yup.string()
    .required('Document number is required')
    .min(5, 'Document number must be at least 5 characters')
    .max(20, 'Document number cannot exceed 20 characters'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'You must be at least 18 years old', (value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(100, 'Address cannot exceed 100 characters'),
  country: Yup.string().length(2, 'Country must be a valid 2-letter code (e.g., US)'),
});





// import * as Yup from 'yup';
// import { KycSubmitPayload } from '@/types';

// // Static list of countries with display names and alpha-2 codes
// export const countries = [
//   { name: 'United States', code: 'US' },
//   { name: 'Nigeria', code: 'NG' },
//   { name: 'Argentina', code: 'AR' },
//   { name: 'Kenya', code: 'KE' },
//   { name: 'Indonesia', code: 'ID' },
//   { name: 'United Kingdom', code: 'GB' },
// ];

// export const initialValues: KycSubmitPayload = {
//   firstName: '',
//   lastName: '',
//   documents: 'PASSPORT',
//   documentNumber: '',
//   dateOfBirth: '',
//   address: '',
//   country: 'US',
// };

// export const validationSchema = Yup.object({
//   firstName: Yup.string()
//     .required('First name is required')
//     .min(2, 'First name must be at least 2 characters')
//     .max(50, 'First name cannot exceed 50 characters'),
//   lastName: Yup.string()
//     .required('Last name is required')
//     .min(2, 'Last name must be at least 2 characters')
//     .max(50, 'Last name cannot exceed 50 characters'),
//   documents: Yup.string()
//     .required('Document type is required')
//     .oneOf(['PASSPORT', 'ID_CARD', 'DRIVER_LICENSE'], 'Invalid document type'),
//   documentNumber: Yup.string()
//     .required('Document number is required')
//     .min(5, 'Document number must be at least 5 characters')
//     .max(20, 'Document number cannot exceed 20 characters'),
//   dateOfBirth: Yup.date()
//     .required('Date of birth is required')
//     .max(new Date(), 'Date of birth cannot be in the future')
//     .test('age', 'You must be at least 18 years old', (value) => {
//       const today = new Date();
//       const birthDate = new Date(value);
//       const age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//         return age - 1 >= 18;
//       }
//       return age >= 18;
//     }),
//   address: Yup.string()
//     .required('Address is required')
//     .min(10, 'Address must be at least 10 characters')
//     .max(100, 'Address cannot exceed 100 characters'),
//   country: Yup.string().length(2, 'Country must be a valid 2-letter code (e.g., US)'),
// });