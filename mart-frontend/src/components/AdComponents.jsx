import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchAds, initiatePayment, checkAdsFreeStatus } from '../config/api';
import { Button, Modal } from './UIComponents';

export const AdComponent = ({ storeSlug, placement }) => {
  const [ad, setAd] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      const ads = await fetchAds(storeSlug);
      const matchingAd = ads.find((a) => a.placement === placement);
      setAd(matchingAd);
    };
    loadAd();
  }, [storeSlug, placement]);

  if (!ad) return null;

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  if (ad.ad_type === 'adsense') {
    return (
      <div className="relative overflow-hidden w-full" style={{ minHeight: '90px', maxHeight: '250px' }}>
        <div 
          className="flex justify-center items-center w-full h-full"
          dangerouslySetInnerHTML={{ __html: ad.adsense_code }} 
        />
      </div>
    );
  }

  const CustomAd = () => (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ease-in-out
        ${isExpanded ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' : 'rounded-lg shadow-lg cursor-pointer h-48'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleExpand}
    >
      {/* Close button for expanded view */}
      {isExpanded && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 transition-colors duration-200"
        >
          <X size={24} />
        </button>
      )}

      {/* Content container */}
      <div className={`relative w-full transition-all duration-300 ease-in-out
        ${isExpanded ? 'max-w-4xl mx-auto' : 'h-full'}`}>
        
        {/* Image */}
        {ad.display_image && (
          <div className={`relative ${isExpanded ? 'w-full' : 'h-full'}`}>
            <img 
              src={ad.display_image} 
              alt={ad.content}
              className={`transition-all duration-300 ease-in-out
                ${isExpanded 
                  ? 'w-full h-auto max-h-[80vh] object-contain' 
                  : 'w-full h-full object-cover'}`}
            />
            
            {/* Text overlay */}
            {ad.content && (
              <div 
                className={`absolute left-0 right-0 bg-black/60 text-white transition-all duration-300
                  ${isExpanded 
                    ? 'bottom-0 p-6' 
                    : `bottom-0 p-3 ${isHovered ? 'opacity-100' : 'opacity-70'}`}`}
              >
                <p className={`transition-all duration-300
                  ${isExpanded 
                    ? 'text-lg md:text-xl' 
                    : 'text-sm line-clamp-2 md:text-base'}`}>
                  {ad.content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Text-only ad */}
        {!ad.display_image && ad.content && (
          <div className={`bg-white p-4 rounded-lg shadow transition-all duration-300
            ${isExpanded ? 'max-w-2xl mx-auto mt-8' : 'h-full'}`}>
            <p className={`text-gray-800 transition-all duration-300
              ${isExpanded ? 'text-xl' : 'text-sm md:text-base line-clamp-3 text-center'}`}>
              {ad.content}
            </p>
          </div>
        )}

        {/* Subtle indicator for expandable content */}
        {!isExpanded && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      <CustomAd />
    </div>
  );
};

// Simplified AdsFreeButton using the existing Modal component
export const AdsFreeButton = ({ storeSlug }) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSubscribe = async () => {
      try {
        setError(null);
        const { payment_url } = await initiatePayment(storeSlug);
        window.location.href = payment_url;
      } catch (error) {
        console.error('Error initiating payment:', error);
        setError("An error occurred while initiating the payment. Please try again later.");
      }
    };
  
    return (
      <>
        <Button 
          onClick={() => setIsConfirmationOpen(true)} 
          variant="primary" 
          size="md"
        >
          Subscribe to Ads-Free
        </Button>
  
        <Modal 
          isOpen={isConfirmationOpen} 
          onClose={() => setIsConfirmationOpen(false)} 
          size="md"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirm Subscription</h3>
            <p className="text-gray-600">Are you sure you want to subscribe to the Ads-Free plan?</p>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <div className="flex justify-end">
              <Button 
                onClick={handleSubscribe} 
                variant="primary"
                className="w-full sm:w-auto"
              >
                Confirm Subscription
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  };
  
  export const WithAdsFreeCheck = ({ storeSlug, children }) => {
    const [isAdsFree, setIsAdsFree] = useState(false);
  
    useEffect(() => {
      const checkStatus = async () => {
        const status = await checkAdsFreeStatus(storeSlug);
        setIsAdsFree(status);
      };
      checkStatus();
    }, [storeSlug]);
  
    if (isAdsFree) {
      return <>{children}</>;
    }
  
    return null;
  };

export default { AdComponent, AdsFreeButton, WithAdsFreeCheck };