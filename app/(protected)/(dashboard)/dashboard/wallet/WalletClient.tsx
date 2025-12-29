"use client";

import { useAppSelector } from "@/store/hooks";
import React, { useState } from "react";
import { EditWallet } from "./editWallet";

export const miningDeposit = [
  {
    id:'suncore', 
    label: "Use SunCore + Ledger Hard Wallet", 
  },
  {
    id: 'personal',
    label: "Use my own Bitcoin wallet"
  }
];

export type Wallet = {
  deposit: string;
  type: string;
  name: string;
  cryptocurrency?: string;
  network?: string;
  address?: string;
  confirmAddress?: string;
  exchangeDetails?: string;
  testConfirmation?: boolean;
  ownershipConfirmation?: boolean;
  accountName?: string;
  email?: string;
  digitalSignature?: string;
};

const personalWallet: Wallet = { 
  deposit: 'suncore', 
  type: '', 
  name: '',
  cryptocurrency: '',
  network: '',
  address: '',
  confirmAddress: '',
  exchangeDetails: '',
  testConfirmation: false,
  ownershipConfirmation: false,
  accountName: '',
  email: '',
  digitalSignature: '', 
};
export const Wallet = () => {
  const { user, token } = useAppSelector((s) => s.auth);
  const [wallet, setWallet] = useState(personalWallet);
  
  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      
      <h3 className="text-xl font-semibold">Wallet</h3>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32 mb-6">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Bitcoin mining deposits
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {miningDeposit.find((opt) => opt.id === wallet.deposit)?.label || miningDeposit[0].id}
                </p>
              </div>
            </div>
            {wallet.deposit === 'personal' && (
              <>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Wallet Type
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {wallet.type === 'custodial' ? 'Custodial exchange  (e.g., Coinbase, Kraken, Binance)' : 'Personal / Non-custodial  (e.g., Ledger, Trezor, MetaMask)'}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Wallet name or provider
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {wallet.name}
                    </p>
                  </div>
                </div>
                <h5 className="lg:my-6 my-4 text-xl leading-bold text-gray-500 dark:text-gray-400">Network & Address</h5>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Cryptocurrency
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {wallet.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Network 
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {wallet.network === 'mainnet' ? 'Bitcoin Mainnet' : 'Lightning Network (advanced users)'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    BTC deposit address
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {wallet.address}
                    </p>
                  </div>
                </div>
                {wallet.type === 'custodial' && (
                <>
                  <h5 className="lg:my-6 my-4 text-xl leading-bold text-gray-500 dark:text-gray-400">Exchange-specific details</h5>
                  <div className="grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Deposit tag / memo / reference ID (Some exchanges require this for routing.)
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {wallet.exchangeDetails}
                      </p>
                    </div>
                  </div>
                </>
                )}
              </>
            )}
          </div>
          
          <EditWallet wallet={wallet} onSubmit={(data) => setWallet(data)} />
        </div>
      </div>
    </div>
  )
}