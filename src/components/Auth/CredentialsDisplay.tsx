import { useState } from "react";
import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface CredentialsDisplayProps {
  identityId: string;
  mainWalletId: string;
  cardWalletId: string;
  onDone: () => void;
}

export default function CredentialsDisplay({
  identityId,
  mainWalletId,
  cardWalletId,
  onDone,
}: CredentialsDisplayProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };


  const allCredentials = `
    WALLET CREDENTIALS - IMPORTANT, PLEASE SAVE
    ----------------------------------------
    
    Identity ID: ${identityId}
    Main Wallet ID: ${mainWalletId}
    Card Wallet ID: ${cardWalletId}
    
    Keep this information secure. You'll need it to log in.
  `;


  const downloadCredentials = () => {
    const blob = new Blob([allCredentials], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "wallet-credentials.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Account Created!
        </h2>
        <div className="mt-2 flex items-center justify-center">
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
            <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please save these credentials. You&apos;ll need them to log in later.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Identity ID
            </h3>
            <button
              onClick={() => copyToClipboard(identityId, "identity")}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {copiedId === "identity" ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
            {identityId}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Main Wallet ID
            </h3>
            <button
              onClick={() => copyToClipboard(mainWalletId, "main")}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {copiedId === "main" ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
            {mainWalletId}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Card Wallet ID
            </h3>
            <button
              onClick={() => copyToClipboard(cardWalletId, "card")}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {copiedId === "card" ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
            {cardWalletId}
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={downloadCredentials}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Download Credentials
        </button>
        <button
          onClick={onDone}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
