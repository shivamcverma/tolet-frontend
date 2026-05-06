import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Phone, CheckCircle2, Wifi, Car, Shield, Building2, Calendar, User } from 'lucide-react';
import { fetchAPI, API_BASE_URL } from '../api';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await fetchAPI(`/properties/${id}/`);
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  if (loading) return <div className="loading-container container">Loading property details...</div>;
  if (error) return <div className="error-container container">Error: {error}</div>;
  if (!property) return <div className="error-container container">Property not found.</div>;

  const defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  
  const getImageUrl = (imgObj) => {
    if (!imgObj) return defaultImage;
    const path = imgObj.image;
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [{ image: defaultImage }];

  return (
    <div className="property-detail-page container">
      <div className="detail-layout">
        {/* Left Column: Images and Description */}
        <div className="detail-main">
          <div className="image-gallery glass-card">
            <div className="main-image-container">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={property.title} 
                className="main-image" 
              />
              <div className="property-badges">
                <span className="badge type-badge">{property.property_type}</span>
                {property.is_verified && (
                  <span className="badge verified-badge">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="property-info-section glass-card">
            <h1>{property.title}</h1>
            <div className="info-meta">
              <div className="meta-item">
                <MapPin size={20} className="text-primary" />
                <span>{property.area}, {property.city}</span>
              </div>
              <div className="meta-item">
                <Calendar size={20} className="text-primary" />
                <span>Listed on {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="description-box">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>

            <div className="amenities-box">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {Object.entries(property.amenities || {}).map(([key, value]) => (
                  value && (
                    <div key={key} className="amenity-item">
                      {key.toLowerCase().includes('wifi') && <Wifi size={18} />}
                      {key.toLowerCase().includes('parking') && <Car size={18} />}
                      {key.toLowerCase().includes('security') && <Shield size={18} />}
                      {!['wifi', 'parking', 'security'].some(k => key.toLowerCase().includes(k)) && <CheckCircle2 size={18} />}
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar with Price and Owner Info */}
        <aside className="detail-sidebar">
          <div className="sticky-sidebar">
            <div className="booking-card glass-card">
              <div className="price-tag">
                <IndianRupee size={32} />
                <span className="amount">{property.rent}</span>
                <span className="period">/ month</span>
              </div>
              
              <div className="availability-status">
                <span className={`status-dot ${property.is_available ? 'available' : 'unavailable'}`}></span>
                <span>{property.is_available ? 'Available for Rent' : 'Currently Rented'}</span>
              </div>

              <div className="divider"></div>

              <div className="owner-info">
                <h3>Contact Owner</h3>
                <div className="owner-profile">
                  <div className="avatar">
                    <User size={24} />
                  </div>
                  <div className="owner-details">
                    <span className="owner-name">{property.owner_username}</span>
                    <span className="owner-label">Property Owner</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary w-full contact-btn"
                  onClick={() => window.location.href = `tel:${property.owner_phone}`}
                >
                  <Phone size={20} />
                  <span>Call {property.owner_phone}</span>
                </button>
              </div>

              <p className="safety-tip">
                <Shield size={14} />
                Never pay any booking amount without visiting the property.
              </p>
            </div>

            <div className="quick-actions glass-card">
              <button className="btn btn-secondary w-full" onClick={() => navigate('/properties')}>
                <Building2 size={20} />
                View Similar Properties
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetail;
