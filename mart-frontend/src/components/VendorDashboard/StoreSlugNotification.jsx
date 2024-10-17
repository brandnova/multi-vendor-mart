import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription, Button } from './UIComponents';
import { InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';

const StoreSlugNotification = ({ storeName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const slugifiedStoreName = storeName ? storeName.toLowerCase().replace(/\s+/g, '-') : '';

  return (
    <div className="mb-6">
      {isExpanded ? (
        <Alert variant="info" className="relative">
          <button 
            onClick={toggleExpansion}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
          >
            <ChevronUp className="h-5 w-5 text-blue-600" />
          </button>
          <div className="pr-8">
            <AlertTitle className="flex items-center">
              <InfoIcon className="h-5 w-5 mr-2 text-blue-600" />
              Important Information About Your Store Link
            </AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                Your store's Link will be automatically generated based on your store name. 
                {storeName ? (
                  <strong> Your current store Link will be: https://oursite.com/stores/{slugifiedStoreName}</strong>
                ) : (
                  <strong> Once you create your store, its Link will be based on the name you choose.</strong>
                )}
              </p>
              <p className="mt-2">
                If you change your store's name in the future, the Link will remain the same to maintain consistency for your customers.
              </p>
              <p className="mt-2">
                To update your store's Link in the future, you can:
              </p>
              <ul className="list-disc list-inside mt-2">
                <li>Email our support team at support@oursite.com with your store details</li>
                <li>Use our Store Link Update page (coming soon)</li>
              </ul>
              <Button variant="outline" className="mt-4" disabled>
                Update Store Link (Coming Soon)
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        <button 
          onClick={toggleExpansion}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <InfoIcon className="h-5 w-5" />
          <span>View Store Link Information</span>
          <ChevronDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default StoreSlugNotification;