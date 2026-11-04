import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Filter, SlidersHorizontal, RefreshCcw, X, Tag } from 'lucide-react';
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

  const setPriceRange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const hasActiveFilters = Boolean(selectedCategory || searchTerm || minPrice || maxPrice);

  return (
    <MainLayout
      title="Shop All Products | ShopEase"
      description="Browse our wide selection of electronics, apparel, homeware, and wellness products."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title & Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Store</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified items across multiple curated categories with real-time stock updates.
          </p>
        </div>

        {/* Filter & Control Bar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search products by title, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting & Reset */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shadow-sm"
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === ''
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({cat.products_count})
              </button>
            ))}
          </div>

          {/* Quick Price Range Presets */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 overflow-x-auto custom-scrollbar">
            <span className="font-semibold text-slate-400 text-[11px] whitespace-nowrap">Price Range:</span>
            <button
              onClick={() => setPriceRange('', '')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap ${
                !minPrice && !maxPrice ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Any Price
            </button>
            <button
              onClick={() => setPriceRange('0', '50')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap ${
                minPrice === '0' && maxPrice === '50' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Under $50
            </button>
            <button
              onClick={() => setPriceRange('50', '150')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap ${
                minPrice === '50' && maxPrice === '150' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              $50 - $150
            </button>
            <button
              onClick={() => setPriceRange('150', '')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap ${
                minPrice === '150' && !maxPrice ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              Over $150
            </button>
          </div>
        </div>

        {/* Results Bar */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{products.length}</strong> items found</span>
          {selectedCategory && (
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Category: {selectedCategory}
            </span>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-3xl border border-slate-200 space-y-4">
                <div className="bg-slate-200 aspect-square rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center my-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No products matched your criteria</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any items matching your selected filters. Try broadening your search or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
            >
              Reset All Filters
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
