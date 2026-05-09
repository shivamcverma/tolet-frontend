import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchAPI('/properties/');
        // Just take first 3 for home page
        if (data && data.results) {
          setFeaturedProperties(data.results.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load properties", err);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Find Your Perfect <span className="text-gradient">Home</span></h1>
          <p className="hero-subtitle">Discover premium Rooms, PGs, and Flats in your city</p>
          
          <div className="search-box glass-card">
            <div className="search-input-group">
              <MapPin className="search-icon" />
              <input 
                type="text" 
                placeholder="Enter city or area..." 
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary search-btn">
              <Search size={22} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured Listings</h2>
          <p>Hand-picked premium properties for you</p>
        </div>
        
        <div className="property-grid">
          {featuredProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
          {featuredProperties.length === 0 && (
            <p>No featured properties found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
