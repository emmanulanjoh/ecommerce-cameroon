import React from 'react';
import { motion } from 'framer-motion';
import {
  Security,
  LocalShipping,
  Star,
  People,
  Business,
  Timeline,
} from '@mui/icons-material';

const ModernAbout: React.FC = () => {
  const values = [
    {
      icon: Security,
      title: 'Trust & Security',
      description: 'Your security is our priority with encrypted transactions and secure data handling.',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    },
    {
      icon: LocalShipping,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across Cameroon with real-time tracking.',
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    },
    {
      icon: Star,
      title: 'Quality Products',
      description: 'Carefully curated products from trusted suppliers and brands.',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    },
    {
      icon: People,
      title: 'Customer First',
      description: '24/7 customer support with personalized service and care.',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: People, color: '#8b5cf6' },
    { number: '5,000+', label: 'Products', icon: Business, color: '#3b82f6' },
    { number: '50+', label: 'Cities Served', icon: LocalShipping, color: '#10b981' },
    { number: '99%', label: 'Satisfaction Rate', icon: Star, color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'url(/images/hero/about.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          padding: '120px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: '900',
                marginBottom: '2rem',
                background: 'linear-gradient(45deg, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              About E-commerce Cameroon
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                maxWidth: '800px',
                margin: '0 auto',
                opacity: 0.95,
                lineHeight: '1.6',
              }}
            >
              Your trusted partner for online shopping in Cameroon, connecting you with quality products and exceptional service.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-150px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
      </div>

      {/* Stats Section */}
      <div style={{ padding: '100px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  style={{
                    backgroundColor: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '24px',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: stat.color,
                      margin: '0 auto 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    }}
                  >
                    <IconComponent style={{ fontSize: '2rem', color: 'white' }} />
                  </div>
                  <h3
                    style={{
                      fontSize: '3rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0 0 0.5rem',
                    }}
                  >
                    {stat.number}
                  </h3>
                  <p style={{ color: '#6b7280', fontWeight: '500', margin: 0 }}>
                    {stat.label}
                  </p>
                  
                  {/* Decorative gradient bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${stat.color}, #8b5cf6)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                  }}
                >
                  <Timeline style={{ fontSize: '1.5rem', color: 'white' }} />
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  Our Story
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  Founded in 2020, E-commerce Cameroon began with a simple mission: to make quality products accessible to everyone across Cameroon through a seamless online shopping experience.
                </p>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  What started as a small team with big dreams has grown into Cameroon's trusted e-commerce platform, serving thousands of customers with dedication and innovation.
                </p>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                  Today, we continue to evolve, embracing new technologies and expanding our reach to serve you better.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  height: '500px',
                  borderRadius: '24px',
                  backgroundImage: 'url(/images/hero.jpg)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div style={{ padding: '100px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
              Our Values
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              The principles that guide everything we do and shape our commitment to excellence.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
            }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  style={{
                    backgroundColor: 'white',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: value.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                      }}
                    >
                      <IconComponent style={{ fontSize: '1.5rem', color: 'white' }} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {value.title}
                    </h3>
                  </div>
                  <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                    {value.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.05)',
                      transform: 'translate(50px, -50px)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: 'white',
          padding: '100px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 20px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem' }}>
              Our Mission
            </h2>
            <blockquote
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontStyle: 'italic',
                lineHeight: '1.6',
                opacity: 0.95,
                margin: 0,
              }}
            >
              "To revolutionize e-commerce in Cameroon by providing a seamless, secure, and delightful shopping experience that connects customers with quality products and exceptional service."
            </blockquote>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '-200px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            right: '-150px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
      </div>
    </div>
  );
};

export default ModernAbout;