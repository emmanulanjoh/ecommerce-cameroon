// Define category colors for gradients
export const categoryColors: Record<string, string> = {
  'Electronics': 'linear-gradient(135deg, #3498db, #2980b9)',
  'Clothing': 'linear-gradient(135deg, #e74c3c, #c0392b)',
  'Home & Kitchen': 'linear-gradient(135deg, #27ae60, #2ecc71)',
  'Beauty & Personal Care': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
  'Sports & Outdoors': 'linear-gradient(135deg, #f1c40f, #f39c12)',
  'Automotive': 'linear-gradient(135deg, #34495e, #2c3e50)',
  'Books & Media': 'linear-gradient(135deg, #16a085, #1abc9c)',
  'Toys & Games': 'linear-gradient(135deg, #e67e22, #d35400)',
  'Health & Wellness': 'linear-gradient(135deg, #2ecc71, #27ae60)',
  'Groceries & Food': 'linear-gradient(135deg, #f39c12, #e67e22)',
  'default': 'linear-gradient(135deg, #7f8c8d, #95a5a6)'
};

// Get background gradient for a category
export const getCategoryBackground = (categoryName: string): string => {
  return categoryColors[categoryName] || categoryColors.default;
};