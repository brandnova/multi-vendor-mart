import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Card, CardContent, CardHeader, Button, TextArea, Select } from './UIComponents';

const TestimonialForm = () => {
  const [testimonial, setTestimonial] = useState('');
  const [storeId, setStoreId] = useState('');
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchUserTestimonials();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores/');
      setStores(response.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  const fetchUserTestimonials = async () => {
    try {
      const response = await api.get('/site-settings/user-testimonials/');
      setUserTestimonials(response.data);
    } catch (err) {
      console.error('Error fetching user testimonials:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!storeId) {
      setError('Please select a store');
      return;
    }

    try {
      await api.post('/site-settings/testimonials/create/', { text: testimonial, store: storeId });
      setSuccess('Thank you for your testimonial! It will be reviewed by our team.');
      setTestimonial('');
      setStoreId('');
      fetchUserTestimonials();
      setShowForm(false);
    } catch (err) {
      setError('Failed to submit testimonial. Please try again.');
    }
  };

  const renderContent = () => {
    if (userTestimonials.length === 0) {
      return (
        <div className="text-center mb-6">
          <p className="text-lg mb-4">We'd love to hear about your experience! Please leave a review for one of your stores.</p>
          <Button onClick={() => setShowForm(true)}>Leave a Review</Button>
        </div>
      );
    }

    if (!showForm) {
      return (
        <div className="text-center mb-6">
          <p className="text-lg mb-4">Thank you for your previous review(s)! Would you like to add another?</p>
          <Button onClick={() => setShowForm(true)}>Add Another Review</Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <Select
          label="Select Store"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          required
        >
          <option value="">Select a store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </Select>
        <TextArea
          label="Your Testimonial"
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
          required
          rows={4}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <div className="flex justify-between mt-4">
          <Button type="button" onClick={() => setShowForm(false)} variant="secondary">Cancel</Button>
          <Button type="submit">Submit Testimonial</Button>
        </div>
      </form>
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Testimonials</h2>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;