import React, { useState } from 'react';
import './CategoryStyles.css';
import { Dropdown, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../../types';
import { getCategoryBackground } from '../products/CategoryColors';

interface CategoryDropdownProps {
  categories: Category[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="category-dropdown mb-4">
      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle 
          variant="primary" 
          id="dropdown-categories"
          className="w-100 d-flex justify-content-between align-items-center"
          as="div"
        >
          <div 
            className="d-flex justify-content-between align-items-center w-100 py-2 px-3"
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: 'pointer', color: 'white' }}
          >
            <span>Shop by Category</span>
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </div>
        </Dropdown.Toggle>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Dropdown.Menu className="w-100 p-3">
                <Row>
                  {categories.map(category => (
                    <Col xs={6} key={category._id} className="mb-3">
                      <Link 
                        to={`/products?category=${category._id}`} 
                        className="text-decoration-none"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div 
                          className="category-card text-center p-3 rounded h-100"
                          style={{ 
                            background: getCategoryBackground(category._id),
                            color: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className={`fas ${getCategoryIcon(category._id)} fa-2x mb-2`}></i>
                          <h6 className="mb-1">{category._id}</h6>
                          <span className="badge bg-light text-dark">{category.count}</span>
                        </motion.div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Dropdown.Menu>
            </motion.div>
          )}
        </AnimatePresence>
      </Dropdown>
    </div>
  );
};

export default CategoryDropdown;