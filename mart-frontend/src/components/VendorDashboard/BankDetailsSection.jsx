// src/components/VendorDashboard/BankDetailsSection.jsx

import React, { useState } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Input } from './UIComponents';
import { FaPen, FaTrash } from "react-icons/fa";
import * as api from '../../config/api';

export default function BankDetailsSection() {
  const { bankDetails, setBankDetails } = useVendor();
  const [newBankDetail, setNewBankDetail] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
  });
  const [editingBankDetail, setEditingBankDetail] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBankDetail((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveBankDetail = async () => {
    try {
      let response;
      if (editingBankDetail) {
        response = await api.updateBankDetail(editingBankDetail.id, newBankDetail);
        setBankDetails(bankDetails.map(detail => detail.id === editingBankDetail.id ? response : detail));
      } else {
        response = await api.createBankDetail(newBankDetail);
        setBankDetails([...bankDetails, response]);
      }
      setNewBankDetail({ bank_name: '', account_number: '', account_name: '' });
      setEditingBankDetail(null);
      setError(null);
    } catch (error) {
      console.error('Error saving bank details:', error);
      setError('Failed to save bank details. Please try again.');
    }
  };

  const handleDeleteBankDetail = async (bankDetailId) => {
    try {
      await api.deleteBankDetail(bankDetailId);
      setBankDetails(bankDetails.filter(detail => detail.id !== bankDetailId));
      setError(null);
    } catch (error) {
      console.error('Error deleting bank details:', error);
      setError('Failed to delete bank details. Please try again.');
    }
  };

  const startEditing = (bankDetail) => {
    setEditingBankDetail(bankDetail);
    setNewBankDetail({
      bank_name: bankDetail.bank_name,
      account_number: bankDetail.account_number,
      account_name: bankDetail.account_name,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Bank Details</h2>
      {error && <div className="text-red-500">{error}</div>}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Bank Name"
              name="bank_name"
              value={newBankDetail.bank_name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Account Number"
              name="account_number"
              value={newBankDetail.account_number}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Account Name"
              name="account_name"
              value={newBankDetail.account_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
        <CardHeader>
          <Button onClick={handleSaveBankDetail}>{editingBankDetail ? 'Update Bank Detail' : 'Add Bank Detail'}</Button>
          {editingBankDetail && (
            <Button onClick={() => setEditingBankDetail(null)} className="ml-2">Cancel</Button>
          )}
        </CardHeader>
      </Card>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Existing Bank Details</h3>
        <ul className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
          {bankDetails.length > 0 ? (
            bankDetails.map((detail) => (
              <li key={detail.id} className="py-3 flex justify-between text-sm font-medium">
                <div>
                  <h4 className="font-medium text-gray-900">{detail.bank_name}</h4>
                  <p className="text-gray-600">Account Number: {detail.account_number}</p>
                  <p className="text-gray-600">Account Name: {detail.account_name}</p>
                </div>
                <div>
                  <Button onClick={() => startEditing(detail)} className="mr-2">
                    <FaPen />
                  </Button>
                  <Button onClick={() => handleDeleteBankDetail(detail.id)} className="bg-red-500 hover:bg-red-600">
                    <FaTrash />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="py-3 text-sm text-gray-500">No bank details available.</li> 
          )}
        </ul>
      </div>
    </div>
  );
}