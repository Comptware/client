"use client";

import { useAppSelector } from "@/store/hooks";
import React, { useState, useEffect } from "react";

type AgreementStatus = {
  success: boolean;
  message: string;
  envelopeId?: string;
} | null;

export default function Page() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API;
  
  const { token } = useAppSelector((s) => s.auth);

  const [docuSignFormData, setDocuSignFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    clientCompany: "",
    projectDescription: "",
    contractValue: "",
    startDate: "",
    completionDate: "",
    paymentTerms: "30% upfront, 70% upon completion",
    systemSize: "",
    equipmentSpecs: "",
    warrantyPeriod: "25 years",
    emailSubject:
      "SunCore Purchase & Management Agreement - Please Review and Sign",
  });
  
  
  const [isCreatingAgreement, setIsCreatingAgreement] = useState(false);
  const [agreementStatus, setAgreementStatus] = useState<AgreementStatus>(null);
  const [agreementLoading, setAgreementLoading] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: string }[]
  >([]);
  const [agreed, setAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateAgreement = async () => {
    if (!agreed) {
      addNotification("You must agree to the Terms & Conditions.", "error");
      return;
    }

    setAgreementLoading(true);
    setIsCreatingAgreement(true);
    setAgreementStatus(null);

    try {
      const response = await fetch(
        `${API_BASE}/docusign/create-suncore-agreement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
         body: JSON.stringify(docuSignFormData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAgreementStatus({
          success: true,
          message: "Check your Email!",
          envelopeId: data.envelopeId,
        });
        addNotification("Check your Email!", "success");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error: any) {
      console.error("Something went wrong", error);
      setAgreementStatus({
        success: false,
        message: error.message || "Something went wrong",
      });
      addNotification("Try again", "error");
    } finally {
       setIsCreatingAgreement(false);
      setAgreementLoading(false);
    }
  };

  const addNotification = (message: string, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div 
        className={`flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Header with animated icon */}
        <div className="relative">
          <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
            mounted ? 'rotate-0 scale-100' : 'rotate-12 scale-75'
          }`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {mounted && (
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
          )}
        </div>

        <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          SunCore Digital Agreement
        </h1>

        <div className={`text-gray-600 leading-relaxed text-lg transition-all duration-700 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="mb-4">
            Welcome to <span className="font-semibold text-blue-600">SunCore Digital</span>.  
            We are committed to delivering reliable solar energy solutions and
            professional project management services.
          </p>
          <p>
            This agreement ensures clarity between SunCore Digital and our valued
            clients regarding project scope, timelines, equipment specifications,
            and payment terms. By proceeding, you acknowledge that you have read
            and understood the agreement and consent to the outlined terms.
          </p>
        </div>

        {/* Checkbox with enhanced animation */}
        <label className={`flex items-center gap-3 mt-6 cursor-pointer group transition-all duration-700 delay-400 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="relative">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
              agreed 
                ? 'bg-blue-500 border-blue-500 scale-110' 
                : 'border-gray-300 group-hover:border-blue-400 group-hover:scale-105'
            }`}>
              {agreed && (
                <svg 
                  className="w-3 h-3 text-white transform transition-all duration-200 scale-0 animate-[checkmark_0.3s_ease-out_forwards]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{
                    animation: agreed ? 'checkmark 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
             {agreementLoading ? "Please wait..." : "I Agree to the "}
            <a
              href="#"
              className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200"
            >
              Terms & Conditions
            </a>
          </span>
        </label>

        {/* Button with loading animation */}
        <button
          onClick={handleCreateAgreement}
          disabled={agreementLoading || !agreed}
          className={`w-full max-w-sm rounded-xl px-8 py-4 font-semibold text-white text-lg relative overflow-hidden transition-all duration-700 delay-500 transform ${
            mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          } ${
            agreed && !agreementLoading
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {agreementLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
            </div>
          )}
          <span className="relative flex items-center justify-center gap-2">
            {agreementLoading && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {agreementLoading ? "Please wait..." : "I Agree & Continue"}
          </span>
        </button>

        {/* Status message with animation */}
        {agreementStatus && (
          <div className={`mt-4 p-4 rounded-lg transition-all duration-500 transform ${
            agreementStatus.success 
              ? "bg-green-50 border border-green-200 text-green-700 animate-[slideUp_0.5s_ease-out]" 
              : "bg-red-50 border border-red-200 text-red-700 animate-[slideUp_0.5s_ease-out]"
          }`}>
            <div className="flex items-center gap-2">
              {agreementStatus.success ? (
                <svg className="w-5 h-5 animate-[checkmark_0.5s_ease-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium">{agreementStatus.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Animated notifications */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n, index) => (
          <div
            key={n.id}
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 transform animate-[slideInRight_0.3s_ease-out] ${
              n.type === "success"
                ? "bg-green-500"
                : n.type === "error"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center gap-2">
              {n.type === "success" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {n.type === "error" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {n.message}
            </div>
          </div>
        ))}

       <a href="/auth/logout" className="ml-4 hover:underline">Logout</a>
      </div>

      {/* Add custom keyframes styles */}
      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}