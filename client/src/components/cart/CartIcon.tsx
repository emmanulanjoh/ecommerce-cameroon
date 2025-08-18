import React from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';

interface CartIconProps {
  onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <div 
      className="position-relative" 
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <FontAwesomeIcon 
        icon={faShoppingCart} 
        size="lg" 
        className="text-white"
      />
      {totalItems > 0 && (
        <Badge 
          bg="danger" 
          pill 
          className="position-absolute top-0 start-100 translate-middle"
          style={{ fontSize: '0.7rem' }}
        >
          {totalItems}
        </Badge>
      )}
    </div>
  );
};

export default CartIcon;