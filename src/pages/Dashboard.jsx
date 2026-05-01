import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../api';
import PropertyCard from '../components/PropertyCard';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

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
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <div className="header-title">
          <LayoutDashboard size={28} />
          <h1>Owner Dashboard</h1>
        </div>
        <Link to="/add-property" className="btn btn-primary">
          <Plus size={20} />
          <span>Add New Property</span>
        </Link>
      </div>

      {error && <div className="error-message glass-card">{error}</div>}

      <div className="dashboard-stats grid">
        <div className="stat-card glass-card">
          <span className="stat-label">Total Listings</span>
          <span className="stat-value">{properties.length}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{properties.filter(p => p.is_available).length}</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-label">Verified</span>
          <span className="stat-value">{properties.filter(p => p.is_verified).length}</span>
        </div>
      </div>

      <div className="my-listings">
        <h2>My Properties</h2>
        {loading ? (
          <p>Loading your listings...</p>
        ) : properties.length === 0 ? (
          <div className="empty-dashboard glass-card">
            <h3>You haven't added any properties yet.</h3>
            <p>Start listing your rooms, PGs or flats to reach thousands of students.</p>
            <button className="btn btn-primary mt-4">Create First Listing</button>
          </div>
        ) : (
          <div className="property-grid">
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
