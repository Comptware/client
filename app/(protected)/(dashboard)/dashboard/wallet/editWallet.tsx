import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { miningDeposit, Wallet } from "./WalletClient";


type WalletProps = {
  wallet: Wallet;
  onSubmit: (data: Wallet) => void;
};


export const EditWallet = ({ wallet, onSubmit }: WalletProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [depositOption, setDepositOption] = useState(miningDeposit[0].id);
  const [walletType, setWalletType] = useState('');
  const [network, setNetwork] = useState('');
  const [formData, setFormData] = useState<Wallet>(wallet);

  useEffect(() => {
      setFormData(wallet);
    }, [wallet]);
    
  useEffect(() => {
    handleChange("deposit", depositOption); 
  }, [depositOption]);

  useEffect(() => {
    handleChange("network", network); 
  }, [network]);

  useEffect(() => {
    handleChange("type", walletType); 
  }, [walletType]);
  
  const handleChange = <K extends keyof Wallet>(field: K, value: Wallet[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onOpenChange();
  };
  return (
    <div>
      <>
        <button
          onClick={onOpen}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          className="max-w-[700px]"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Wallet
                </ModalHeader>
                <ModalBody className="overflow-y-auto max-h-[70vh] min-h-[40vh]">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" className="justify-start w-full px-4 py-6">
                          {miningDeposit.find((opt) => opt.id === depositOption)?.label || "Select value"}
                          </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                          aria-label="selection"
                          selectionMode="single"
                          selectedKeys={[depositOption]}
                          onSelectionChange={(keys: any) => {
                            const value = Array.from(keys)[0] as string;
                            setDepositOption(value);
                          }}
                        >
                          {miningDeposit.map((value) => (
                            <DropdownItem key={value.id}>
                              {value.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  {depositOption === 'personal' && (
                  <>
                    <div className="mt-2">
                      <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                      Wallet Type
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.type === 'non-custodial'}
                            onChange={() => setWalletType('non-custodial')}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                          <span className="text-gray">Personal / Non-custodial  (e.g., Ledger, Trezor, MetaMask)</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.type === 'custodial'}
                            onChange={() => setWalletType('custodial')}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                        <span className="text-gray">Custodial exchange  (e.g., Coinbase, Kraken, Binance)</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Input 
                          label="Wallet name or provider" 
                          variant="bordered" 
                          placeholder="Example:  Ledger Nano X, Coinbase, Trezor Suite, etc."
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                      Network & Address
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Input 
                          label="Cryptocurrency"
                          placeholder="Bitcoin (BTC)" 
                          variant="bordered" 
                          value={formData.cryptocurrency}
                          onChange={(e) => handleChange("cryptocurrency", e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <h5 className="mb-2 text-sm font-medium text-gray-800 dark:text-white/90">
                      Network
                      </h5>
                      <h5 className="mb-2 text-xs font-medium text-gray-800 dark:text-white/90">
                      (Deposits must match the selected network.)
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.network === 'mainnet'}
                            onChange={() => setNetwork('mainnet')}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                          <span className="text-gray">Bitcoin Mainnet</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.network === 'lightning'}
                            onChange={() => setNetwork('lightning')}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                        <span className="text-gray">Lightning Network (advanced users)</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Input 
                          label="BTC deposit address" 
                          variant="bordered" 
                          placeholder="Example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <h5 className="text-xs font-medium text-gray-800 dark:text-white/90">
                      (Please re-enter to confirm. Address must match exactly.)
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Input 
                          label="Confirm BTC deposit address" 
                          variant="bordered" 
                          placeholder="Example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                          value={formData.confirmAddress}
                          onChange={(e) => handleChange("confirmAddress", e.target.value)} 
                        />
                      </div>
                    </div>
                    { formData.type === 'custodial' && (
                    <>
                      <div className="mt-2">
                        <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                        Exchange-specific details (if using an exchange)
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <Input 
                            label="Deposit tag / memo / reference ID (Some exchanges require this for routing.)"
                            variant="bordered" 
                            value={formData.exchangeDetails}
                            onChange={(e) => handleChange("exchangeDetails", e.target.value)} 
                          />
                        </div>
                      </div>
                    </>
                    )}
                    <div className="mt-2">
                      <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                      Verification
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.testConfirmation}
                            onChange={() => handleChange("testConfirmation", true)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                        <span className="text-gray">Test transaction confirmation:<br />I understand SunCore may send a small test transaction to verify this address before regular deposits begin.</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.ownershipConfirmation}
                            onChange={() => handleChange("ownershipConfirmation", true)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                          />
                          <span className="text-gray">Wallet ownership confirmation:<br />I confirm this is my own Bitcoin wallet and that I have full access and control of the funds.</span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                      Contact and authorization
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Input 
                          label="Account name" 
                          variant="bordered" 
                          value={formData.accountName}
                          onChange={(e) => handleChange("accountName", e.target.value)} 
                        />
                      </div>
                      <div>
                        <Input 
                          label="Email associated with wallet (optional)" 
                          variant="bordered" 
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)} 
                        />
                      </div>
                      <div>
                        <Input 
                          label="Digital signature / acknowledgment" 
                          variant="bordered" 
                          value={formData.digitalSignature}
                          onChange={(e) => handleChange("digitalSignature", e.target.value)} 
                        />
                      </div>
                    </div>
                  </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
