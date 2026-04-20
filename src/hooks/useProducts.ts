import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await productService.getAll();
      // setProducts(response.data);
      setProducts([]);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(
    (query: string, category: string | null, source: Product[]) => {
      let result = [...source];

      if (query.trim().length > 0) {
        const lower = query.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.sku?.toLowerCase().includes(lower) ||
            p.barcode?.toLowerCase().includes(lower)
        );
      }

      if (category !== null) {
        result = result.filter((p) => p.category === category);
      }

      setFilteredProducts(result);
    },
    []
  );

  const searchProducts = useCallback(
    (query: string) => {
      setSearchQuery(query);
      applyFilters(query, selectedCategory, products);
    },
    [products, selectedCategory, applyFilters]
  );

  const filterByCategory = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      applyFilters(searchQuery, category, products);
    },
    [products, searchQuery, applyFilters]
  );

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  // Re-apply filters whenever the base products list changes
  useEffect(() => {
    applyFilters(searchQuery, selectedCategory, products);
  }, [products, searchQuery, selectedCategory, applyFilters]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    filteredProducts,
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
