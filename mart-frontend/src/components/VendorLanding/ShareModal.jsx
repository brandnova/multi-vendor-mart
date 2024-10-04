import React, { useState } from 'react';
import { FaFacebook, FaWhatsapp, FaTwitter, FaRegCopy
} from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, product, storeSlug, styles }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const productUrl = `${window.location.origin}/stores/${storeSlug}?product=${product.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareToSocialMedia = (platform) => {
    let url;
    const text = `Check out ${product.name}!`;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + productUrl)}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full" style={styles.accent}>
        <h2 className="text-2xl font-bold mb-4" style={styles.text}>Share Product</h2>
        <div className="mb-4">
          <input
            type="text"
            value={productUrl}
            readOnly
            className="w-full p-2 border rounded"
          />
          <button
            className="mt-2 px-4 py-2 rounded transition duration-300 text-sm font-semibold"
            style={styles.primary}
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : <FaRegCopy />}
          </button>
        </div>
        <div className="flex justify-around">
          <button
            className="px-4 py-2 rounded transition duration-300 text-sm font-semibold"
            style={styles.secondary}
            onClick={() => shareToSocialMedia('facebook')}
          >
            <FaFacebook size={20}/>
          </button>
          <button
            className="px-4 py-2 rounded transition duration-300 text-sm font-semibold"
            style={styles.secondary}
            onClick={() => shareToSocialMedia('twitter')}
          >
            <FaTwitter size={20}/>
          </button>
          <button
            className="px-4 py-2 rounded transition duration-300 text-sm font-semibold"
            style={styles.secondary}
            onClick={() => shareToSocialMedia('whatsapp')}
          >
            <FaWhatsapp size={20}/>
          </button>
        </div>
        <button
          className="mt-4 w-full px-4 py-2 rounded transition duration-300 text-sm font-semibold"
          style={styles.primary}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;