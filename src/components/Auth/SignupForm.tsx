/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useUser } from "@/contexts/UserContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  HomeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import CredentialsDisplay from "./CredentialsDisplay";

interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  postCode: string;
}

export default function SignupForm({
  onToggleForm,
}: {
  onToggleForm: () => void;
}) {
  const [signupComplete, setSignupComplete] = useState(false);
  const [credentials, setCredentials] = useState<{
    identityId: string;
    mainWalletId: string;
    cardWalletId: string;
  } | null>(null);
  const [step, setStep] = useState(1);

  // Personal information (Step 1)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
  });

  // Address information (Step 2)
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    street: "",
    city: "",
    state: "",
    postCode: "",
  });

  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create identity mutation
  const createIdentityMutation = useMutation({
    mutationFn: (formData: any) => api.post("/identities/create", formData),
    onSuccess: (response) => {
      const identityId = response.data.identity_id;
      createMainWallet(identityId);
    },
    onError: (error) => {
      console.error("Failed to create identity:", error);
      toast.error("Failed to create your account. Please try again.");
      setIsSubmitting(false);
    },
  });

  // Create main wallet mutation
  const createMainWalletMutation = useMutation({
    mutationFn: (data: { identityId: string; walletType: string }) =>
      api.post("/balances/create", {
        identityId: data.identityId,
        walletType: "main",
      }),
    onSuccess: (response, variables) => {
      const mainWalletId = response.data.balance_id;
      createCardWallet(variables.identityId, mainWalletId);
    },
    onError: (error) => {
      console.error("Failed to create main wallet:", error);
      toast.error("Failed to set up your wallet. Please try again.");
      setIsSubmitting(false);
    },
  });

  // Create card wallet mutation
  const createCardWalletMutation = useMutation({
    mutationFn: (data: {
      identityId: string;
      walletType: string;
      mainWalletId: string;
    }) =>
      api.post("/balances/create", {
        identityId: data.identityId,
        walletType: "card",
      }),
    onSuccess: (response, variables) => {
      const cardWalletId = response.data.balance_id;
      finishSignup(variables.identityId, variables.mainWalletId, cardWalletId);
    },
    onError: (error) => {
      console.error("Failed to create card wallet:", error);
      toast.error("Failed to set up your card wallet. Please try again.");
      setIsSubmitting(false);
    },
  });
  // Helper functions for the multi-step form
  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  // Validate the first step fields
  const validateStep1 = () => {
    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !personalInfo.gender ||
      !personalInfo.dateOfBirth
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  // Handle phone number change
  const handlePhoneChange = (value: string | undefined) => {
    setPersonalInfo((prev) => ({ ...prev, phone: value || "" }));
  };

  // Create identity from form data
  const createIdentity = (
    personalData: PersonalInfo,
    addressData: AddressInfo
  ) => {
    setIsSubmitting(true);

    const payload = {
      identity_type: "individual",
      first_name: personalData.firstName,
      last_name: personalData.lastName,
      other_names: personalData.middleName,
      gender: personalData.gender.toLowerCase(),
      dob: new Date(personalData.dateOfBirth).toISOString(),
      email_address: personalData.email,
      phone_number: personalData.phone,
      nationality: "Nigerian",
      category: "customer",
      street: addressData.street,
      country: "Nigeria",
      state: addressData.state,
      post_code: addressData.postCode,
      city: addressData.city,
      meta_data: {
        preferred_language: "English",
      },
    };

    createIdentityMutation.mutate(payload);
  };

  // Create main wallet after identity creation
  const createMainWallet = (identityId: string) => {
    createMainWalletMutation.mutate({
      identityId,
      walletType: "main",
    });
  };

  // Create card wallet after main wallet creation
  const createCardWallet = (identityId: string, mainWalletId: string) => {
    createCardWalletMutation.mutate({
      identityId,
      walletType: "card",
      mainWalletId, // Pass this through for the final step
    });
  };

  // Final step - update user context and redirect
  const finishSignup = (
    identityId: string,
    mainWalletId: string,
    cardWalletId: string
  ) => {
    setCredentials({
      identityId,
      mainWalletId,
      cardWalletId,
    });
    // setUser({
    //   identityId,
    //   firstName: personalInfo.firstName,
    //   lastName: personalInfo.lastName,
    //   mainWalletId,
    //   cardWalletId,
    // });
    setSignupComplete(true);
    setIsSubmitting(false);

    toast.success("Account created successfully!");
  };

  const handleContinueToDashboard = () => {
    // Now set the user in context to log them in
    if (credentials) {
      setUser({
        identityId: credentials.identityId,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        mainWalletId: credentials.mainWalletId,
        cardWalletId: credentials.cardWalletId,
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !addressInfo.street ||
      !addressInfo.city ||
      !addressInfo.state ||
      !addressInfo.postCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    createIdentity(personalInfo, addressInfo);
  };

  // Handle input changes for personal information
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for address information
  const handleAddressInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Styling
  const bgColor = "bg-blue-50 dark:bg-gray-900"; // Light blue background for light mode
  const inputStyle =
    "w-full text-sm border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white";
  const labelStyle =
    "block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300";
  const iconStyle = "w-4 h-4 mr-2 text-blue-600 dark:text-blue-400";
  const buttonStyle =
    "bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200";

  if (signupComplete && credentials) {
    return (
      <div
        className={`${bgColor} min-h-screen flex flex-col justify-center items-center px-4 py-12`}
      >
        <CredentialsDisplay
          identityId={credentials.identityId}
          mainWalletId={credentials.mainWalletId}
          cardWalletId={credentials.cardWalletId}
          onDone={handleContinueToDashboard}
        />
      </div>
    );
  }
  return (
    <div
      className={`${bgColor} min-h-screen flex flex-col justify-center items-center px-2 `}
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Wallet Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Set up your account to get started
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step === 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-14 transition-all duration-300 ${
                step === 2 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 ? (
            // Step 1: Personal Information
            <>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <UserIcon className={iconStyle} />
                      First Name*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    className={inputStyle}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <UserIcon className={iconStyle} />
                      Last Name*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    className={inputStyle}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>
                  <div className="flex items-center">
                    <UserIcon className={iconStyle} />
                    Middle Name
                  </div>
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={personalInfo.middleName}
                  onChange={handlePersonalInfoChange}
                  className={inputStyle}
                  placeholder="(Optional)"
                />
              </div>
              <div>
                <label className={labelStyle}>
                  <div className="flex items-center">
                    <EnvelopeIcon className={iconStyle} />
                    Email*
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className={inputStyle}
                  placeholder="johndoe@example.com"
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  <div className="flex items-center">
                    <PhoneIcon className={iconStyle} />
                    Phone Number*
                  </div>
                </label>
                <div className="phone-input-container">
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={personalInfo.phone}
                    onChange={handlePhoneChange}
                    className="custom-phone-input"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <CalendarIcon className={iconStyle} />
                      Date of Birth*
                    </div>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={personalInfo.dateOfBirth}
                    onChange={handlePersonalInfoChange}
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <UserIcon className={iconStyle} />
                      Gender*
                    </div>
                  </label>
                  <select
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className={`${buttonStyle} w-full mt-8 flex items-center justify-center`}
              >
                Continue <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            </>
          ) : (
            // Step 2: Address Information
            <>
              <div>
                <label className={labelStyle}>
                  <div className="flex items-center">
                    <HomeIcon className={iconStyle} />
                    Street Address*
                  </div>
                </label>
                <input
                  type="text"
                  name="street"
                  value={addressInfo.street}
                  onChange={handleAddressInfoChange}
                  className={inputStyle}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <MapPinIcon className={iconStyle} />
                      City*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressInfo.city}
                    onChange={handleAddressInfoChange}
                    className={inputStyle}
                    placeholder="Lagos"
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    <div className="flex items-center">
                      <MapPinIcon className={iconStyle} />
                      State/Province*
                    </div>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressInfo.state}
                    onChange={handleAddressInfoChange}
                    className={inputStyle}
                    placeholder="Lagos State"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  <div className="flex items-center">
                    <MapPinIcon className={iconStyle} />
                    Postal/Zip Code*
                  </div>
                </label>
                <input
                  type="text"
                  name="postCode"
                  value={addressInfo.postCode}
                  onChange={handleAddressInfoChange}
                  className={inputStyle}
                  placeholder="100001"
                  required
                />
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-2" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${buttonStyle} w-2/3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={onToggleForm}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
