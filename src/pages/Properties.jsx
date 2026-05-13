import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Filter } from 'lucide-react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    min_rent: '',
    max_rent: '',
  });

  const loadProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.property_type) queryParams.append('property_type', filters.property_type);
      if (filters.min_rent) queryParams.append('min_rent', filters.min_rent);
      if (filters.max_rent) queryParams.append('max_rent', filters.max_rent);
      
      const data = await fetchAPI(`/properties/?${queryParams.toString()}`);
      if (data && data.results) {
        setProperties(data.results);
      }
    } catch (err) {
      console.error("Failed to load properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadProperties();
    setShowFilters(false);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="pt-12 pb-20 container mx-auto px-4 max-w-[1400px]">
      <div className="mb-14 text-center animate-[fadeIn_0.6s_ease-out]">
        <h1 className="text-5xl md:text-[2.5rem] mb-2 font-bold font-outfit bg-clip-text text-transparent bg-gradient-to-br from-text-main to-text-muted">
          Find <span className="text-gradient">Properties</span>
        </h1>
        <p className="text-xl text-text-muted">Browse our extensive list of premium rooms, PGs, and flats.</p>
      </div>

      <div className="lg:hidden mb-8">
        <button className="btn btn-secondary w-full" onClick={toggleFilters}>
          {showFilters ? <X size={20} /> : <Filter size={20} />}
          {showFilters ? 'Close Filters' : 'Filter & Search'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className={`glass-card p-8 fixed lg:sticky top-0 lg:top-[110px] left-0 w-full md:w-[320px] h-screen lg:h-auto z-[1002] lg:z-auto transition-all duration-400 ease-in-out lg:rounded-2xl rounded-none overflow-y-auto lg:flex-none lg:w-[320px] ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
            <SlidersHorizontal size={20} className="text-primary" />
            <h3 className="text-2xl font-bold font-outfit text-text-main">Filters</h3>
            <button className="ml-auto text-text-muted lg:hidden" onClick={() => setShowFilters(false)}>
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={applyFilters} className="flex flex-col gap-8">
            <div>
              <label className="block text-[0.9rem] font-semibold mb-3 text-text-muted uppercase tracking-wider">City / Location</label>
              <div className="bg-white/80 border border-black/10 rounded-xl px-4 py-1 flex items-center gap-3 shadow-inner">
                <MapPin size={18} className="text-primary" />
                <input 
                  type="text" 
                  name="city"
                  placeholder="e.g. Mumbai" 
                  className="border-none bg-transparent text-text-main placeholder:text-text-dim h-[45px] w-full outline-none"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-3 text-text-muted uppercase tracking-wider">Property Type</label>
              <select 
                name="property_type" 
                className="form-input"
                value={filters.property_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="ROOM">Room</option>
                <option value="PG">Paying Guest (PG)</option>
                <option value="FLAT">Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.9rem] font-semibold mb-3 text-text-muted uppercase tracking-wider">Rent Range</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  name="min_rent"
                  placeholder="Min" 
                  className="form-input"
                  value={filters.min_rent}
                  onChange={handleFilterChange}
                />
                <span className="text-text-muted">-</span>
                <input 
                  type="number" 
                  name="max_rent"
                  placeholder="Max" 
                  className="form-input"
                  value={filters.max_rent}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2">
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Listings */}
        <main className="flex-1 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white/60 rounded-2xl border border-dashed border-black/10 text-text-main font-medium shadow-sm">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white/60 rounded-2xl border border-dashed border-black/10 shadow-sm">
              <Search size={48} className="text-primary mb-6 opacity-40" />
              <h3 className="text-2xl font-bold font-outfit mb-2 text-text-main">No properties found</h3>
              <p className="text-text-muted">Try adjusting your filters to find what you're looking for.</p>
              <button 
                className="btn btn-secondary mt-6"
                onClick={() => {
                  setFilters({ city: '', property_type: '', min_rent: '', max_rent: '' });
                  loadProperties();
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </main>
      </div>

      {showFilters && <div className="fixed inset-0 bg-black/20 backdrop-blur-[4px] z-[1001] lg:hidden" onClick={() => setShowFilters(false)}></div>}
    </div>
  );
};

export default Properties;

