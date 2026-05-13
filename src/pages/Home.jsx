import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchAPI('/properties/');

        if (data && data.results) {
          setFeaturedProperties(data.results.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load properties", err);
      }
    };

    loadFeatured();
  }, []);

  // SEARCH FUNCTION
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const data = await fetchAPI(
        `/properties/?city=${searchQuery}`
      );

      if (data && data.results) {
        setFeaturedProperties(data.results);
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="pb-20">

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[60vh] flex items-center justify-center pt-20 md:pt-[100px] md:pb-16 overflow-hidden z-0">
        <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] bg-primary blur-[150px] opacity-[0.08] -z-10 rounded-full"></div>
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-secondary blur-[150px] opacity-[0.08] -z-10 rounded-full"></div>
        
        <div className="container mx-auto px-4 text-center z-10 max-w-[900px]">

          <h1 className="text-5xl lg:text-[4rem] md:text-5xl sm:text-[3rem] xs:text-[2.4rem] leading-[1.1] mb-6 font-extrabold animate-[fadeIn_0.8s_ease-out] text-text-main">
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Home</span>
          </h1>

          <p className="text-xl sm:text-[1.1rem] xs:text-base text-text-muted mb-14 md:mb-10 animate-[fadeIn_1s_ease-out]">
            Discover premium Rooms, PGs, and Flats in your city
          </p>

          <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto] md:p-1 md:gap-1 gap-4 p-3 max-w-[700px] mx-auto animate-[fadeIn_1.2s_ease-out] glass-card shadow-lg border border-black/5">

            <div className="flex items-center gap-4 px-5 md:w-[98%] bg-white rounded-xl border border-black/5 md:h-full shadow-inner">
              <MapPin className="text-primary" />

              <input
                type="text"
                placeholder="Enter city or area..."
                className="flex-1 bg-transparent border-none text-text-main placeholder:text-text-dim h-[60px] md:h-[50px] text-lg md:text-base outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>

            <button
              className="btn btn-primary h-[60px] md:h-[50px] px-10 md:px-5 md:w-auto xs:w-[40px] xs:mx-auto xs:p-0 flex items-center justify-center"
              onClick={handleSearch}
            >
              <Search size={22} />
              <span className="xs:hidden ml-2">Search</span>
            </button>

          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 -mt-20 md:mt-0 md:pt-16 relative z-20">

        <div className="text-center mb-12">
          <h2 className="text-[2.5rem] md:text-[2rem] mb-2 font-bold text-text-main">Featured Listings</h2>
          <p className="text-lg text-text-muted">Hand-picked premium properties for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6">

          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}

          {featuredProperties.length === 0 && (
            <p className="text-text-muted text-center col-span-full">No featured properties found.</p>
          )}

        </div>
      </section>
    </div>
  );
};

export default Home;