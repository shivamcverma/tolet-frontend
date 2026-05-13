import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMyProperties = async () => {
      try {
        const data = await fetchAPI('/properties/my_properties/');
        if (data && data.results) {
          setProperties(data.results);
        } else if (Array.isArray(data)) {
          setProperties(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMyProperties();
  }, []);

  return (
    <div className="py-12 md:py-20 container mx-auto px-4 max-w-[1400px]">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 mb-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 text-text-main">
          <LayoutDashboard size={28} className="text-primary" />
          <h1 className="text-3xl font-bold font-outfit m-0">Owner Dashboard</h1>
        </div>
        <Link to="/add-property" className="btn btn-primary w-full md:w-auto">
          <Plus size={20} />
          <span>Add New Property</span>
        </Link>
      </div>

      {error && <div className="glass-card bg-rose-500/10 border-rose-500/20 text-rose-600 p-4 rounded-xl mb-8 font-medium text-center">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
        <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
          <span className="text-[0.85rem] font-semibold text-text-muted uppercase tracking-wider">Total Listings</span>
          <span className="text-[2.5rem] md:text-5xl font-extrabold font-outfit text-text-main leading-none">{properties.length}</span>
        </div>
        <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
          <span className="text-[0.85rem] font-semibold text-text-muted uppercase tracking-wider">Active</span>
          <span className="text-[2.5rem] md:text-5xl font-extrabold font-outfit text-text-main leading-none">{properties.filter(p => p.is_available).length}</span>
        </div>
        <div className="glass-card p-6 md:p-8 flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1">
          <span className="text-[0.85rem] font-semibold text-text-muted uppercase tracking-wider">Verified</span>
          <span className="text-[2.5rem] md:text-5xl font-extrabold font-outfit text-text-main leading-none">{properties.filter(p => p.is_verified).length}</span>
        </div>
      </div>

      <div>
        <h2 className="text-[1.5rem] md:text-3xl mb-8 border-l-4 border-primary pl-4 font-bold font-outfit text-text-main">My Properties</h2>
        {loading ? (
          <p className="text-text-muted font-medium py-10">Loading your listings...</p>
        ) : properties.length === 0 ? (
          <div className="glass-card p-8 md:p-16 text-center max-w-[600px] mx-auto my-8">
            <h3 className="text-xl md:text-2xl font-bold font-outfit mb-4 text-text-main">You haven't added any properties yet.</h3>
            <p className="text-text-muted mb-8 text-[1.1rem]">Start listing your rooms, PGs or flats to reach thousands of students.</p>
            <Link to="/add-property" className="btn btn-primary inline-flex">Create First Listing</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
