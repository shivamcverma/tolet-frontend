import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, MapPin } from 'lucide-react';
import { fetchAPI, api } from '../api';

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

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', response.status, responseData);
        throw new Error(JSON.stringify(responseData));
      }

      console.log('Property created successfully:', responseData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding property:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 md:px-6 flex justify-center container mx-auto max-w-[1400px]">
      <div className="glass-card w-full max-w-[800px] p-6 md:p-12 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center mb-10 flex flex-col items-center">
          <Building2 size={40} className="text-primary mb-2 drop-shadow-[0_2px_8px_rgba(139,92,246,0.3)]" />
          <h1 className="text-2xl md:text-[2rem] font-bold font-outfit mt-2 mb-2 text-text-main">Add New Property</h1>
          <p className="text-text-muted">Fill in the details to list your property</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl mb-8 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Property Title</label>
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

            <div className="sm:col-span-2">
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Description</label>
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

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Monthly Rent (₹)</label>
              <input
                type="number"
                name="rent"
                className="form-input"
                required
                value={formData.rent}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Property Type</label>
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

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                required
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Area</label>
              <input
                type="text"
                name="area"
                className="form-input"
                required
                value={formData.area}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Latitude</label>
              <input
                type="text"
                name="latitude"
                className="form-input"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Longitude</label>
              <input
                type="text"
                name="longitude"
                className="form-input"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Amenities (JSON Format)</label>
              <input
                type="text"
                name="amenities"
                className="form-input font-mono text-sm"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Property Images</label>
              <div className="relative border-2 border-dashed border-black/10 rounded-xl p-8 text-center transition-all duration-300 hover:border-primary hover:bg-primary/5 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <Upload size={28} className="mb-2" />
                  <span className="font-medium">{images.length > 0 ? `${images.length} images selected` : 'Click or drag to select Images'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-black/5">
            <button
              type="button"
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? 'Adding Property...' : 'List Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
