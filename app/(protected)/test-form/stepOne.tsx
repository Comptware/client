'use client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateForm } from '@/store/features/form/formSlice';

export default function StepOne({ next }: { next: () => void }) {
  const dispatch = useAppDispatch();
  const { firstName, lastName } = useAppSelector((s) => s.form);

  const formik = useFormik({
    initialValues: { firstName, lastName },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateForm(values));
      next();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Step 1: Personal Info</h2>

      <input
        name="firstName"
        placeholder="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
      )}

      <input
        name="lastName"
        placeholder="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Next
      </button>
    </form>
  );
}
