// Just for testing multi-step form functionality
'use client';
import { useEffect, useState } from 'react';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import StepFour from './stepFour';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { clearForm } from '@/store/features/formSlice';


export default function MultiStepForm() {
  const [step, setStep] = useState(1);
    // const dispatch = useAppDispatch();
    // const formData = useAppSelector((s) => s.form);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  // useEffect(()=>{
  //         dispatch(clearForm());
  // },[])

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      {step === 1 && <StepOne next={next} />}
      {step === 2 && <StepTwo next={next} prev={prev} />}
      {step === 3 && <StepThree next={next} prev={prev} />}
      {step === 4 && <StepFour prev={prev} />}
      <p className="text-center text-sm text-gray-500 mt-4">Step {step} of 4</p>
    </div>
  );
}
