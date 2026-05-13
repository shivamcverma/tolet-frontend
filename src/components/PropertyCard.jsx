import React from 'react';
import { MapPin, IndianRupee, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const PropertyCard = ({ property }) => {
  const defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  
  let imageSrc = defaultImage;
  if (property.images && property.images.length > 0) {
    const imgPath = property.images[0].image;
    imageSrc = imgPath.startsWith('http') ? imgPath : `${API_BASE_URL}${imgPath}`;
  }

  return (
    <Link to={`/property/${property.id}`} className="group block rounded-2xl overflow-hidden text-inherit no-underline transition-all duration-300 glass-card">
      <div className="relative h-[240px] overflow-hidden">
        <img src={imageSrc} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-4 left-4 flex gap-2 z-[5]">
          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm bg-violet-500/90 text-white shadow-sm">
            {property.property_type}
          </span>
          {property.is_verified && (
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm bg-cyan-500/90 text-white shadow-sm">
              Verified
            </span>
          )}
        </div>
        <button 
          className="absolute top-4 right-4 w-[38px] h-[38px] rounded-full bg-white/80 backdrop-blur-sm text-text-muted flex items-center justify-center z-[5] border border-black/5 shadow-sm transition-all duration-300 hover:bg-rose-500 hover:text-white hover:border-rose-500" 
          onClick={(e) => { e.preventDefault(); /* Handle fav */ }}
        >
          <Heart size={20} />
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1 text-primary text-2xl font-extrabold mb-2 font-outfit">
          <IndianRupee size={18} />
          <span>{property.rent} <small className="text-sm text-text-muted font-normal">/ month</small></span>
        </div>
        <h3 className="text-xl mb-3 whitespace-nowrap overflow-hidden text-ellipsis text-text-main font-bold">
          {property.title}
        </h3>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
          <MapPin size={16} />
          <span>{property.area}, {property.city}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-black/5">
          <span className="text-sm text-text-dim font-medium">By {property.owner_username}</span>
          <span className={`w-2.5 h-2.5 rounded-full ${property.is_available ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
