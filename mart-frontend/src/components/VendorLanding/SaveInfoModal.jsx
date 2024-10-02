import React from 'react';

const SaveInfoModal = ({ isOpen, handleSaveInfo, styles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
        <h2 className="text-xl font-bold mb-4">Save Your Information?</h2>
        <p className="mb-4">Would you like to save your checkout information for future orders?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => handleSaveInfo(false)}
          >
            No
          </button>
          <button
            className="px-4 py-2 text-white rounded"
            style={styles.primary}
            onClick={() => handleSaveInfo(true)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveInfoModal;