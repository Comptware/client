// components/ChatWidget.tsx
"use client";

import { 
  handleAmbassadorHelp, 
  handleDisclaimerClick, 
  handleLanguageSelect, 
  handleReset, 
  handleSelfCheckout, 
  openChat } from "@/store/features/chat/chatSlice";
import ChatForm from "./ChatForm";
import FAQItem from "./FAQItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface FAQData {
  faqs: {
    question: string;
    answer: string;
    disclaimer?: boolean;
  }[];
}

const faqData: FAQData = {
  faqs: [
    {
      question: "What payment methods can I use?",
      answer: "We accept major credit cards, e-checks, Apple Pay, and Bitpay for clients wishing to pay using BTC.",
    },
    {
      question: "How much Bitcoin can I earn?",
      answer: "Earnings depend on the number of bundles purchased. The average SunCore client buys 2.72 bundles.",
    },
    {
      question: "What additional fees apply?",
      answer: "A simple fixed management fee from earnings covers everything. No out of pocket surprises.",
    },
    {
      question: "How quickly does my hardware begin to earn BTC?",
      answer: "Subject to supply chains, activation is typically within 60 days from becoming a client.",
    },
    {
      question: "How frequently is my ASIC upgraded?",
      answer: "ASICS are automatically upgraded after each 40-month earnings cycle.",
    },
    {
      question: "Can I gift a SunCore bundle?",
      answer: "Yes. There are certain restrictions. Ask your Ambassador.",
    },
    {
      question: "Do you offer financing?",
      answer: "Yes. Speak with a Sales Ambassador for more information.",
      disclaimer: true
    },
    {
      question: "Do I own my Bitcoin mining hardware?",
      answer: "Yes. Clients own all ASICs listed on their dashboard.",
    },
  ],
};

export function SEOFAQSection() {
  return (
    <div className="hidden md:block" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      {faqData.faqs.map((faq, index) => (
        <div 
          key={index} 
          className="mb-6" 
          itemScope 
          itemProp="mainEntity" 
          itemType="https://schema.org/Question"
        >
          <h3 className="text-lg font-semibold" itemProp="name">{faq.question}</h3>
          <div 
            itemScope 
            itemProp="acceptedAnswer" 
            itemType="https://schema.org/Answer"
          >
            <p className="text-gray-600 mt-2" itemProp="text">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const { 
    isOpen, 
    showLanguageModal, 
    showChatForm,
    showDisclaimer
  } = useAppSelector((state) => state.chat);

    const scrollLeft = () => {
    document
      .getElementById("faqContainer")
      ?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    document
      .getElementById("faqContainer")
      ?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isOpen && (
          <div
            className="w-[360px] max-w-full border border-gray-200 bg-white rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-primary p-4 border-b border-primary">
              <div className="text-white font-medium">How can we help you?</div>
              <button
                onClick={() => dispatch(openChat())}
                className="text-white hover:text-blue-100 text-xl font-thin focus:outline-none transition-colors"
                aria-label="Close chat"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.106 5.106a.75.75 0 0 1 1.06 0L12 10.939l5.834-5.833a.75.75 0 1 1 1.06 1.06L13.062 12l5.834 5.834a.75.75 0 0 1-1.061 1.06L12 13.061l-5.833 5.833a.75.75 0 1 1-1.061-1.06L10.94 12 5.106 6.166a.75.75 0 0 1 0-1.06Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-4 px-5 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex justify-between w-full items-between gap-2">
                    <div className="flex gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">
                        Our FAQ&apos;s
                      </span>
                    </div>
                    <div className="flex gap-5">
                      <button
                        onClick={scrollLeft}
                        className="text-gray-400 text-[14px] cursor-pointer"
                        aria-label="Scroll FAQs left"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={scrollRight}
                        className="text-gray-400 text-[14px] cursor-pointer"
                        aria-label="Scroll FAQs right"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  id="faqContainer"
                  className="flex items-center gap-4 overflow-x-auto pb-4 flex-nowrap scroll-container hide-scrollbar"
                  role="list"
                >
                  {faqData.faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      disclaimer={faq.disclaimer}
                      showDisclaimer={() => dispatch(handleDisclaimerClick())}
                    />
                  ))}
                </div>
              </div>

              {/* disclaimer */}
              { showDisclaimer && (
                <div className="mb-6 bg-gray-100 rounded-md">
                  <div className="flex justify-between items-center p-2">
                    <div className="text-dark font-medium flex gap-2">
                      <svg 
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg> Disclaimer
                    </div>
                    <button
                      onClick={() => dispatch(handleDisclaimerClick())}
                      className="text-dark font-black hover:text-blue-100 text-sm"
                      aria-label="Close Disclaimer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.106 5.106a.75.75 0 0 1 1.06 0L12 10.939l5.834-5.833a.75.75 0 1 1 1.06 1.06L13.062 12l5.834 5.834a.75.75 0 0 1-1.061 1.06L12 13.061l-5.833 5.833a.75.75 0 1 1-1.061-1.06L10.94 12 5.106 6.166a.75.75 0 0 1 0-1.06Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-dark p-2">
                  The operator of this website is not a lender and does not make loans or credit decisions. This website does not constitute an offer or solicitation to lend or provide funding. Providing your information on this website does not guarantee that you will be approved for a loan or other financial product. The operator of this website does not endorse or charge you for any service or product. Rates as of 8/14/2025. Advertised rates and terms are subject to change without notice. Estimated interest rates, APRs, and other terms are not binding in any way. Pre-qualifications use a soft credit pull, which does not impact your credit score.
                  </p>
                </div>
              )}

              {!showLanguageModal && !showChatForm && (
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-3">
                    How do you prefer to become a SunCore client?
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => dispatch(handleAmbassadorHelp())}
                      className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-left flex items-center justify-between"
                    >
                      Ambassador Help
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => dispatch( handleSelfCheckout() )}
                      className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-left flex items-center justify-between"
                    >
                      Self-Directed Checkout
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {showLanguageModal && (
                <div id="languageModal">
                  <h3 className="text-sm font-bold mb-3">
                    Select your preferred language:
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => dispatch(handleLanguageSelect("en"))}
                      className="language-option w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      English
                    </button>
                    <button
                      onClick={() => dispatch(handleLanguageSelect("fr"))}
                      className="language-option w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      Français
                    </button>
                    <button
                      onClick={() => dispatch(handleLanguageSelect("es"))}
                      className="language-option w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      Español
                    </button>
                  </div>
                </div>
              )}

              {showChatForm && (
                <div id="chatForm">
                  <h2 className="text-sm font-bold mb-4 uppercase text-gray-700 tracking-wider">
                    Chat with us
                  </h2>
                  <ChatForm
                    onSubmitClicked={() => {
                      dispatch(handleReset());
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => dispatch(openChat()) }
          className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}