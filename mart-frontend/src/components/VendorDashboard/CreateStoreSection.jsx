import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from './UIComponents';

const CreateStoreSection = ({ handleCreateStore }) => {
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Create a New Store</h2>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Store Name"
              name="name"
              value={newStore.name}
              onChange={handleInputChange}
            />
            <Input
              label="Location"
              name="location"
              value={newStore.location}
              onChange={handleInputChange}
            />
            <Input
              label="Contact Email"
              name="contact_email"
              value={newStore.contact_email}
              onChange={handleInputChange}
            />
            <Input
              label="Contact Phone"
              name="contact_phone"
              value={newStore.contact_phone}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardHeader>
          <Button onClick={() => handleCreateStore(newStore)}>Create Store</Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CreateStoreSection;