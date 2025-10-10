import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faQuestionCircle, faShoppingCart, faShippingFast, faCreditCard, faShieldAlt, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ModernFAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => [
    { id: 'all', label: 'All Questions', icon: faQuestionCircle, color: 'primary' },
    { id: 'orders', label: 'Orders', icon: faShoppingCart, color: 'success' },
    { id: 'shipping', label: 'Shipping', icon: faShippingFast, color: 'warning' },
    { id: 'payment', label: 'Payment', icon: faCreditCard, color: 'info' },
    { id: 'security', label: 'Security', icon: faShieldAlt, color: 'danger' },
    { id: 'support', label: 'Support', icon: faHeadset, color: 'secondary' },
  ], []);

  const faqs = useMemo(() => [
    {
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can also order directly via WhatsApp by clicking the WhatsApp button on any product.',
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 30 minutes of placing it. After that, please contact our customer support team for assistance.',
    },
    
    {
      category: 'shipping',
      question: 'What are your delivery areas?',
      answer: 'We deliver to all major cities in Cameroon including Douala, Yaoundé, Bafoussam, Bamenda, and Garoua. We are constantly expanding our delivery network.',
    },
    {
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 1-3 business days within major cities and 3-7 business days for other areas. Express delivery options are available for urgent orders.',
    },
   
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MTN, Orange), bank transfers, cash on delivery, and major credit/debit cards. All payments are processed securely.',
    },
    {
      category: 'payment',
      question: 'Is it safe to pay online?',
      answer: 'No, payment are done after verification of the product.',
    },
    {
      category: 'payment',
      question: 'Can I pay on delivery?',
      answer: 'Yes, we offer cash on delivery for most areas. However, some high-value items may require advance payment for security reasons.',
    },
    {
      category: 'security',
      question: 'How do you protect my personal information?',
      answer: 'We use advanced encryption and security protocols to protect your data. We never share your personal information with third parties without your consent.',
    },
    {
      category: 'security',
      question: 'What if I receive a damaged product?',
      answer: 'If you receive a damaged product, contact us immediately with photos. We will arrange for a replacement or full refund within 24 hours.',
    },
    {
      category: 'support',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support via WhatsApp, email, or phone. Our support team is available 24/7 to assist you with any questions or concerns.',
    },
    {
      category: 'support',
      question: 'Do you have a return policy?',
      answer: 'Yes, we offer a 7-day return policy for most products. Items must be in original condition with packaging. Some restrictions apply for certain product categories.',
    },
  ], []);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3">Frequently Asked Questions</h1>
            <p className="lead">Find answers to common questions about our services, orders, and policies.</p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search and Categories */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <InputGroup size="lg">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </motion.div>
          </Col>
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h6 className="fw-bold mb-3">Categories</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? category.color : `outline-${category.color}`}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="d-flex align-items-center gap-1"
                  >
                    <FontAwesomeIcon icon={category.icon} />
                    <span className="d-none d-sm-inline">{category.label}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* FAQ List */}
        <Row className="g-4">
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {filteredFAQs.length > 0 ? (
                <Accordion>
                  {filteredFAQs.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        <strong>{faq.question}</strong>
                      </Accordion.Header>
                      <Accordion.Body>
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Card className="text-center p-5">
                  <Card.Body>
                    <FontAwesomeIcon icon={faQuestionCircle} size="3x" className="text-muted mb-3" />
                    <h5 className="text-muted">No questions found</h5>
                    <p className="text-muted">Try adjusting your search terms or category filter.</p>
                  </Card.Body>
                </Card>
              )}
            </motion.div>
          </Col>

          {/* Help Card */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FontAwesomeIcon icon={faHeadset} size="lg" />
                  </div>
                  <h5 className="fw-bold mb-3">Still Need Help?</h5>
                  <p className="text-muted mb-4">Can't find what you're looking for? Our support team is here to help!</p>
                  
                  <div className="text-start mb-3">
                    <h6 className="fw-bold mb-2">Contact Options:</h6>
                    <p className="small text-muted mb-1">📱 WhatsApp: +237 678 830 036</p>
                    <p className="small text-muted mb-1">📧 Email: emmanuelanjoh2016@gmail.com</p>
                    <p className="small text-muted mb-0">📞 Phone: +237 678 830 036</p>
                  </div>
                  
                  <small className="text-muted">Our support team is available 24/7 to assist you.</small>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernFAQ;