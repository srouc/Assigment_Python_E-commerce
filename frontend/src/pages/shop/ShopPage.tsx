import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';

export const ShopPage: React.FC = () => {
  const router = useRouter();
  const { category: queryCategory, search: querySearch } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>((queryCategory as string) || '');
  const [searchTerm, setSearchTerm] = useState<string>((querySearch as string) || '');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    if (queryCategory) {
      setSelectedCategory(queryCategory as string);
    }
    if (querySearch) {
      setSearchTerm(querySearch as string);
    }
  }, [queryCategory, querySearch]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts({
          category: selectedCategory || undefined,
          search: searchTerm || undefined,
          sort: sortBy as any,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    router.push('/shop', undefined, { shallow: true });
  };

  return (
    <MainLayout
      title="Shop All Products | ShopEase"
      description="Browse our wide selection of electronics, apparel, homeware, and wellness products."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Shop</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through our catalog with dynamic filtering and sorting.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sorting & Reset */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-2 px-3 rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {(selectedCategory || searchTerm || minPrice || maxPrice) && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 custom-scrollbar">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({cat.products_count})
              </button>
            ))}
          </div>
        </div>

        {/* Product Count & Grid */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{products.length}</strong> products</span>
          {selectedCategory && (
            <span className="font-semibold text-indigo-600">Category: {selectedCategory}</span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="bg-slate-200 aspect-square rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-8">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any products matching your current search or category filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ShopPage;

