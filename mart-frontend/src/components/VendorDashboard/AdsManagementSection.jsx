import React, { useState } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, CardTitle, Button, Alert } from '../UIComponents';
import { AdsFreeButton } from '../AdComponents';
import { initiatePayment } from '../../config/api';

const AdsManagementSection = ({ isAdsFree }) => {
  const { storeData } = useVendor();
  const [error, setError] = useState(null);

  const handleAdsFreeSubscribe = async () => {
    try {
      setError(null);
      const { payment_url } = await initiatePayment(storeData.slug);
      window.location.href = payment_url;
    } catch (error) {
      console.error('Error initiating payment:', error);
      if (error.response && error.response.status === 401) {
        setError("You're not authorized to perform this action. Please ensure you're logged in and try again.");
      } else {
        setError("An error occurred while initiating the payment. Please try again later.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ads Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isAdsFree ? (
            <Alert type="success">
              Your store is currently subscribed to the ads-free plan. Enjoy an ad-free experience and full access to all features!
            </Alert>
          ) : (
            <>
              <p className="mb-4">
                Upgrade to our ads-free plan to remove ads from your store and unlock full access to Sales Analytics.
              </p>
              <AdsFreeButton storeSlug={storeData.slug} onClick={handleAdsFreeSubscribe} />
              {error && (
                <Alert type="error" className="mt-4">
                  {error}
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Ads-Free Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Remove all ads from your store</li>
            <li>Full access to Sales Analytics</li>
            <li>Improved store performance</li>
            <li>Enhanced user experience for your customers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsManagementSection;