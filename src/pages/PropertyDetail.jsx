import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Phone, CheckCircle2, Wifi, Car, Shield, Building2, Calendar, User } from 'lucide-react';
import { fetchAPI, API_BASE_URL } from '../api';

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

  if (loading) return <div className="flex justify-center py-20 text-text-muted font-medium">Loading property details...</div>;
  if (error) return <div className="flex justify-center py-20 text-rose-500 font-medium">Error: {error}</div>;
  if (!property) return <div className="flex justify-center py-20 text-rose-500 font-medium">Property not found.</div>;

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
    <div className="py-8 pb-20 container mx-auto px-4 max-w-[1400px]">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
        {/* Left Column: Images and Description */}
        <div className="flex flex-col gap-10">
          <div className="glass-card p-4 md:p-6 overflow-hidden">
            <div className="relative w-full h-[300px] md:h-[550px] rounded-2xl overflow-hidden mb-6 border border-black/5 group">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm bg-violet-500/90 text-white shadow-sm">
                  {property.property_type}
                </span>
                {property.is_verified && (
                  <span className="px-3 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm bg-cyan-500/90 text-white shadow-sm flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`flex-none w-[100px] md:w-[120px] h-[65px] md:h-[80px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:-translate-y-1 ${activeImage === index ? 'border-primary opacity-100 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 md:p-12">
            <h1 className="text-[2rem] md:text-[3rem] font-bold font-outfit mb-4 leading-tight text-text-main">{property.title}</h1>
            <div className="flex flex-wrap gap-5 md:gap-10 mb-6 md:mb-10 pb-6 md:pb-10 border-b border-black/5">
              <div className="flex items-center gap-3 text-text-muted text-[0.95rem] md:text-lg">
                <MapPin size={20} className="text-primary" />
                <span>{property.area}, {property.city}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted text-[0.95rem] md:text-lg">
                <Calendar size={20} className="text-primary" />
                <span>Listed on {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[1.4rem] md:text-[1.8rem] mb-4 md:mb-6 font-outfit font-bold text-text-main">Description</h3>
              <p className="leading-relaxed text-text-muted text-[1.15rem] whitespace-pre-line">{property.description}</p>
            </div>

            <div>
              <h3 className="text-[1.4rem] md:text-[1.8rem] mb-4 md:mb-6 font-outfit font-bold text-text-main">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:gap-6">
                {Object.entries(property.amenities || {}).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-4 p-3 md:p-5 bg-black/5 border border-black/5 rounded-xl transition-all duration-300 hover:bg-white hover:border-primary hover:-translate-y-0.5 hover:shadow-sm">
                      {key.toLowerCase().includes('wifi') && <Wifi size={18} className="text-secondary" />}
                      {key.toLowerCase().includes('parking') && <Car size={18} className="text-secondary" />}
                      {key.toLowerCase().includes('security') && <Shield size={18} className="text-secondary" />}
                      {!['wifi', 'parking', 'security'].some(k => key.toLowerCase().includes(k)) && <CheckCircle2 size={18} className="text-secondary" />}
                      <span className="text-text-main font-medium text-[0.9rem] md:text-base">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Sidebar with Price and Owner Info */}
        <aside className="w-full">
          <div className="xl:sticky xl:top-[110px] flex flex-col gap-8">
            <div className="glass-card p-6 md:p-10">
              <div className="flex items-baseline gap-2.5 mb-6 text-primary font-outfit">
                <IndianRupee size={32} />
                <span className="text-[2.2rem] md:text-[3rem] font-extrabold">{property.rent}</span>
                <span className="text-text-muted text-lg md:text-xl font-sans">/ month</span>
              </div>
              
              <div className="flex items-center gap-3 text-text-main font-medium mb-8">
                <span className={`w-3 h-3 rounded-full ${property.is_available ? 'bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
                <span>{property.is_available ? 'Available for Rent' : 'Currently Rented'}</span>
              </div>

              <div className="h-px bg-black/5 w-full my-8"></div>

              <div>
                <h3 className="text-xl font-bold font-outfit text-text-main mb-6">Contact Owner</h3>
                <div className="flex items-center gap-5 mb-8 p-4 bg-white/60 border border-black/5 rounded-xl shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-white shadow-md flex-shrink-0">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-text-main">{property.owner_username}</span>
                    <span className="text-sm text-text-muted">Property Owner</span>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary w-full shadow-md"
                  onClick={() => window.location.href = `tel:${property.owner_phone}`}
                >
                  <Phone size={20} />
                  <span>Call {property.owner_phone}</span>
                </button>
              </div>

              <div className="mt-8 flex gap-3 text-[0.9rem] text-amber-600 leading-relaxed p-4 bg-amber-50 rounded-lg border border-amber-200">
                <Shield size={18} className="flex-shrink-0 mt-0.5" />
                <p>Never pay any booking amount without visiting the property.</p>
              </div>
            </div>

            <div className="glass-card p-6">
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
