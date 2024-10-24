import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { fetchAds } from '../../config/api';

const BannerAdSection = ({ storeData, isAdsFree }) => {
  const [ad, setAd] = useState(null);
  const [isShowingAd, setIsShowingAd] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      if (!isAdsFree) {
        const ads = await fetchAds(storeData.slug);
        const bannerAd = ads.find((a) => a.placement === "dashboard");
        setAd(bannerAd);
      }
    };
    loadAd();
  }, [storeData.slug, isAdsFree]);

  useEffect(() => {
    if (!isAdsFree && ad) {
      const intervalId = setInterval(() => {
        setIsShowingAd(prev => !prev);
      }, 10000); // Switch every 7 seconds

      return () => clearInterval(intervalId);
    }
  }, [ad, isAdsFree]);

  return (
    <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
      {/* Store Banner */}
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
          isShowingAd ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <img
          src={storeData.banner_image || '/placeholder.svg?height=256&width=1024'}
          alt={`${storeData.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{storeData.name}</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center text-white/80 space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.location}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.contact_email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.contact_phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Section */}
      {!isAdsFree && ad && (
        <div 
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
            isShowingAd ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {ad.ad_type === 'adsense' ? (
            <div className="w-full h-full flex justify-center items-center bg-white">
              <div dangerouslySetInnerHTML={{ __html: ad.adsense_code }} />
            </div>
          ) : (
            <div className="relative w-full h-full">
              {ad.display_image && (
                <img 
                  src={ad.display_image} 
                  alt={ad.content}
                  className="w-full h-full object-cover"
                />
              )}
              {ad.content && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 md:p-6">
                  <p className="text-white text-lg md:text-xl">{ad.content}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Transition Indicator */}
      {!isAdsFree && ad && (
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${!isShowingAd ? 'bg-white' : 'bg-white/50'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isShowingAd ? 'bg-white' : 'bg-white/50'}`} />
        </div>
      )}
    </div>
  );
};

export default BannerAdSection;