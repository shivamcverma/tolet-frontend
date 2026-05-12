import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Filter } from 'lucide-react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import './Properties.css';

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
    <div className="properties-page container">
      <div className="properties-header animate-fade">
        <h1>Find <span className="text-gradient">Properties</span></h1>
        <p>Browse our extensive list of premium rooms, PGs, and flats.</p>
      </div>

      <div className="mobile-filter-toggle show-only-mobile">
        <button className="btn btn-secondary w-full" onClick={toggleFilters}>
          {showFilters ? <X size={20} /> : <Filter size={20} />}
          {showFilters ? 'Close Filters' : 'Filter & Search'}
        </button>
      </div>

      <div className="properties-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar glass-card ${showFilters ? 'mobile-active' : ''}`}>
          <div className="filters-header">
            <SlidersHorizontal size={20} />
            <h3>Filters</h3>
            <button className="close-filters show-only-mobile" onClick={() => setShowFilters(false)}>
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={applyFilters} className="filters-form">
            <div className="form-group">
              <label className="form-label">City / Location</label>
              <div className="search-input-group bordered">
                <MapPin size={18} className="search-icon" />
                <input 
                  type="text" 
                  name="city"
                  placeholder="e.g. Mumbai" 
                  className="form-input no-border"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
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

            <div className="form-group">
              <label className="form-label">Rent Range</label>
              <div className="rent-range-inputs">
                <input 
                  type="number" 
                  name="min_rent"
                  placeholder="Min" 
                  className="form-input"
                  value={filters.min_rent}
                  onChange={handleFilterChange}
                />
                <span>-</span>
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

            <button type="submit" className="btn btn-primary w-full">
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Listings */}
        <main className="listings-container">
          {loading ? (
            <div className="loading-state glass-card">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="empty-state glass-card">
              <Search size={48} className="empty-icon" />
              <h3>No properties found</h3>
              <p>Try adjusting your filters to find what you're looking for.</p>
              <button 
                className="btn btn-secondary mt-4"
                onClick={() => {
                  setFilters({ city: '', property_type: '', min_rent: '', max_rent: '' });
                  loadProperties();
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="property-grid">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </main>
      </div>

      {showFilters && <div className="mobile-overlay" onClick={() => setShowFilters(false)}></div>}
    </div>
  );
};

export default Properties;

