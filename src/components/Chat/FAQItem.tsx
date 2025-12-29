// components/FAQItem.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  disclaimer?: boolean;
  showDisclaimer?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FAQItem = ({ question, answer, disclaimer, showDisclaimer }: FAQItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(isExpanded ? answerRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div
      className="min-w-[195px] min-h-[110px] px-4 py-4 bg-gray-100 rounded-lg relative overflow-hidden transition-all duration-300 hover:bg-gray-200"
      role="region"
      aria-labelledby={`faq-question-${question.replace(/\s+/g, "-")}`}
    >
      <div className="slider-faq">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={`faq-answer-${question.replace(/\s+/g, "-")}`}
          id={`faq-question-${question.replace(/\s+/g, "-")}`}
        >
          <div className="text-sm font-medium text-gray-800 pr-4 transition-colors duration-200 hover:text-gray-900">
            {question}
          </div>
        </div>
        <div
          className={`divider ${
            isExpanded ? "opacity-100" : "opacity-0"
          } h-px bg-gray-200 my-2 transition-all duration-300 ease-in-out`}
        ></div>
        <div
          id={`faq-answer-${question.replace(/\s+/g, "-")}`}
          ref={answerRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
          aria-hidden={!isExpanded}
        >
          <div className="text-sm text-dark pt-1 pb-1">{answer}</div>
          {disclaimer ? (
            <div className="text-xs text-dark flex">
              <button
                onClick={showDisclaimer}
                className="text-xs text-primary hover:text-dark flex gap-1">
                <svg 
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg> Disclaimer
              </button>
            </div>
            ) : (<></>)}
        </div>
      </div>

      <button
        className="absolute bottom-3 right-3 transition-transform duration-300 hover:scale-110"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={
          isExpanded
            ? `Collapse answer for ${question}`
            : `Expand answer for ${question}`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xlinkHref="http://www.w3.org/1999/xlink"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          className="Icon-sc-13rk6k7-0 kIqXyf expand-icon icon"
          data-qa="expand-btn-1"
        >
          <image
            width="15"
            height="15"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAK5JREFUOE+d0jEOQUEURuFPomATohCJwh7sQBRaO1BYicIOtAqxg9crFRJRiCVoKBQyxYvJy8OMW81k5pw79880cMMRd+9aYhfta5cN7NHEFOdfQHwe4AJzrHMFJTzCMFcQw+FFWYIAjyvhlIIJLt8yCHBd9fHA9R84KfRPnWO4gxZOVWMK3MUWMxwiwTgFDvd72FQERSpcJ8iCq4JVTudy3HKEZyocPtIiCquNwQuGKiFcvLCZ5gAAAABJRU5ErkJggg=="
            opacity="0.5"
          ></image>
        </svg>
      </button>
    </div>
  );
};

export default FAQItem;
