'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

interface KycIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function KycIntroModal({ isOpen, onClose, onLogout }: KycIntroModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className="bg-white  text-center rounded-xl shadow-lg max-w-md mx-auto"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="text-2xl justify-center font-semibold text-gray-800">
          Why KYC is Important
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 leading-relaxed">
           Completing KYC verification is essential for secure account management. It ensures compliance with global regulations, protects against fraud, and safeguards your assets by screening your identity against sanctions, watchlists, and financial crime databases. This process builds trust and enables a safe platform for managing your cryptocurrency investments.
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-between  items-center ">
          <Button
            className="bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            onPress={onClose}
          >
            Proceed to KYC
          </Button>
          <Button
            className="bg-transparent text-blue-600 font-medium hover:underline"
            onPress={onLogout}
          >
            Logout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}