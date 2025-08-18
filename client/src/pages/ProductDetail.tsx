import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Product, Review, ReviewForm } from '../types';

// Modern CSS styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    background: 'linear-gradient(to-br, #f8fafc, #e2e8f0)',
    minHeight: '100vh'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'white',
    border: 'none',
    borderRadius: '25px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: '#4a5568'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    marginBottom: '48px',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr'
    }
  },
  imageCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    position: 'relative' as const
  },
  mainImage: {
    width: '100%',
    height: '400px',
    objectFit: 'contain' as const,
    background: '#f7fafc'
  },
  thumbnails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '8px',
    padding: '16px',
    maxWidth: '100%'
  },
  thumbnail: {
    width: '100%',
    height: '80px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s ease'
  },
  thumbnailActive: {
    border: '2px solid #3182ce'
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0'
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#38a169'
  },
  badge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  inStockBadge: {
    background: '#c6f6d5',
    color: '#22543d'
  },
  outOfStockBadge: {
    background: '#fed7d7',
    color: '#742a2a'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4a5568'
  },
  orderCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '32px',
    textAlign: 'center' as const,
    color: 'white'
  },
  whatsappButton: {
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '0 auto',
    transition: 'all 0.3s ease'
  },
  featuresCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  reviewsSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  tabButton: {
    padding: '12px 24px',
    border: 'none',
    background: '#f7fafc',
    borderRadius: '25px',
    cursor: 'pointer',
    marginRight: '12px',
    transition: 'all 0.3s ease'
  },
  tabButtonActive: {
    background: '#3182ce',
    color: 'white'
  },
  form: {
    display: 'grid',
    gap: '16px',
    maxWidth: '600px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease'
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    minHeight: '120px',
    resize: 'vertical' as const,
    transition: 'border-color 0.3s ease'
  },
  submitButton: {
    background: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  reviewCard: {
    background: '#f7fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    borderLeft: '4px solid #3182ce'
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginTop: '48px'
  },
  relatedCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  relatedImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const
  },
  relatedContent: {
    padding: '16px'
  },
  stars: {
    display: 'flex',
    gap: '4px'
  },
  star: {
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: '18px'
  },
  alert: {
    padding: '16px',
    borderRadius: '8px',
    margin: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  alertError: {
    background: '#fed7d7',
    color: '#742a2a',
    border: '1px solid #feb2b2'
  },
  alertWarning: {
    background: '#fefcbf',
    color: '#744210',
    border: '1px solid #f6e05e'
  }
};

// Helper functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF'
  }).format(price);
};

