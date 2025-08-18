import React from 'react';
import './CategoryStyles.css';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types';
import { getCategoryBackground } from '../products/CategoryColors';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  // Category icon mapping
  const getCategoryIcon = (categoryId: string): string => {
    const iconMap: {[key: string]: string} = {
      'Electronics': 'fa-mobile-alt',
      'Clothing': 'fa-tshirt',
      'Home & Kitchen': 'fa-home',
      'Beauty & Personal Care': 'fa-user',
      'Sports & Outdoors': 'fa-gamepad',
      'Automotive': 'fa-car',
      'Books & Media': 'fa-book',
      'Toys & Games': 'fa-puzzle-piece',
      'Health & Wellness': 'fa-heartbeat',
      'Groceries & Food': 'fa-utensils'
    };
    
    return iconMap[categoryId] || 'fa-mobile-alt';
  };

  return (
    <Row>
      {categories.map((category, index) => (
        <Col key={category._id} lg={2} md={4} sm={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={`/products?category=${category._id}`} className="text-decoration-none">
              <motion.div 
                className="category-card text-center p-4 rounded shadow-sm h-100"
                style={{ 
                  background: getCategoryBackground(category._id),
                  color: 'white'
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
              >
                <i className={`fas ${getCategoryIcon(category._id)} fa-3x mb-3`}></i>
                <h6>{category._id}</h6>
                <span className="badge bg-light text-dark">{category.count} Products</span>
              </motion.div>
            </Link>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryGrid;