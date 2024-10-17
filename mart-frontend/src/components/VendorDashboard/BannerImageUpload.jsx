import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const BannerImageUpload = ({ bannerPreview, setBannerPreview, handleInputChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setBannerPreview(URL.createObjectURL(file));
      handleInputChange({
        target: { name: 'banner_image', type: 'file', files: [file] },
      });
    }
  }, [setBannerPreview, handleInputChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const removeBanner = () => {
    setBannerPreview(null);
    handleInputChange({
      target: { name: 'banner_image', type: 'file', files: [] },
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Banner Image
      </label>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <input {...getInputProps()} />
        {bannerPreview ? (
          <div className="relative">
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-40 object-cover rounded-md"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBanner();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop your banner image here, or click to select a file
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Recommended size: 1200x300 pixels
            </p>
          </div>
        )}
      </div>
      {!bannerPreview && (
        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Banner
        </button>
      )}
    </div>
  );
};

export default BannerImageUpload;