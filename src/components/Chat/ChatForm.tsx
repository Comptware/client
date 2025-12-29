// components/ChatForm.tsx
"use client";

import { openChat } from "@/store/features/chat/chatSlice";
import { useAppDispatch } from "@/store/hooks";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  phone?: string;
}

interface Props {
  onSubmitClicked: () => void;
}

export default function ChatForm({ onSubmitClicked }: Props) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (window.fcWidget && typeof window.fcWidget.open === "function") {
      window.fcWidget.user.setProperties({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });

      window.fcWidget.show();
      window.fcWidget.open();
      
      onSubmitClicked();
    }
    dispatch(openChat());
    reset();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative w-full">
        <input
          id="name"
          type="text"
          placeholder=" "
          className={`peer w-full border-b ${
            errors.name ? "border-red-500" : "border-gray-300"
          } focus:outline-none pt-3 pb-1 text-sm focus:border-blue-500 transition`}
          {...register("name", { required: "Name is required" })}
        />
        <label
          htmlFor="name"
          className="absolute left-0 top-0 transform -translate-y-1/2 text-xs text-blue-500 transition-all duration-200 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500"
        >
          Name
        </label>
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="relative w-full">
        <input
          id="email"
          type="email"
          placeholder=" "
          className={`peer w-full border-b ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none pt-3 pb-1 text-sm focus:border-blue-500 transition`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        <label
          htmlFor="email"
          className="absolute left-0 top-0 transform -translate-y-1/2 text-xs text-blue-500 transition-all duration-200 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500"
        >
          Email
        </label>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="relative w-full">
        <input
          id="phone"
          type="tel"
          placeholder=" "
          className={`peer w-full border-b ${
            errors.phone ? "border-red-500" : "border-gray-300"
          } focus:outline-none pt-3 pb-1 text-sm focus:border-blue-500 transition`}
          {...register("phone")}
        />
        <label
          htmlFor="phone"
          className="absolute left-0 top-0 transform -translate-y-1/2 text-xs text-blue-500 transition-all duration-200 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500"
        >
          Phone (optional)
        </label>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <p className="text-xs text-gray-500 leading-snug mt-3">
        This chat may be monitored or recorded by us and our providers. By
        clicking &quot;Start Chat&quot; you accept our
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          {" "}
          Terms
        </a>{" "}
        &amp;
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          {" "}
          Privacy Policy
        </a>
        .
      </p>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Chat
        </button>
      </div>
    </form>
  );
}