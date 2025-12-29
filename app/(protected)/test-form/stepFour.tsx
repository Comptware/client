import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateForm, clearForm } from '@/store/features/form/formSlice';
import { useSubmitFormMutation } from '@/store/features/form/formApi';
import { toast } from 'react-toastify';

export default function StepFour({ prev }: { prev: () => void }) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((s) => s.form);
  const [submitForm, { isLoading }] = useSubmitFormMutation();

  const formik = useFormik({
    initialValues: {
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
    },
    validationSchema: Yup.object({
      documentType: Yup.string().required('Document type is required'),
      documentNumber: Yup.string().required('Document number is required'),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(updateForm(values));
        const res = await submitForm({ ...formData, ...values }).unwrap();
        toast.success(res.message || 'Submitted successfully!');
        dispatch(clearForm());
      } catch (err: any) {
        toast.error(err?.data?.message || 'Submission failed');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Step 4: Identification</h2>

      <input
        name="documentType"
        placeholder="Document Type"
        value={formik.values.documentType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.documentType && formik.errors.documentType && (
        <p className="text-red-500 text-sm">{formik.errors.documentType}</p>
      )}

      <input
        name="documentNumber"
        placeholder="Document Number"
        value={formik.values.documentNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.documentNumber && formik.errors.documentNumber && (
        <p className="text-red-500 text-sm">{formik.errors.documentNumber}</p>
      )}

      <div className="flex justify-between">
        <button onClick={prev} type="button" className="border px-4 py-2 rounded">Back</button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded">
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