const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      style={{
        ...styles.star,
        color: i < rating ? '#fbbf24' : '#d1d5db',
        cursor: interactive ? 'pointer' : 'default'
      }}
      onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
    >
      ★
    </span>
  ));
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [activeTab, setActiveTab] = useState('write');
  const [showVideo, setShowVideo] = useState(false);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    customerName: '',
    customerEmail: '',
    rating: 5,
    comment: ''
  });
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setMainImage(data.images[0] || '/images/placeholder.jpg');
        setLoading(false);
        
        // Fetch related products
        const relatedRes = await axios.get(`/api/products?category=${data.category}&limit=4`);
        setRelatedProducts(relatedRes.data.products.filter((p: Product) => p._id !== data._id));
        
        // Fetch reviews
        const reviewsRes = await axios.get(`/api/reviews/product/${id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleImageClick = (image: string) => {
    setMainImage(image);
    setShowVideo(false);
  };
  
  const handleVideoClick = () => {
    setShowVideo(true);
  };
  
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm((prev: ReviewForm) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        productId: id,
        username: reviewForm.customerName,
        rating: reviewRating,
        comment: reviewForm.comment
      });
      
      setReviewForm({ customerName: '', customerEmail: '', rating: 5, comment: '' });
      setReviewRating(5);
      alert('Review submitted successfully and pending approval');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again later.');
    }
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };
  
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{...styles.alert, ...styles.alertError}}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.container}>
        <div style={{...styles.alert, ...styles.alertWarning}}>
          ⚠️ Product not found
        </div>
      </div>
    );
  }

  const whatsappNumber = process.env.REACT_APP_BUSINESS_WHATSAPP_NUMBER || '237678830036';

  const handleWhatsAppOrder = () => {
    const message = product.inStock 
      ? `Hello! I'm interested in ordering:%0A%0AProduct: ${product.nameEn}%0APrice: ${formatPrice(product.price)}%0ALink: ${window.location.href}%0A%0APlease confirm availability and delivery details.`
      : `Hi! I would like to know when ${product.nameEn} will be back in stock.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => window.history.back()}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
      >
        ← Back to Products
      </button>
      
      <div style={styles.productGrid}>
        {/* Product Images & Video */}
        <div style={styles.imageCard}>
          {showVideo && product.videoUrl ? (
            <video 
              controls 
              style={styles.mainImage}
              autoPlay
            >
              <source src={product.videoUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          ) : (
            <img 
              src={product.images[currentImageIndex] || '/images/placeholder.jpg'} 
              alt={product.nameEn}
              style={styles.mainImage}
            />
          )}
          
          <div style={styles.thumbnails}>
            {/* Video thumbnail */}
            {product.videoUrl && (
              <div 
                style={{
                  ...styles.thumbnail,
                  ...(showVideo ? styles.thumbnailActive : {}),
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
                onClick={handleVideoClick}
                onMouseEnter={(e) => {
                  if (!showVideo) {
                    e.currentTarget.style.borderColor = '#63b3ed';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showVideo) {
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                ▶️
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 4px',
                  borderRadius: '2px'
                }}>VIDEO</div>
              </div>
            )}
            
            {/* Image thumbnails */}
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`${product.nameEn} - ${index + 1}`}
                style={{
                  ...styles.thumbnail,
                  ...(currentImageIndex === index && !showVideo ? styles.thumbnailActive : {})
                }}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setShowVideo(false);
                }}
                onMouseEnter={(e) => {
                  if (currentImageIndex !== index || showVideo) {
                    e.currentTarget.style.borderColor = '#63b3ed';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentImageIndex !== index || showVideo) {
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div style={styles.productInfo}>
          <h1 style={styles.title}>{product.nameEn}</h1>
          
          <div style={styles.priceSection}>
            <span style={styles.price}>{formatPrice(product.price)}</span>
            <span style={{
              ...styles.badge,
              ...(product.inStock ? styles.inStockBadge : styles.outOfStockBadge)
            }}>
              {product.inStock ? (
                `✓ In Stock${product.stockQuantity && product.stockQuantity < 10 && product.stockQuantity > 0 ? ` (${product.stockQuantity} left)` : ''}`
              ) : (
                '✗ Out of Stock'
              )}
            </span>
          </div>
          
          {/* Order Section - Moved up for better UX */}
          <div style={styles.orderCard}>
            {product.inStock ? (
              <button
                style={styles.whatsappButton}
                onClick={handleWhatsAppOrder}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#128C7E';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#25D366';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
💬 Order via WhatsApp
              </button>
            ) : (
              <div>
                <div style={{...styles.alert, ...styles.alertWarning, marginBottom: '16px'}}>
                  ⚠️ This product is currently out of stock
                </div>
                <button
                  style={{...styles.whatsappButton, fontSize: '16px', padding: '12px 24px'}}
                  onClick={handleWhatsAppOrder}
                >
💬 Ask about availability
                </button>
              </div>
            )}
          </div>
          
          {product.sku && (
            <p style={{ color: '#718096', fontSize: '14px' }}>SKU: {product.sku}</p>
          )}
          
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#4a5568' }}>Description</h3>
            <p style={styles.description}>
              {product.descriptionEn || 'No description available.'}
            </p>
          </div>
          
          {/* Social Share */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#4a5568' }}>Share this product:</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                style={{ padding: '8px 16px', background: '#1877f2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                📘 Facebook
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.nameEn)}`, '_blank')}
                style={{ padding: '8px 16px', background: '#1da1f2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(product.nameEn + ' - ' + window.location.href)}`, '_blank')}
                style={{ padding: '8px 16px', background: '#25d366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
          

        </div>
      </div>
      
      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#4a5568' }}>Customer Reviews</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'write' ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('write')}
          >
            Write a Review
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'reviews' ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>
        
        {activeTab === 'write' && (
          <form onSubmit={handleReviewSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Name *</label>
                <input 
                  type="text"
                  value={reviewForm.customerName}
                  onChange={(e) => setReviewForm({...reviewForm, customerName: e.target.value})}
                  placeholder="Enter your name"
                  style={styles.input}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email (Optional)</label>
                <input 
                  type="email"
                  value={reviewForm.customerEmail || ''}
                  onChange={(e) => setReviewForm({...reviewForm, customerEmail: e.target.value})}
                  placeholder="Enter your email"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Rating</label>
              <div style={styles.stars}>
                {renderStars(reviewRating, true, setReviewRating)}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Your Review</label>
              <textarea 
                value={reviewForm.comment || ''}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                placeholder="Share your experience with this product..."
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <button 
              type="submit"
              style={styles.submitButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2c5aa0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3182ce';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Submit Review
            </button>
          </form>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{review.username}</div>
                      <div style={styles.stars}>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#718096' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.comment && <p style={{ margin: 0, color: '#4a5568' }}>{review.comment}</p>}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#4a5568' }}>Related Products</h2>
          <div style={styles.relatedGrid}>
            {relatedProducts.map(relatedProduct => (
              <div 
                key={relatedProduct._id}
                style={styles.relatedCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <Link to={`/products/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.thumbnailImage || relatedProduct.images[0] || '/images/placeholder.jpg'}
                    alt={relatedProduct.nameEn}
                    style={styles.relatedImage}
                  />
                </Link>
                <div style={styles.relatedContent}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#3182ce' }}>
                    <Link to={`/products/${relatedProduct._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {relatedProduct.nameEn}
                    </Link>
                  </h4>
                  <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#38a169', fontSize: '1.1rem' }}>
                    {formatPrice(relatedProduct.price)}
                  </p>
                  <button 
                    style={{
                      ...styles.submitButton,
                      width: '100%',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                    onClick={() => window.location.href = `/products/${relatedProduct._id}`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;