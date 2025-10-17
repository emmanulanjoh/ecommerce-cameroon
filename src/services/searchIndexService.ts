import ProductModel from '../models/Product';
import { SearchIndex } from '../models/SearchIndex';

export class SearchIndexService {
  static async updateProductIndex(productId: string) {
    try {
      const product = await ProductModel.findById(productId);
      if (!product) return;

      const searchText = [
        product.nameEn,
        product.nameFr,
        product.descriptionEn,
        product.descriptionFr,
        product.category,
        // product.tags?.join(' ')
      ].filter(Boolean).join(' ').toLowerCase();

      await SearchIndex.findOneAndUpdate(
        { productId },
        {
          productId,
          searchText,
          category: product.category,
          price: product.price,
          inStock: product.inStock,
          tags: [],
          lastUpdated: new Date()
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Failed to update search index:', error);
    }
  }

  static async rebuildIndex() {
    try {
      const products = await ProductModel.find({});
      
      for (const product of products) {
        await this.updateProductIndex((product._id as any).toString());
      }
      
      console.log(`Search index rebuilt for ${products.length} products`);
    } catch (error) {
      console.error('Failed to rebuild search index:', error);
    }
  }

  static async deleteFromIndex(productId: string) {
    try {
      await SearchIndex.findOneAndDelete({ productId });
    } catch (error) {
      console.error('Failed to delete from search index:', error);
    }
  }
}