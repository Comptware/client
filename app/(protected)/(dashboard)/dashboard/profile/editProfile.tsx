import { useGetCountriesQuery } from "@/store/features/geo/geoApi";
import { useUpdateUserProfileMutation } from "@/store/features/profile/profileApi";
import type { UserProfile } from '@/types';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type EditProfileProps = {
  profile: UserProfile;
};

export const isValidPhone = (phone: string) =>
  /^\+?[1-9]\d{7,14}$/.test(phone);
export const EditProfile = ({ profile }: EditProfileProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [phoneError, setPhoneError] = React.useState("");
  const [formData, setFormData] = useState<UserProfile>(profile);

  const { data: countries = [] } = useGetCountriesQuery();
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  const isValidPhone = (phone: string) => phoneRegex.test(phone);
  
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [UpdateUserProfile, { isLoading } ] = useUpdateUserProfileMutation();

  const handleSubmit = async () => {
    if (formData.phone && !isValidPhone(formData.phone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    await UpdateUserProfile({
      email: formData.email,
      phone: formData.phone ?? '',
      street: formData.street ?? '',
      city: formData.city ?? '',
      state: formData.state ?? '',
      zip: formData.zip ?? '',
    }).unwrap();
    
    if (!isLoading) onOpenChange();
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
                  Edit Profile
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    
                    <div>
                      <Input 
                        label="First Name" 
                        variant="bordered" 
                        value={formData.firstName}
                        isReadOnly
                        description="Not editable"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Middle Name" 
                        variant="bordered" 
                        value={formData.middleName || ''}
                        isReadOnly
                        description="Not editable"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Last Name" 
                        variant="bordered" 
                        value={formData.lastName}
                        isReadOnly
                        description="Not editable"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Unique Client ID" 
                        variant="bordered" 
                        value={formData.uniqueClientId || 'Not assigned yet'}
                        isReadOnly
                        description="System assigned"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Email" 
                        variant="bordered"
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        label="Phone"
                        variant="bordered"
                        type="tel"
                        value={formData.phone}
                        isInvalid={!!phoneError}
                        errorMessage={phoneError}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+15551234567"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-4">
                      Address
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Input 
                        label="Country" 
                        variant="bordered" 
                        value={formData.country || ''}
                        isReadOnly
                        description="Not editable"
                      />
                    </div>
                    <div>
                      <Input 
                        label="Street" 
                        variant="bordered" 
                        value={formData.street || ''}
                        onChange={(e) => handleChange("street", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Input 
                        label="City" 
                        variant="bordered" 
                        value={formData.city || ''}
                        onChange={(e) => handleChange("city", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Input 
                        label="State" 
                        variant="bordered" 
                        value={formData.state || ''}
                        onChange={(e) => handleChange("state", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Input 
                        label="ZIP" 
                        variant="bordered" 
                        value={formData.zip || ''}
                        onChange={(e) => handleChange("zip", e.target.value)} 
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                  </Button>
                  <Button color={`${isLoading ? 'default' : 'primary'}`} disabled={isLoading} onPress={handleSubmit}>
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
