import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.home': 'Home',
    'header.products': 'Products',
    'header.about': 'About',
    'header.contact': 'Contact',
    
    // Home page
    'home.hero.title': 'Discover Amazing Products in Cameroon',
    'home.hero.subtitle': 'Shop authentic electronics, fashion, and more with guaranteed quality and fast delivery across Cameroon.',
    'home.hero.shopNow': 'Shop Now',
    'home.hero.whatsapp': 'WhatsApp',
    'home.categories.title': 'Explore Categories',
    'home.categories.subtitle': 'Discover products tailored to your needs',
    'home.categories.browse': 'Browse Categories',
    'home.categories.items': 'items',
    'home.categories.viewAll': 'View All Categories',
    'home.featured.title': 'Featured Products',
    'home.featured.subtitle': 'Handpicked items just for you',
    'home.featured.viewAll': 'View All',
    'home.features.title': 'Why Choose Us',
    'home.features.subtitle': 'Your satisfaction is our priority',
    'home.features.authentic': '100% Authentic',
    'home.features.authenticDesc': 'Original products with quality guarantee',
    'home.features.delivery': 'Fast Delivery',
    'home.features.deliveryDesc': 'Quick delivery across Cameroon',
    'home.features.payment': 'Secure Payment',
    'home.features.paymentDesc': 'Pay after verification',
    'home.features.support': '24/7 Support',
    'home.features.supportDesc': 'Round-the-clock assistance',
    'home.cta.title': 'Ready to Start Shopping?',
    'home.cta.subtitle': 'Join thousands of satisfied customers across Cameroon',
    'home.cta.explore': 'Explore Products',
    
    // Product card
    'product.view': 'View',
    'product.addToCart': 'Add to Cart',
    'product.viewDetails': 'View Details',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.clear': 'Clear Cart',
    'cart.orderWhatsApp': 'Order via WhatsApp',
    'cart.close': 'Close',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
  },
  fr: {
    // Header
    'header.home': 'Accueil',
    'header.products': 'Produits',
    'header.about': 'À propos',
    'header.contact': 'Contact',
    
    // Home page
    'home.hero.title': 'Découvrez des Produits Incroyables au Cameroun',
    'home.hero.subtitle': 'Achetez des produits électroniques authentiques, de la mode et plus encore avec une qualité garantie et une livraison rapide à travers le Cameroun.',
    'home.hero.shopNow': 'Acheter Maintenant',
    'home.hero.whatsapp': 'WhatsApp',
    'home.categories.title': 'Explorer les Catégories',
    'home.categories.subtitle': 'Découvrez des produits adaptés à vos besoins',
    'home.categories.browse': 'Parcourir les Catégories',
    'home.categories.items': 'articles',
    'home.categories.viewAll': 'Voir Toutes les Catégories',
    'home.featured.title': 'Produits en Vedette',
    'home.featured.subtitle': 'Articles sélectionnés spécialement pour vous',
    'home.featured.viewAll': 'Voir Tout',
    'home.features.title': 'Pourquoi Nous Choisir',
    'home.features.subtitle': 'Votre satisfaction est notre priorité',
    'home.features.authentic': '100% Authentique',
    'home.features.authenticDesc': 'Produits originaux avec garantie de qualité',
    'home.features.delivery': 'Livraison Rapide',
    'home.features.deliveryDesc': 'Livraison rapide à travers le Cameroun',
    'home.features.payment': 'Paiement Sécurisé',
    'home.features.paymentDesc': 'Payez après vérification',
    'home.features.support': 'Support 24/7',
    'home.features.supportDesc': 'Assistance 24h/24',
    'home.cta.title': 'Prêt à Commencer vos Achats?',
    'home.cta.subtitle': 'Rejoignez des milliers de clients satisfaits à travers le Cameroun',
    'home.cta.explore': 'Explorer les Produits',
    
    // Product card
    'product.view': 'Voir',
    'product.addToCart': 'Ajouter au Panier',
    'product.viewDetails': 'Voir les Détails',
    
    // Cart
    'cart.title': 'Panier d\'Achat',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.clear': 'Vider le Panier',
    'cart.orderWhatsApp': 'Commander via WhatsApp',
    'cart.close': 'Fermer',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};