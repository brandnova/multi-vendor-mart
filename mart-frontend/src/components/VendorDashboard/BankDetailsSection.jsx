import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input, Alert } from './UIComponents';
import axios from 'axios';
import { API_URL } from '../../config/api';

const BankDetailsSection = ({ bankDetails, handleCreateBankDetail, handleEditBankDetail, handleDeleteBankDetail }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBankDetail) {
        await handleEditBankDetail(editingBankDetail.id, newBankDetail);
        setEditingBankDetail(null);
      } else {
        await handleCreateBankDetail(newBankDetail);
      }
      setNewBankDetail({ bank_name: '', account_number: '', account_name: '' });
    } catch (err) {
      setError('Failed to save bank details. Please try again.');
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

  const cancelEditing = () => {
    setEditingBankDetail(null);
    setNewBankDetail({ bank_name: '', account_number: '', account_name: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Bank Details</h2>
      
      {error && <Alert type="error" onDismiss={() => setError(null)}>{error}</Alert>}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
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
            <Button type="submit">{editingBankDetail ? 'Update Bank Detail' : 'Add Bank Detail'}</Button>
            {editingBankDetail && (
              <Button type="button" onClick={cancelEditing} className="ml-2">Cancel</Button>
            )}
          </CardHeader>
        </form>
      </Card>

      <div className="mt-8">
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
                  <Button onClick={() => startEditing(detail)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDeleteBankDetail(detail.id)} className="bg-red-500 hover:bg-red-600">Delete</Button>
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
};

export default BankDetailsSection;