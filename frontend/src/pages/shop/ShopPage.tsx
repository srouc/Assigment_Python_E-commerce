import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, SlidersHorizontal, RefreshCcw, X, Tag, Sparkles } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';

const FASHION_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '38R', '40R', '42R', '44R'];
const FASHION_COLORS = [
  { name: 'Black', hex: '#0F172A' },
  { name: 'Navy', hex: '#1E293B' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Emerald', hex: '#065F46' },
  { name: 'Burgundy', hex: '#881337' },
  { name: 'Grey', hex: '#71717A' },
  { name: 'Ivory', hex: '#FDFBF7' },
];

export const ShopPage: React.FC = () => {
  const router = useRouter();
  const { category: queryCategory, search: querySearch } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>((queryCategory as string) || '');
  const [searchTerm, setSearchTerm] = useState<string>((querySearch as string) || '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    if (queryCategory) setSelectedCategory(queryCategory as string);
    if (querySearch) setSearchTerm(querySearch as string);
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
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          sort: sortBy as any,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        });
        const filtered = inStockOnly ? data.filter((p) => p.is_in_stock) : data;
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching fashion catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, selectedSize, selectedColor, sortBy, minPrice, maxPrice, inStockOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSelectedSize('');
    setSelectedColor('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    router.push('/shop', undefined, { shallow: true });
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchTerm) ||
    Boolean(selectedSize) ||
    Boolean(selectedColor) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    inStockOnly;

  return (
    <MainLayout title="Fashion & Clothing Catalog — ShopEase">
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Catalog Header Banner */}
          <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Curated Runway & Everyday Essentials
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Fashion Collection
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Timeless coats, luxury knitwear, Japanese denim, tailored blazers, and handcrafted leather footwear.
              </p>
            </div>

            {/* Live Search bar */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search styles, fabric, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-2xl text-xs outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Main Content Layout: Sidebar Filters + Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Filter Sidebar (3 cols) */}
            <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      !selectedCategory
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Collections</span>
                    <span className="text-[10px] text-slate-400">8</span>
                  </button>
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.products_count || ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Size
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FASHION_SIZES.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(isSelected ? '' : sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {FASHION_COLORS.map((col) => {
                    const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase();
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(isSelected ? '' : col.name)}
                        title={col.name}
                        className={`w-7 h-7 rounded-full transition-all border ${
                          isSelected
                            ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110'
                            : 'hover:scale-105 border-slate-300'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Price ($ USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* In-stock Only */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>In-Stock Ready to Ship</span>
                </label>
              </div>
            </aside>

            {/* Right Product Grid Area (9 cols) */}
            <main className="lg:col-span-9 space-y-6">
              {/* Top Sort & Count Bar */}
              <div className="bg-white rounded-2xl px-6 py-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-600">
                  Showing <strong className="text-slate-900">{products.length}</strong> styles available
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Products Matrix */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 space-y-4">
                  <p className="text-sm font-bold text-slate-800">No fashion items match your filter criteria.</p>
                  <p className="text-xs text-slate-400">Try adjusting your category, size, or price filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default ShopPage;
