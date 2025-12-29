import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateForm } from '@/store/features/form/formSlice';

export default function StepTwo({ next, prev }: { next: () => void; prev: () => void }) {
  const dispatch = useAppDispatch();
  const { dateOfBirth, nextOfKin } = useAppSelector((s) => s.form);

  const formik = useFormik({
    initialValues: { dateOfBirth, nextOfKin },
    validationSchema: Yup.object({
      dateOfBirth: Yup.date().required('Date of Birth is required'),
      nextOfKin: Yup.string().required('Next of Kin is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateForm(values));
      next();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Step 2: Date of Birth & Next of Kin</h2>

      <input
        type="date"
        name="dateOfBirth"
        value={formik.values.dateOfBirth}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
        <p className="text-red-500 text-sm">{formik.errors.dateOfBirth}</p>
      )}

      <input
        name="nextOfKin"
        placeholder="Next of Kin"
        value={formik.values.nextOfKin}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.nextOfKin && formik.errors.nextOfKin && (
        <p className="text-red-500 text-sm">{formik.errors.nextOfKin}</p>
      )}

      <div className="flex justify-between">
        <button onClick={prev} type="button" className="border px-4 py-2 rounded">Back</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}
