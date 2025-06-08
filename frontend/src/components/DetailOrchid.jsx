import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';

// Import styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './DetailOrchid.css';

export default function DetailOrchid() {
  const [orchid, setOrchid] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('details');
  const { id } = useParams();
  const navigate = useNavigate();
  
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOrchidData();
  }, [id]);

  const fetchOrchidData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/${id}`);
      setOrchid(response.data);
    } catch (error) {
      console.error('Error fetching orchid:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="loader"
        />
      </div>
    );
  }

  return (
    <div className="orchid-detail-container">
      {/* Header Section */}
      <header className="detail-header">
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="back-button">
            <i className="fas fa-arrow-left" /> Back
          </button>
          <h1>{orchid.orchidName}</h1>
        </nav>
      </header>

      {/* Main Content */}
      <main className="detail-content">
        {/* Image Gallery */}
        <section className="image-gallery">
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            effect="fade"
            navigation
            pagination={{ clickable: true }}
            className="main-swiper"
          >
            <SwiperSlide>
              <LazyLoadImage
                src={orchid.image}
                alt={orchid.orchidName}
                effect="blur"
                className="main-image"
              />
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Info Sections */}
        <section className="info-sections">
          <div className="section-tabs">
            <button 
              className={`tab ${activeSection === 'details' ? 'active' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              Details
            </button>
            <button 
              className={`tab ${activeSection === 'care' ? 'active' : ''}`}
              onClick={() => setActiveSection('care')}
            >
              Care Guide
            </button>
          </div>

          <div className="section-content">
            {activeSection === 'details' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="details-section"
              >
                <div className="detail-item">
                  <h3>Type</h3>
                  <p>{orchid.isNatural ? 'Natural Orchid' : 'Industrial Orchid'}</p>
                </div>
                <div className="detail-item">
                  <h3>Description</h3>
                  <p>{orchid.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="edit-button"
                  onClick={() => navigate(`/edit/${orchid.id}`)}
                >
                  Edit Orchid
                </motion.button>
              </motion.div>
            )}

            {activeSection === 'care' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="care-section"
              >
                <div className="care-grid">
                  <div className="care-item">
                    <i className="fas fa-tint" />
                    <h4>Watering</h4>
                    <p>{orchid.isNatural ? 'Allow to dry between watering' : 'Keep consistently moist'}</p>
                  </div>
                  <div className="care-item">
                    <i className="fas fa-sun" />
                    <h4>Light</h4>
                    <p>Bright indirect light</p>
                  </div>
                  <div className="care-item">
                    <i className="fas fa-thermometer-half" />
                    <h4>Temperature</h4>
                    <p>18-24°C (65-75°F)</p>
                  </div>
                  <div className="care-item">
                    <i className="fas fa-wind" />
                    <h4>Humidity</h4>
                    <p>60-80%</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}