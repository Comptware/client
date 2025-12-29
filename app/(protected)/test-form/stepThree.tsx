import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateForm } from '@/store/features/form/formSlice';
import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
} from '@/store/features/geo/geoApi';
import { useState, useEffect } from 'react';

export default function StepThree({ next, prev }: { next: () => void; prev: () => void }) {
  const dispatch = useAppDispatch();
  const { address, country, state, city } = useAppSelector((s) => s.form);

  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedState, setSelectedState] = useState(state);

  const { data: countries = [] } = useGetCountriesQuery(undefined);
  const { data: states = [] } = useGetStatesQuery(selectedCountry, { skip: !selectedCountry });
  const { data: cities = [] } = useGetCitiesQuery(
    { countryIso: selectedCountry, stateIso: selectedState },
    { skip: !selectedCountry || !selectedState }
  );

  const formik = useFormik({
    initialValues: { address, country, state, city },
    validationSchema: Yup.object({
      address: Yup.string().required('Address is required'),
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateForm(values));
      next();
    },
  });

  // sync dropdown selections
  useEffect(() => {
    if (selectedCountry) formik.setFieldValue('country', selectedCountry);
    if (selectedState) formik.setFieldValue('state', selectedState);
  }, [selectedCountry, selectedState]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Step 3: Address Info</h2>

      <input
        name="address"
        placeholder="Address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border p-2 mb-2 w-full"
      />
      {formik.touched.address && formik.errors.address && (
        <p className="text-red-500 text-sm">{formik.errors.address}</p>
      )}

      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedState('');
        }}
        className="border p-2 mb-2 w-full"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.iso2} value={c.iso2}>{c.emoji} {c.name}</option>
        ))}
      </select>

      {states?.length > 0 && (
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.iso2} value={s.iso2}>{s.name}</option>
          ))}
        </select>
      )}

      {cities?.length > 0 && (
        <select
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      )}

      <div className="flex justify-between">
        <button onClick={prev} type="button" className="border px-4 py-2 rounded">Back</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}
