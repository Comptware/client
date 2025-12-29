'use client';

import { enrollMFA, enrollPhoneMFA, requestPasswordReset } from "@/actions/auth.action";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ isOpen, onOpenChange }: SettingsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [isPhoneMfaLoading, setIsPhoneMfaLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await requestPasswordReset();
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password reset email sent! Please check your inbox.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to send password reset email.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAEnrollment = async () => {
    setIsMfaLoading(true);
    setMessage(null);
    
    try {
      const result = await enrollMFA();
      
      if (result.success && result.enrollmentUrl) {
        setMessage({ 
          type: 'success', 
          text: 'Redirecting to 2FA setup...' 
        });
        // Redirect to Auth0's MFA enrollment page
        setTimeout(() => {
          window.location.href = result.enrollmentUrl!;
        }, 1000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to start 2FA enrollment.' 
        });
        setIsMfaLoading(false);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
      setIsMfaLoading(false);
    }
  };

  const handlePhoneMFAEnrollment = async () => {
    if (!phoneNumber.trim()) {
      setMessage({ 
        type: 'error', 
        text: 'Please enter a phone number' 
      });
      return;
    }

    setIsPhoneMfaLoading(true);
    setMessage(null);
    
    try {
      const result = await enrollPhoneMFA(phoneNumber);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'SMS 2FA enabled successfully! You will receive codes via SMS.' 
        });
        setPhoneNumber('');
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to enable SMS 2FA.' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsPhoneMfaLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Settings
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Account Security</h3>
                  <p className="text-sm text-gray-500">
                    Manage your password and account security settings
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={handlePasswordReset}
                    isLoading={isLoading}
                    isDisabled={isLoading || isMfaLoading || isPhoneMfaLoading}
                  >
                    Reset Password
                  </Button>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Two-Factor Authentication</p>
                    
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={handleMFAEnrollment}
                      isLoading={isMfaLoading}
                      isDisabled={isLoading || isMfaLoading || isPhoneMfaLoading}
                    >
                      Enable Authenticator App 2FA
                    </Button>

                    <div className="flex flex-col gap-2">
                      <Input
                        label="Phone Number"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading || isMfaLoading || isPhoneMfaLoading}
                        description="Include country code (e.g., +1 for US)"
                      />
                      <Button
                        color="success"
                        variant="flat"
                        onPress={handlePhoneMFAEnrollment}
                        isLoading={isPhoneMfaLoading}
                        isDisabled={isLoading || isMfaLoading || isPhoneMfaLoading || !phoneNumber.trim()}
                      >
                        Enable SMS 2FA
                      </Button>
                    </div>
                  </div>
                </div>

                {message && (
                  <div 
                    className={`p-3 rounded-lg text-sm ${
                      message.type === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
