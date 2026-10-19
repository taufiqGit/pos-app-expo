import { useCallback, useMemo, useState } from 'react';
import { Product } from '../types';
import { fetchMobileProducts } from '../services/productService';
import { Category, fetchCategories } from '../services/categoryService';

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  /** Daftar kategori dari GET /api/categories */
  categories: Category[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim().length > 0) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.subtitle?.toLowerCase().includes(lower) ||
          p.sku?.toLowerCase().includes(lower) ||
          p.barcode?.toLowerCase().includes(lower),
      );
    }

    if (selectedCategory !== null) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, cats] = await Promise.all([
        fetchMobileProducts(),
        fetchCategories().catch(() => [] as Category[]),
      ]);
      setProducts(data);
      setCategories(cats);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filterByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => p.id === id);
    },
    [products],
  );

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    filteredProducts,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    fetchProducts,
    searchProducts,
    filterByCategory,
    getProductById,
    refreshProducts,
  };
};

export default useProducts;
