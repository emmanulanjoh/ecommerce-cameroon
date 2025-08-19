import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
  Send,
  WhatsApp,
  Public,
} from '@mui/icons-material';

const ModernContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      await response.json();
      
      if (response.ok) {
        alert('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Fallback to WhatsApp if email fails
        const whatsappMessage = `Contact Form Message:%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0A%0AMessage: ${formData.message}`;
        const whatsappUrl = `https://wa.me/${process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER?.replace('+', '') || '237678830036'}?text=${whatsappMessage}`;
        
        if (window.confirm('Email failed to send. Would you like to send via WhatsApp instead?')) {
          window.open(whatsappUrl, '_blank');
          setFormData({ name: '', email: '', subject: '', message: '' });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+237 6XX XXX XXX', '+237 6XX XXX XXX'],
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      icon: Email,
      title: 'Email',
      details: ['info@ecommerce-cameroon.com', 'support@ecommerce-cameroon.com'],
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      icon: LocationOn,
      title: 'Address',
      details: ['Douala, Cameroon', 'Yaoundé, Cameroon'],
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      icon: WhatsApp,
      title: 'WhatsApp',
      details: ['+237 6XX XXX XXX', 'Available 24/7'],
      color: '#059669',
      bgColor: '#ecfdf5',
    },
  ];

  const socialLinks = [
    { name: 'Facebook', color: '#1877f2' },
    { name: 'Twitter', color: '#1da1f2' },
    { name: 'Instagram', color: '#e4405f' },
    { name: 'WhatsApp', color: '#25d366' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8)), url(https://via.placeholder.com/1200x400/667eea/ffffff?text=Contact+Background)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
            <div style={{ textAlign: 'center' }}>
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
                Contact Us
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                  opacity: 0.95,
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                We're here to help! Get in touch with us for any questions or support.
              </p>
            </div>
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

      <div style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '3rem',
            }}
          >
            {/* Contact Form */}
            <div style={{ gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                      }}
                    >
                      <Send style={{ fontSize: '1.5rem', color: 'white' }} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                      Send us a Message
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '1.5rem',
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            style={{
                              width: '100%',
                              padding: '1rem',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '1rem',
                              transition: 'all 0.2s',
                              outline: 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#8b5cf6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#374151',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            required
                            style={{
                              width: '100%',
                              padding: '1rem',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '1rem',
                              transition: 'all 0.2s',
                              outline: 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#8b5cf6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          required
                          style={{
                            width: '100%',
                            padding: '1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your inquiry..."
                          required
                          rows={6}
                          style={{
                            width: '100%',
                            padding: '1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            outline: 'none',
                            resize: 'none',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                          color: 'white',
                          fontWeight: '600',
                          padding: '1rem 2rem',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Send style={{ fontSize: '1.2rem' }} />
                        Send Message
                      </button>
                    </div>
                  </form>
                  
                  {/* Decorative gradient bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)',
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
                  Get in Touch
                </h3>
                
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: info.bgColor,
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: info.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent style={{ fontSize: '1.2rem', color: 'white' }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem' }}>
                            {info.title}
                          </h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0.25rem 0' }}>
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Business Hours */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                      }}
                    >
                      <Schedule style={{ fontSize: '1.2rem', color: 'white' }} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Business Hours
                    </h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    <p style={{ margin: 0 }}>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p style={{ margin: 0 }}>Saturday: 9:00 AM - 4:00 PM</p>
                    <p style={{ margin: 0 }}>Sunday: Closed</p>
                  </div>
                </div>

                {/* Social Media */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    Follow Us
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {socialLinks.map((social, index) => (
                      <div
                        key={index}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: social.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {social.name[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ padding: '100px 0', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1rem' }}>
              Find Us
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              We're located in the heart of Cameroon's major cities
            </p>
          </motion.div>
          
          <div
            style={{
              background: 'linear-gradient(135deg, #e0e7ff, #fce7f3, #fed7aa)',
              height: '400px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <Public style={{ fontSize: '2.5rem', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Interactive Map Coming Soon
              </h3>
              <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
                We're working on integrating an interactive map to help you find us easily across Cameroon.
              </p>
            </div>
            
            {/* Decorative elements */}
            <div
              style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-75px',
                left: '-75px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernContact;