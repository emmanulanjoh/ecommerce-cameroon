import React, { useState } from 'react';
import './CategoryMenu.css';
import { getCategoryBackground } from './CategoryColors';
import { Dropdown, Button, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../../types';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isMobile: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isMobile
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // getCategoryBackground is now imported from CategoryColors.ts

  // Mobile dropdown version
  if (isMobile) {
    return (
      <div className="mb-3">
        <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
          <Dropdown.Toggle 
            variant="light" 
            id="dropdown-categories"
            className="w-100 d-flex justify-content-between align-items-center shadow-sm"
            as="div"
          >
            <div 
              className="d-flex justify-content-between align-items-center w-100 py-2 px-3"
              onClick={() => setIsOpen(!isOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span>
                {selectedCategory || 'All Categories'}
              </span>
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
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item 
                    active={!selectedCategory}
                    onClick={() => {
                      onSelectCategory('');
                      setIsOpen(false);
                    }}
                    className="py-2"
                  >
                    <strong>All Categories</strong>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  
                  {categories.map(category => (
                    <Dropdown.Item 
                      key={category._id}
                      active={selectedCategory === category._id}
                      onClick={() => {
                        onSelectCategory(category._id);
                        setIsOpen(false);
                      }}
                      className="py-2"
                      style={{
                        background: selectedCategory === category._id ? 
                          getCategoryBackground(category._id) : 'transparent',
                        color: selectedCategory === category._id ? '#fff' : 'inherit',
                        borderLeft: selectedCategory === category._id ? 
                          '4px solid #fff' : 'transparent'
                      }}
                    >
                      {category._id} ({category.count})
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </motion.div>
            )}
          </AnimatePresence>
        </Dropdown>
      </div>
    );
  }

  // Desktop version with animated category buttons
  return (
    <div className="category-menu mb-4">
      <h5 className="mb-3">Categories</h5>
      <Row className="g-2">
        <Col xs={12}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              variant={!selectedCategory ? 'primary' : 'light'}
              className="w-100 text-start"
              onClick={() => onSelectCategory('')}
            >
              All Categories
            </Button>
          </motion.div>
        </Col>
        
        {categories.map(category => (
          <Col xs={12} key={category._id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="light"
                className="w-100 text-start d-flex justify-content-between align-items-center"
                style={{
                  background: selectedCategory === category._id ? 
                    getCategoryBackground(category._id) : '#fff',
                  color: selectedCategory === category._id ? '#fff' : 'inherit',
                  border: '1px solid #dee2e6'
                }}
                onClick={() => onSelectCategory(category._id)}
              >
                <span>{category._id}</span>
                <span className="badge bg-light text-dark">{category.count}</span>
              </Button>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryMenu;