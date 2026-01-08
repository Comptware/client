// app/(protected)/cart/page.tsx
"use client";

import PaymentAgreementModal from "@/components/modals/paymentAgreementModal";
import PaymentRequestButton from "@/components/PaymentRequestButton";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import { useGetCartQuery } from "@/store/features/cart/cartApi";
import {
  useCreateBitpayInvoiceMutation,
  useCreateDepositIntentMutation,
  useCreatePaymentIntentMutation,
} from "@/store/features/payment/paymentApi";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import WireTransferForm from "./wireTransferForm";

const BackButton = ({ handleBack }: any) => {
  return (
    <button
      onClick={handleBack}
      className="inline-block bg-primary text-white rounded-full hover:bg-blue-700 px-8 py-1"
    >
      Back
    </button>
  );
};

export default function PayPage() {
  const { token, user } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentOption, setPaymentOption] = useState("buy");
  const [payment, setPayment] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [bitpayUrl, setBitpayUrl] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"deposit" | "balance" | null>(
    null
  );
  const [autoPaymentHandled, setAutoPaymentHandled] = useState(false);
  const [createDepositIntent] = useCreateDepositIntentMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [createBitpayInvoice] = useCreateBitpayInvoiceMutation();

  const { data: cartData, isLoading } = useGetCartQuery(undefined, {
    skip: !token,
  });

  const cart = cartData ?? {
    items: [],
    totalAmount: 0,
    remainingAmount: 0,
    currency: "USD",
    currencySymbol: "$",
    depositApplied: 0,
    status: "ABANDONED",
  };

  const onSelectPaymentOptions = (option: any) => {
    if (option === "finance") setPayment(null);
    setPaymentOption(option);
  };

  const onSelectPayment = (payment: any) => {
    setPayment(payment);
    if (payment === "credit_card") handlePayment();
    if (payment === "bitpay") handleBitPay();
  };

  useEffect(() => {
    if (autoPaymentHandled || isLoading || !user) return;

    const selectedPayment = searchParams.get("payment");
    if (!selectedPayment) return;

    setAutoPaymentHandled(true);
    if (selectedPayment === "credit_card") onSelectPayment("credit_card");
    if (selectedPayment === "bitpay") onSelectPayment("bitpay");
    if (selectedPayment === "wire") onSelectPayment("wire");
  }, [autoPaymentHandled, isLoading, onSelectPayment, searchParams, user]);

  const handleBitPay = async () => {
    setLoadingPayment(true);

    try {
      if (!user?.depositPaid) {
        alert("You can only use BitPay for remaining balance payments.");
        router.push("/pay");
        return;
      }

      const { paymentUrl } = await createBitpayInvoice().unwrap();
      setBitpayUrl(paymentUrl);
    } finally {
      setLoadingPayment(false);
    }
  };

  /** Main payment handler with KYC / deposit checks */
  const handlePayment = async () => {
    setLoadingPayment(true);

    try {
      if (!user) throw new Error("User not found");

      // Redirect if KYC not approved
      if (user.kycStatus !== "APPROVED") {
        router.push("/kyc");
        return;
      }

      // Step 1: Deposit (Stripe only)
      if (!user.depositPaid) {
        setPaymentStep("deposit");
        const { clientSecret } = await createDepositIntent().unwrap();
        setClientSecret(clientSecret);
        return;
      }

      // Step 2: Balance payment (Stripe)
      setPaymentStep("balance");
      const { clientSecret } = await createPaymentIntent().unwrap();
      setClientSecret(clientSecret);
    } finally {
      setLoadingPayment(false);
    }
  };

  const paymentAmount = user?.depositPaid
    ? cart.remainingAmount ?? cart.totalAmount // deposit already paid → pay the balance
    : cart.totalAmount ?? 0;

  return (
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">
                Self-guided purchase
              </p>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-dark mb-4 md:text-left text-center">
                Payment options
              </p>
              <p className="md:text-2xl text-xl text-primary mb-4 md:text-left text-center">
                Select what works best for you:
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-12">
            {isLoading ? (
              <p className="text-black w-full text-center">Loading...</p>
            ) : (
              <>
                <div className="py-4 w-full lg:max-w-lg">
                  <section id="payment-option">
                    <button
                      onClick={() => onSelectPaymentOptions("buy")}
                      className={`rounded-2xl hover:bg-sky-blue hover:shadow-md mb-8 border border-primary p-5 text-left w-full
                        ${paymentOption === "buy" ? "bg-sky-blue" : ""}`}
                    >
                      <h1 className="md:text-lg text-sm font-black">
                        Purchase Bundle
                      </h1>
                      <hr className="border-dark my-4 w-full" />
                      <p className="md:text-lg text-sm font-black">
                        {user?.depositPaid
                          ? `Remaining Balance: ${
                              cart.currencySymbol
                            }${formatCurrency(cart.remainingAmount)}`
                          : `Deposit: ${cart.currencySymbol}${formatCurrency(
                              paymentAmount
                            )}`}
                      </p>
                      <p className="md:text-sm text-xs mb-4">
                        Pay with crypto, wire transfer or credit card
                      </p>
                    </button>
                    <button
                      onClick={() => onSelectPaymentOptions("finance")}
                      className={`rounded-2xl hover:bg-sky-blue hover:shadow-md mb-8 border border-primary p-5 text-left w-full
                        ${paymentOption === "finance" ? "bg-sky-blue" : ""}`}
                    >
                      <h1 className="md:text-lg text-sm font-black">
                        Finance Bundle
                      </h1>
                      <p className="md:text-sm text-xs mb-4">
                        ABC Finance company Monthly Installments
                      </p>
                      <hr className="border-dark my-4 w-full" />
                      <p className="md:text-sm text-xs">
                        $999.00/mo for XX months*
                      </p>
                      <p className="md:text-sm text-xs mb-4">$XXXXX.00 Total</p>
                    </button>
                  </section>
                </div>
                <div className="py-4 w-full lg:max-w-lg">
                  {paymentOption === "buy" && payment === "credit_card" && (
                    <section id="payment-option">
                      {clientSecret && (
                        <div className="text-center">
                          <PaymentRequestButton
                            clientSecret={clientSecret}
                            amount={paymentAmount}
                            currency={cart.currency}
                            onSuccess={() =>
                              router.push(
                                paymentStep === "deposit"
                                  ? "/sign-agreement"
                                  : "/dashboard"
                              )
                            }
                          />
                          <StripeCheckoutForm
                            clientSecret={clientSecret}
                            onSuccess={() =>
                              router.push(
                                paymentStep === "deposit"
                                  ? "/sign-agreement"
                                  : "/dashboard"
                              )
                            }
                          />
                        </div>
                      )}
                      <BackButton handleBack={() => setPayment(null)} />
                    </section>
                  )}
                  {paymentOption === "buy" && payment === "bitpay" && (
                    <section id="payment-option">
                      {bitpayUrl ?? (
                        <Link
                          href={bitpayUrl}
                          className="bg-white border border-primary font-medium rounded-xl w-full hover:text-white hover:bg-primary px-12 py-4 mb-4"
                        >
                          Pay Now
                        </Link>
                      )}
                      <BackButton handleBack={() => setPayment(null)} />
                    </section>
                  )}
                  {paymentOption === "buy" && payment === "wire" && (
                    <section id="payment-option">
                      <WireTransferForm />

                      <BackButton handleBack={() => setPayment(null)} />
                    </section>
                  )}

                  {!payment && paymentOption === "buy" && (
                    <section id="payment-option">
                      <button
                        onClick={() => onSelectPayment("credit_card")}
                        className="bg-white border border-primary font-medium rounded-xl w-full hover:text-white hover:bg-primary px-12 py-4 mb-8"
                      >
                        Pay with Stripe/Credit Card
                      </button>
                      <button
                        onClick={() => onSelectPayment("bitpay")}
                        className="bg-white border border-primary font-medium rounded-xl w-full hover:text-white hover:bg-primary px-12 py-4 mb-8"
                      >
                        Pay with Bitpay
                      </button>
                      <button
                        onClick={() => onSelectPayment("wire")}
                        className="bg-white border border-primary font-medium rounded-xl w-full hover:text-white hover:bg-primary px-12 py-4 mb-8"
                      >
                        Wire Transfer
                      </button>
                    </section>
                  )}
                  {!payment && paymentOption === "finance" && (
                    <section id="payment-option ">
                      <div className="mb-8 p-5 text-center">
                        <h1 className="md:text-lg text-sm text-red-600">
                          Coming Soon
                        </h1>
                      </div>
                    </section>
                  )}
                  <section id="payment-option">
                    <button
                      onClick={() => setAgreementOpen(true)}
                      className="bg-white border border-primary font-medium rounded-xl w-full hover:text-white hover:bg-primary px-12 py-4 my-4"
                    >
                      SunCore Digital Management Agreement
                    </button>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
        <PaymentAgreementModal
          isOpen={agreementOpen}
          onClose={() => setAgreementOpen(false)}
        >
          <div className="max-h-[60vh] overflow-y-auto mb-4">
            <h2 className="text-xl font-semibold mb-4">Payment Agreement</h2>
            <h4 className="text-lg font-semibold mb-4">General</h4>
            <p className="text-gray-700 mb-4">
              These Payment Terms describe your agreement to pay for current and
              future goods and services, together with any charges or fees
              applied by us related to goods or services. In these Payment
              Terms, &apos;we&apos; and &apos;us&apos; mean the SunCore Digital
              group entity supplying the goods and services in your country.
            </p>
            <p className="text-gray-700 mb-4">
              To use services like Bitcoin wallet deposits or SunCore&apos;s
              zero-energy-cost Bitcoin mining platform, you authorize SunCore
              Digital to store and validate your payment method as stated in
              these Payment Terms. SunCore Digital LLC may amend these terms
              from time to time, and any changes are effective when posted to
              this page.
            </p>
            <p className="text-gray-700 mb-4">
              Following your initial non-refundable deposit, a SunCore Digital
              Ambassador will contact you to finalize your hardware purchase and
              go over all payment options to initiate the onboarding process to
              becoming a SunCore client.
            </p>
            <p className="text-gray-700 mb-4">
              When you add a payment method to your SunCore Digital Account,
              such as a credit card, certain information including, but not
              limited to device location, device identification number, and card
              information may be sent to SunCore and shared with our payment
              processor. Card information is encrypted during the transmission
              and SunCore will not have access to the actual card number.
            </p>
            <p className="text-gray-700 mb-4">
              When the stored payment method or a new credit card is used for
              purchasing goods and services on a SunCore hosted website or
              application, the necessary information to process payment will be
              shared with our global processors and our banking partners, to
              process your payment, comply with financial regulations, to
              prevent fraud, and for troubleshooting any payment issues.
            </p>
            <p className="text-gray-700 mb-4">
              When you pay using your bank account details, those details are
              stored by SunCore Digital in an encrypted format that prevents
              unauthorized access without specific permissions. For information
              on how we handle your payment information, please see
              Suncore&apos;s{" "}
              <a href="#" className="text-primary">
                Privacy Notice.
              </a>
            </p>
            <p className="text-gray-700 mb-4">
              You must maintain at least one valid payment method in your
              SunCore Account at the commencement of each earnings cycle. Every
              SunCore client is granted a cashless ASIC upgrade option at the
              commencement of each cycle. Non-cashless upgrade accounts must
              maintain a valid payment method to avoid service interruptions
              mid-cycle and remain in good standing.
            </p>
            <p className="text-gray-700 mb-4">
              Any services received may result in charges being applied to your
              saved payment method, and charges may include taxes as required by
              law. Your failure to maintain accurate, complete, and up-to-date
              payment information, including an invalid or expired payment
              method, may result in account termination.
            </p>
            <p className="text-gray-700 mb-4">
              If any attempt to recover funds from you should fail using the
              payment method saved in your SunCore Account, you agree to allow
              SunCore Digital LLC to recover all or less than all of the amount
              owed for goods or services as set out in this clause. If we are
              unable to collect payment, we may contact you based on your
              information on file or may request payment when we are performing
              services for you until these issues are resolved.
            </p>
          </div>
          <button
            onClick={() => setAgreementOpen(false)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-black"
          >
            Close
          </button>
        </PaymentAgreementModal>
      </section>
    </>
  );
}

//// debugging layout.tsx
// import { Header } from "@/components/header/header";

//     export default async function ProtectedLayout({
//       children,
//     }: {
//       children: React.ReactNode;
//     }) {
//       return (
//         <>
//           <main>
//             <Header dark={true} />
//             {children}
//           </main>
//         </>
//       );
//     }
