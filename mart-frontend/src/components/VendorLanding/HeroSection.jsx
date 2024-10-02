import React from 'react';

const HeroSection = ({ storeData }) => {
  return (
    <section className="relative h-96 bg-gray-900 text-white">
      <img
        src={storeData.banner_image}
        alt={`${storeData.name} banner`}
        className="w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="text-5xl font-bold mb-1 text-center">{storeData.name}</h2>
        <p className="text-sm mb-6 text-center">{storeData.location}</p>
        {storeData.tag_line && (
          <p className="text-xl italic text-center bg-black bg-opacity-50 px-6 py-2 rounded-full">
            "{storeData.tag_line}"
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;