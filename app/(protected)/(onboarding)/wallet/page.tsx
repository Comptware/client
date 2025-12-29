// app/(protected)/wallet/page.tsx
'use client';

import ArrowDown from "@/components/arrows/arrowDown";
import ArrowRight from "@/components/arrows/arrowRight";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function WalletPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(1);
  const [isExchange, setIsExchange] = useState(false);
  const [walletOption, setWalletOption] = useState('suncore');

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const onSelectWalletOptions = (option: any) => {
    setWalletOption(option);
  }

  return (
    <>
      <section id="Intro" className="pt-20 pb-10">
        <div className="container">
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-10">
            <div className="flex-1 relative">
              <p className="md:text-5xl text-3xl text-dark font-normal mb-4 font-caslon md:text-left text-center">Self-guided purchase</p>
            </div>
          </div>
          <hr className="border-primary my-4 w-full" />
          <div className="flex max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="flex-1 relative">
              <p className="md:text-2xl text-xl text-dark mb-4 md:text-left text-center">Bitcoin mining deposits</p>
              <p className="md:text-lg text-sm text-dark mb-4 md:text-left text-center">You can receive your mining deposits directly to a SunCore + Ledger Hard Wallet or your own Bitcoin wallet.</p>
            </div>
          </div>
          <div className="flex flex-col max-w-full md:mx-auto mx-4 relative mt-4">
            <div className="w-full">
              <p className="md:text-2xl text-xl text-primary mb-4 md:text-left text-center">Select your wallet preference:</p>
            </div>
            <div className="flex gap-4 relative">
                <button
                  onClick={() => onSelectWalletOptions('suncore')} 
                  className={`hover:bg-sky-blue hover:shadow-md mb-8 border-b-4 border-primary p-4 text-left w-full
                  ${ walletOption === 'suncore' ? 'bg-sky-blue' : ''}`}> 
                  <h1 className="md:text-lg text-sm font-black">Use SunCore + Ledger Hard Wallet</h1>
                </button>
                <button 
                  onClick={() => onSelectWalletOptions('personal')}
                  className={`hover:bg-sky-blue hover:shadow-md mb-8 border-b-4 border-primary p-4 text-left w-full
                  ${ walletOption === 'personal' ? 'bg-sky-blue' : ''}`}>
                  <h1 className="md:text-lg text-sm font-black">Use my own Bitcoin wallet</h1>
                </button>
            </div>
          </div>
          { walletOption === 'suncore' && (
          <div className="flex flex-col max-w-full md:mx-auto mx-4 relative my-4">
            
            <div className="flex relative">
              <div className="w-[20%] p-4">
                <div className="rounded-full text-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/images/icons/ledger_wallet.png`}
                    alt="hassle-free"
                    width={75}
                    height={75}
                    className="inline"
                  />
                </div>
              </div>
              <div className="w-[80%] p-4 border border-light-blue">
                <p className="md:text-lg text-sm text-dark mb-4 md:text-left text-center">Use SunCore + Ledger Hard Wallet</p>
                <hr className="border-light-blue my-4 w-full" />
                <div className="flex w-full">
                  <div className="flex-a relative">
                    <p className="md:text-lg text-sm text-dark mb-4 md:text-left text-center">Cost $0</p>
                  </div>
                  <div className="flex-1 text-right my-auto">
                    <Link  className="disabled:opacity-50 disabled:cursor-not-allowed inline-block bg-primary text-white font-black rounded-full hover:bg-light-blue px-10 py-2 mr-4"
                    href="/pay">Next</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
          { walletOption === 'personal' && (
          <>
            <div className="flex max-w-full md:mx-auto mx-4 relative mt-8">
              <div className="flex-1 relative">
                <p className="md:text-2xl text-xl text-dark mb-4 md:text-left text-center">Enter your wallet details</p>
                <p className="md:text-lg text-sm text-dark mb-4 md:text-left text-center">Make sure all information is correct — transactions can&apos;t be reversed once sent.</p>
              </div>
            </div>
            <div className="flex flex-col bg-shadow-gray/40 rounded-2xl max-w-full md:mx-auto mx-4 p-8 relative mt-4">
              <div className="w-full">
                <p className="md:text-2xl text-xl text-dark mb-4 md:text-left text-center">Select the kind of wallet where you want to receive your deposits.</p>
              </div>
              <div className="w-full">
                <button
                  onClick={() => toggle(1)}
                  className="flex p-4 text-left text-gray-800"
                >
                  <span className="font-medium mr-8">Wallet Type</span>
                  {activeIndex === 1 ? (<ArrowDown />) : (<ArrowRight />)}
                </button>
                <AnimatePresence initial={false}>
                  {activeIndex === 1 && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600">
                        <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              // checked={selectedOptions.includes(option)}
                              onChange={() => setIsExchange(false)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">Personal / Non-custodial  (e.g., Ledger, Trezor, MetaMask)</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isExchange}
                              onChange={(e) => setIsExchange(e.target.checked)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">Custodial exchange  (e.g., Coinbase, Kraken, Binance)</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <span className="font-medium mr-8">Wallet name or provider</span>
                        </div>
                        <div className="mb-0">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="Example:  Ledger Nano X, Coinbase, Trezor Suite, etc."
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-full">
                <button
                  onClick={() => toggle(2)}
                  className="flex p-4 text-left text-gray-800"
                >
                  <span className="font-medium mr-8">Network & Address</span>
                  {activeIndex === 2 ? (<ArrowDown />) : (<ArrowRight />)}
                </button>
                <AnimatePresence initial={false}>
                  {activeIndex === 2 && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600">
                        <div className="mb-4">
                          <span className="font-medium">Cryptocurrency</span>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="Bitcoin (BTC)"
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                          <div className="font-medium">Network</div>
                          <div className="mr-8">(Deposits must match the selected network.)</div>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              // checked={selectedOptions.includes(option)}
                              // onChange={() => handleChange(option)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">Bitcoin Mainnet</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              // checked={selectedOptions.includes(option)}
                              // onChange={() => handleChange(option)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">Lightning Network (advanced users)</span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <span className="font-medium">BTC deposit address</span>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="Example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                          <div className="font-medium">Confirm BTC deposit address</div>
                          <div className="mr-8">(Please re-enter to confirm. Address must match exactly.)</div>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder=""
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isExchange && (
              <div className="w-full">
                <button
                  onClick={() => toggle(3)}
                  className="flex p-4 text-left text-gray-800"
                >
                  <span className="font-medium mr-8">Exchange-specific details (if using an exchange)</span>
                  {activeIndex === 3 ? (<ArrowDown />) : (<ArrowRight />)}
                </button>
                <AnimatePresence initial={false}>
                  {activeIndex === 3 && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600">
                        <div className="mb-4">
                          <div className="w-full">Deposit tag / memo / reference ID</div>
                          <div className="mr-8">(Some exchanges require this for routing.)</div>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder=""
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}
              <div className="w-full">
                <button
                  onClick={() => toggle(4)}
                  className="flex p-4 text-left text-gray-800"
                >
                  <span className="font-medium mr-8">Verification</span>
                  {activeIndex === 4 ? (<ArrowDown />) : (<ArrowRight />)}  
                </button>
                <AnimatePresence initial={false}>
                  {activeIndex === 4 && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600">
                      <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              // checked={selectedOptions.includes(option)}
                              // onChange={() => handleChange(option)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">
                              <p>Test transaction confirmation:</p>
                              <p>I understand SunCore may send a small test transaction to verify this address before regular deposits begin.</p>
                            </span>
                          </label>
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              // checked={selectedOptions.includes(option)}
                              // onChange={() => handleChange(option)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-gray">
                              <p>Wallet ownership confirmation:</p>
                              <p>I confirm this is my own Bitcoin wallet and that I have full access and control of the funds.</p>
                            </span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-full">
                <button
                  onClick={() => toggle(5)}
                  className="flex p-4 text-left text-gray-800"
                >
                  <span className="font-medium mr-8">Contact and authorization</span>
                  {activeIndex === 5 ? (<ArrowDown />) : (<ArrowRight />)}
                </button>
                <AnimatePresence initial={false}>
                  {activeIndex === 5 && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-600">
                        <div className="mb-4">
                          <span className="font-medium mr-8">Account name</span>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder=""
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                          <span className="font-medium mr-8">Email associated with wallet (optional)</span>
                        </div>
                        <div className="mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder=""
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-4">
                          <span className="font-medium mr-8">Digital signature / acknowledgment</span>
                        </div>
                        <div className="mb-0">
                          <input
                            type="text"
                            name="firstName"
                            placeholder=""
                            className="w-full p-3 border rounded-xl bg-shadow-gray shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex max-w-full md:mx-auto mx-4 relative my-8 justify-center">
              <Link  className="disabled:opacity-50 disabled:cursor-not-allowed inline-block bg-primary text-white font-black rounded-full hover:bg-light-blue px-10 py-2 mr-4"
                href="/pay">Next</Link>
            </div>
          </>
          )}
        </div>
      </section>
    </>
  )
}


//// debugging
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