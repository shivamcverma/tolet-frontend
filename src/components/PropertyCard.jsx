import React from 'react';
import { MapPin, IndianRupee, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  
  let imageSrc = defaultImage;
  if (property.images && property.images.length > 0) {
    const imgPath = property.images[0].image;
    imageSrc = imgPath.startsWith('http') ? imgPath : `${API_BASE_URL}${imgPath}`;
  }

  return (
    <Link to={`/property/${property.id}`} className="property-card glass-card">
      <div className="property-image-container">
        <img src={imageSrc} alt={property.title} className="property-image" />
        <div className="property-badges">
          <span className="badge type-badge">{property.property_type}</span>
          {property.is_verified && <span className="badge verified-badge">Verified</span>}
        </div>
        <button className="favorite-btn" onClick={(e) => { e.preventDefault(); /* Handle fav */ }}>
          <Heart size={20} />
        </button>
      </div>
      <div className="property-content">
        <div className="property-price">
          <IndianRupee size={18} />
          <span>{property.rent} <small>/ month</small></span>
        </div>
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <MapPin size={16} />
          <span>{property.area}, {property.city}</span>
        </div>
        <div className="property-footer">
          <span className="owner-name">By {property.owner_username}</span>
          <span className={`status-dot ${property.is_available ? 'available' : 'unavailable'}`}></span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
