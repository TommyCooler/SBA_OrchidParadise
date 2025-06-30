import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { OrchidService, CategoryService } from '../services';

// Import styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './DetailOrchid.css';

export default function DetailOrchid() {
  const [orchid, setOrchid] = useState({});
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('details');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrchidData();
  }, [id]);

  const fetchOrchidData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orchid data
      const orchidData = await OrchidService.getOrchidById(id);
      setOrchid(orchidData);
      
      // Fetch category name using categoryId
      if (orchidData.categoryId) {
        try {
          const categoryData = await CategoryService.getCategoryById(orchidData.categoryId);
          setCategory(categoryData);
        } catch (categoryError) {
          console.warn('Error fetching category:', categoryError);
          setCategory({ categoryName: 'Unknown Category' });
        }
      }
      
    } catch (error) {
      console.error('Error fetching orchid:', error);
      setError('Failed to load orchid data');
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

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error Loading Orchid</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Go Back Home
          </button>
        </div>
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
          {category.categoryName && (
            <span className="category-badge">{category.categoryName}</span>
          )}
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
                src={orchid.orchidUrl || orchid.image}
                alt={orchid.orchidName}
                effect="blur"
                className="main-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(orchid.orchidName)}&background=random&size=800`;
                }}
              />
            </SwiperSlide>
          </Swiper>
          
          {/* Price Badge */}
          {/* {orchid.price && (
            <div className="price-badge">
              <i className="fas fa-dollar-sign"></i>
              {parseFloat(orchid.price).toFixed(2)}
            </div>
          )} */}
          
          {/* Type Badge */}
          {/* <div className={`type-badge ${orchid.isNatural ? 'natural' : 'industrial'}`}>
            <i className={`fas ${orchid.isNatural ? 'fa-leaf' : 'fa-cog'}`}></i>
            {orchid.isNatural ? 'Natural' : 'Industrial'}
          </div> */}
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
            {/* <button 
              className={`tab ${activeSection === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveSection('specs')}
            >
              Specifications
            </button> */}
          </div>

          <div className="section-content">
            {activeSection === 'details' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="details-section"
              >
                <div className="detail-item">
                  <h3>
                    <i className="fas fa-info-circle"></i>
                    Description
                  </h3>
                  <p>{orchid.orchidDescription || "No description available for this orchid."}</p>
                </div>
                
                <div className="detail-item">
                  <h3>
                    <i className="fas fa-tag"></i>
                    Type
                  </h3>
                  <p>{orchid.isNatural ? 'Natural Orchid' : 'Industrial Orchid'}</p>
                </div>

                {category.categoryName && (
                  <div className="detail-item">
                    <h3>
                      <i className="fas fa-folder"></i>
                      Category
                    </h3>
                    <p>{category.categoryName}</p>
                  </div>
                )}

                {orchid.price && (
                  <div className="detail-item">
                    <h3>
                      <i className="fas fa-dollar-sign"></i>
                      Price
                    </h3>
                    <p className="price-text">${parseFloat(orchid.price).toFixed(2)}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="edit-button"
                  onClick={() => navigate(`/edit/${orchid.orchidId}`)}
                >
                  <i className="fas fa-edit"></i>
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
                  <div className="care-item">
                    <i className="fas fa-seedling" />
                    <h4>Fertilizing</h4>
                    <p>{orchid.isNatural ? 'Monthly with diluted fertilizer' : 'Bi-weekly during growing season'}</p>
                  </div>
                  <div className="care-item">
                    <i className="fas fa-scissors" />
                    <h4>Pruning</h4>
                    <p>Remove dead flowers and yellowing leaves</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'specs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="specs-section"
              >
                <div className="specs-grid">
                  <div className="spec-item">
                    <label>Orchid ID</label>
                    <value>#{orchid.orchidId}</value>
                  </div>
                  <div className="spec-item">
                    <label>Name</label>
                    <value>{orchid.orchidName}</value>
                  </div>
                  <div className="spec-item">
                    <label>Type</label>
                    <value>{orchid.isNatural ? 'Natural' : 'Industrial'}</value>
                  </div>
                  {category.categoryName && (
                    <div className="spec-item">
                      <label>Category</label>
                      <value>{category.categoryName}</value>
                    </div>
                  )}
                  {orchid.price && (
                    <div className="spec-item">
                      <label>Price</label>
                      <value>${parseFloat(orchid.price).toFixed(2)}</value>
                    </div>
                  )}
                  <div className="spec-item">
                    <label>Image URL</label>
                    <value className="url-text">{orchid.orchidUrl}</value>
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