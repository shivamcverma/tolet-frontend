import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, MapPin } from 'lucide-react';
import { fetchAPI, api } from '../api';
import './AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    city: '',
    area: '',
    latitude: '28.6139',
    longitude: '77.2090',
    property_type: 'ROOM',
    amenities: '{"wifi": true, "parking": true}'
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'amenities') {
        data.append(key, formData[key]); // Send as stringified JSON
      } else {
        data.append(key, formData[key]);
      }
    });

    images.forEach(image => {
      data.append('uploaded_images', image);
    });

    try {
      const response = await fetch(`${api}/properties/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          // Don't set Content-Type, browser will set it for FormData
        },
        body: data
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page container">
      <div className="add-property-card glass-card">
        <div className="form-header">
          <Building2 size={32} className="text-primary" />
          <h1>Add New Property</h1>
          <p>Fill in the details to list your property</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-property-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label className="form-label">Property Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Luxury 2BHK Flat"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                rows="3"
                placeholder="Detailed description of the property..."
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹)</label>
              <input
                type="number"
                name="rent"
                className="form-input"
                required
                value={formData.rent}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                name="property_type"
                className="form-input"
                value={formData.property_type}
                onChange={handleChange}
              >
                <option value="ROOM">Room</option>
                <option value="PG">PG</option>
                <option value="FLAT">Flat</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Area</label>
              <input
                type="text"
                name="area"
                className="form-input"
                required
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="text"
                name="latitude"
                className="form-input"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="text"
                name="longitude"
                className="form-input"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">Amenities (JSON Format)</label>
              <input
                type="text"
                name="amenities"
                className="form-input"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">Property Images</label>
              <div className="file-upload-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="file-label">
                  <Upload size={24} />
                  <span>{images.length > 0 ? `${images.length} images selected` : 'Select Images'}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding Property...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
