'use client';

export default function WireTransferForm() {
  return (
    <div className="max-w-md">
      <div className="flex items-center">
        {/* Icon Box */}
        <div className="bg-gray-100 px-4 py-3 rounded-l-md border border-r-0 border-gray-300 flex items-center">
          {/* Email Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 
                 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 
                 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.072 1.913l-6.75 
                 4.05a2.25 2.25 0 01-2.256 0l-6.75-4.05A2.25 2.25 
                 0 012.25 6.993V6.75"
            />
          </svg>
        </div>

        <input
          type="email"
          placeholder="yours@example.com"
          className="flex-1 border border-gray-300 border-l-0 rounded-r-md py-3 px-3 focus:ring-blue-500 focus:border-blue-500"
        />

        <button className="ml-4 md:text-xl text-lg text-dark hover:text-dark-gray">
          Submit
        </button>
      </div>

      <p className="text-sm text-dark-gray my-4">
        For wire transfers, please enter your email address. You will receive an email
        with our secure wire instructions.
      </p>
    </div>
  );
}
