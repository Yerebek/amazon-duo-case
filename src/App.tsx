import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Search, X, CheckCircle2 } from 'lucide-react';
import {
  PRODUCTS,
  ALL_BRANDS,
  RELATED_SEARCHES,
} from './data/products';
import {
  Product,
  CartItem,
  FilterState,
  SortOption,
  DeliveryLocation,
  OrderRecord,
} from './types/product';
import { AmazonHeader } from './components/AmazonHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { SponsoredBrandBanner } from './components/SponsoredBrandBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { OrdersModal } from './components/OrdersModal';
import { AmazonFooter } from './components/AmazonFooter';

const ITEMS_PER_PAGE = 12;

const DEFAULT_FILTERS: FilterState = {
  query: 'iphone duo case',
  department: 'All Departments',
  deliveryTomorrowOnly: false,
  primeOnly: false,
  minRating: 0,
  brands: [],
  priceRange: [null, null],
  models: [],
  features: [],
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNavPreset, setActiveNavPreset] = useState('all');
  const [dealsOnly, setDealsOnly] = useState(false);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    color?: string;
  } | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [location, setLocation] = useState<DeliveryLocation>({
    country: 'Singapore',
    city: 'Singapore',
    postalCode: '018956',
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [oneClickNotice, setOneClickNotice] = useState<{
    orderId: string;
    title: string;
    total: number;
  } | null>(null);

  const handleSearchSubmit = (newQuery: string, newDepartment: string) => {
    setFilters((prev) => ({
      ...prev,
      query: newQuery,
      department: newDepartment,
    }));
    setCurrentPage(1);
  };

  const handleQuickFilter = (
    preset: 'all' | 'prime' | 'deals' | 'bestsellers' | 'electronics' | 'accessories'
  ) => {
    setActiveNavPreset(preset);
    setCurrentPage(1);
    if (preset === 'all') {
      setDealsOnly(false);
      setBestsellersOnly(false);
      setFilters({ ...DEFAULT_FILTERS, query: filters.query });
    } else if (preset === 'prime') {
      setDealsOnly(false);
      setBestsellersOnly(false);
      setFilters((prev) => ({ ...prev, primeOnly: true, department: 'All Departments' }));
    } else if (preset === 'deals') {
      setDealsOnly(true);
      setBestsellersOnly(false);
      setFilters((prev) => ({ ...prev, department: 'All Departments' }));
    } else if (preset === 'bestsellers') {
      setDealsOnly(false);
      setBestsellersOnly(true);
      setFilters((prev) => ({ ...prev, department: 'All Departments' }));
    } else if (preset === 'electronics') {
      setDealsOnly(false);
      setBestsellersOnly(false);
      setFilters((prev) => ({ ...prev, department: 'Electronics' }));
    } else if (preset === 'accessories') {
      setDealsOnly(false);
      setBestsellersOnly(false);
      setFilters((prev) => ({ ...prev, department: 'Mobile Accessories' }));
    }
  };

  const resetAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, query: 'iphone duo case' });
    setDealsOnly(false);
    setBestsellersOnly(false);
    setActiveNavPreset('all');
    setCurrentPage(1);
  };

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    const tokens = filters.query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t && t !== 'iphone' && t !== 'case' && t !== 'duo');

    const matches = PRODUCTS.filter((p) => {
      if (
        filters.department !== 'All Departments' &&
        p.category !== filters.department
      ) {
        return false;
      }
      if (filters.deliveryTomorrowOnly && !p.deliveryTomorrow) return false;
      if (filters.primeOnly && !p.isPrime) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      const [minP, maxP] = filters.priceRange;
      if (minP !== null && p.price < minP) return false;
      if (maxP !== null && p.price > maxP) return false;

      if (
        filters.models.length > 0 &&
        !filters.models.some((m) => p.compatibleModels.includes(m))
      ) {
        return false;
      }

      if (
        filters.features.length > 0 &&
        !filters.features.every((f) => p.features.includes(f))
      ) {
        return false;
      }

      if (dealsOnly && !p.listPrice && p.badge !== 'Limited time deal') {
        return false;
      }
      if (bestsellersOnly && p.badge !== 'Best Seller' && p.reviewCount < 2000) {
        return false;
      }

      if (tokens.length > 0) {
        const haystack = `${p.title} ${p.brand} ${p.features.join(' ')} ${p.compatibleModels.join(' ')}`.toLowerCase();
        if (!tokens.every((tok) => haystack.includes(tok))) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...matches];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.releaseOrder - a.releaseOrder);
    }
    return sorted;
  }, [filters, sortBy, dealsOnly, bestsellersOnly]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_BRANDS.forEach((b) => {
      counts[b] = PRODUCTS.filter((p) => p.brand === b).length;
    });
    return counts;
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const addToCart = (
    product: Product,
    colorName: string,
    model = product.compatibleModels[0] || 'iPhone 16 Pro Max',
    qty = 1
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === colorName &&
          item.selectedModel === model
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [...prev, { product, selectedColor: colorName, selectedModel: model, quantity: qty }];
    });
  };

  const handleBuyNow = (
    product: Product,
    colorName: string,
    model: string,
    qty: number
  ) => {
    addToCart(product, colorName, model, qty);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleOneClickBuy = (
    product: Product,
    colorName: string,
    model = product.compatibleModels[0] || 'iPhone 16 Pro Max',
    qty = 1
  ) => {
    const orderId = `402-${Math.floor(1000000 + Math.random() * 8999999)}-${Math.floor(
      1000000 + Math.random() * 8999999
    )}`;
    const total = product.price * qty;
    const newOrder: OrderRecord = {
      orderId,
      date: '18 Nov 2026',
      total,
      status: `${product.deliveryText} · 1-Click Order Confirmed`,
      deliveryAddress: `${location.city} ${location.postalCode}`,
      items: [{ product, selectedColor: colorName, selectedModel: model, quantity: qty }],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOneClickNotice({ orderId, title: product.title, total });
    window.setTimeout(() => {
      setOneClickNotice((curr) => (curr?.orderId === orderId ? null : curr));
    }, 5000);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = { ...next[index], quantity: newQty };
      }
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckout = (orderTotal: number) => {
    const orderId = `402-${Math.floor(1000000 + Math.random() * 8999999)}-${Math.floor(
      1000000 + Math.random() * 8999999
    )}`;
    const newOrder: OrderRecord = {
      orderId,
      date: '18 Nov 2026',
      total: orderTotal,
      status: 'Arriving Tomorrow, 19 Nov · Preparing for dispatch in Singapore',
      deliveryAddress: `${location.city} ${location.postalCode}`,
      items: [...cart],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return orderId;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active filter chips for clear overview
  const activeFilterLabels: Array<{ label: string; clear: () => void }> = [];
  if (filters.deliveryTomorrowOnly) {
    activeFilterLabels.push({
      label: 'Get It by Tomorrow',
      clear: () => setFilters((f) => ({ ...f, deliveryTomorrowOnly: false })),
    });
  }
  if (filters.primeOnly) {
    activeFilterLabels.push({
      label: 'Prime',
      clear: () => setFilters((f) => ({ ...f, primeOnly: false })),
    });
  }
  if (filters.minRating > 0) {
    activeFilterLabels.push({
      label: `${filters.minRating} Stars & Up`,
      clear: () => setFilters((f) => ({ ...f, minRating: 0 })),
    });
  }
  filters.brands.forEach((b) =>
    activeFilterLabels.push({
      label: b,
      clear: () =>
        setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
    })
  );
  filters.models.forEach((m) =>
    activeFilterLabels.push({
      label: m,
      clear: () =>
        setFilters((f) => ({ ...f, models: f.models.filter((x) => x !== m) })),
    })
  );
  filters.features.forEach((feat) =>
    activeFilterLabels.push({
      label: feat,
      clear: () =>
        setFilters((f) => ({
          ...f,
          features: f.features.filter((x) => x !== feat),
        })),
    })
  );
  if (filters.priceRange[0] !== null || filters.priceRange[1] !== null) {
    const minTxt = filters.priceRange[0] !== null ? `S$${filters.priceRange[0]}` : 'S$0';
    const maxTxt = filters.priceRange[1] !== null ? `S$${filters.priceRange[1]}` : '+';
    activeFilterLabels.push({
      label: `Price: ${minTxt}–${maxTxt}`,
      clear: () => setFilters((f) => ({ ...f, priceRange: [null, null] })),
    });
  }

  const startIdx = filteredProducts.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(safePage * ITEMS_PER_PAGE, filteredProducts.length);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F1111]">
      <AmazonHeader
        query={filters.query}
        department={filters.department}
        cartCount={totalCartItems}
        location={location}
        ordersCount={orders.length}
        onSearchSubmit={handleSearchSubmit}
        onOpenCart={() => setCartOpen(true)}
        onOpenLocation={() => setLocationModalOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        onQuickFilter={handleQuickFilter}
        activeNavPreset={activeNavPreset}
      />

      {/* Search Summary & Sort Bar */}
      <div className="border-b border-[#DDDDDD] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[13px] text-[#0F1111]">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D5D9D9] rounded-[6px] bg-[#F0F2F2] text-[12px] font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <p className="tabular-nums">
              {filteredProducts.length > 0 ? (
                <>
                  <span>
                    {startIdx}-{endIdx} of {filteredProducts.length} results for{' '}
                  </span>
                  <span className="font-bold text-[#C45500]">
                    &ldquo;{filters.query}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  <span>0 results for </span>
                  <span className="font-bold text-[#C45500]">
                    &ldquo;{filters.query}&rdquo;
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-[12px] text-[#565959]">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="text-[12px] font-medium bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-[7px] px-2.5 py-1 text-[#0F1111] shadow-xs cursor-pointer focus:outline-none focus:border-[#007185]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 sm:px-5 py-4 flex items-start gap-5">
        <FilterSidebar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setCurrentPage(1);
          }}
          onReset={resetAllFilters}
          brandCounts={brandCounts}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        {/* Right Results Column */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Refinements Row */}
          {activeFilterLabels.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-[#EEEEEE]">
              <span className="text-[12px] font-semibold text-[#565959]">
                Active filters:
              </span>
              {activeFilterLabels.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.clear}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-[4px] text-[#0F1111] cursor-pointer"
                >
                  <span>{item.label}</span>
                  <X className="w-3 h-3 text-[#565959]" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[12px] text-[#007185] hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Featured Top Collection Strip (shown on Page 1 when unfiltered or default query) */}
          {safePage === 1 && filteredProducts.length >= 3 && (
            <SponsoredBrandBanner
              featuredProducts={PRODUCTS.slice(0, 3)}
              onSelectProduct={(p) => setSelectedProduct({ product: p })}
              onFilterBrand={(brand) => {
                setFilters((f) => ({ ...f, brands: [brand] }));
                setCurrentPage(1);
              }}
            />
          )}

          {/* Results Heading */}
          <div className="mb-3">
            <h1 className="text-[20px] font-bold text-[#0F1111] leading-tight">
              Results
            </h1>
            <p className="text-[13px] text-[#565959]">
              Check each product page for other buying options. Price and other details may vary based on product size and colour.
            </p>
          </div>

          {/* Product Grid or Empty State */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p, activeColor) =>
                    setSelectedProduct({ product: p, color: activeColor })
                  }
                  onAddToCart={(p, colorName) =>
                    addToCart(p, colorName, p.compatibleModels[0] || 'iPhone 16 Pro Max', 1)
                  }
                  onOneClickBuy={(p, colorName) =>
                    handleOneClickBuy(p, colorName, p.compatibleModels[0] || 'iPhone 16 Pro Max', 1)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="border border-[#D5D9D9] rounded-[6px] p-10 text-center bg-[#FAFAFA] my-4">
              <h2 className="text-[18px] font-bold text-[#0F1111] mb-1.5">
                No matching iPhone duo cases found
              </h2>
              <p className="text-[13px] text-[#565959] mb-4">
                Try clearing some filters or broadening your search term.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[13px] font-medium text-[#0F1111] cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <nav
              aria-label="Search results pages"
              className="mt-8 mb-6 flex justify-center"
            >
              <div className="inline-flex items-center border border-[#D5D9D9] rounded-[8px] overflow-hidden shadow-xs bg-white text-[14px]">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 border-r border-[#D5D9D9] disabled:text-[#888C8C] disabled:cursor-not-allowed hover:bg-[#F7FAFA] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 border-r border-[#D5D9D9] tabular-nums cursor-pointer ${
                      pageNum === safePage
                        ? 'font-bold bg-[#F0F2F2] border-b-2 border-b-[#007185] text-[#0F1111]'
                        : 'hover:bg-[#F7FAFA] text-[#0F1111]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 disabled:text-[#888C8C] disabled:cursor-not-allowed hover:bg-[#F7FAFA] cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </nav>
          )}

          {/* Related Searches */}
          <section
            aria-label="Related searches"
            className="mt-8 pt-6 border-t border-[#E7E7E7]"
          >
            <h2 className="text-[18px] font-bold text-[#0F1111] mb-3">
              Related searches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {RELATED_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    handleSearchSubmit(term, 'All Departments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[#D5D9D9] rounded-[6px] bg-white hover:bg-[#F7FAFA] text-left text-[13px] font-medium text-[#007185] hover:text-[#C7511F] cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4 text-[#565959] shrink-0" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <AmazonFooter
        onSelectSearch={(q) => {
          handleSearchSubmit(q, 'All Departments');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct?.product ?? null}
        initialColor={selectedProduct?.color}
        location={location}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, color, model, qty) => addToCart(p, color, model, qty)}
        onOneClickBuy={(p, color, model, qty) => handleOneClickBuy(p, color, model, qty)}
        onBuyNow={handleBuyNow}
      />

      {oneClickNotice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 max-w-[360px] bg-white border border-[#067D62] rounded-[8px] shadow-xl p-4 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[#067D62] mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1 text-[13px]">
            <p className="font-bold text-[#067D62]">
              1-Click Order Confirmed #{oneClickNotice.orderId.slice(0, 11)}
            </p>
            <p className="text-[#0F1111] line-clamp-1 mt-0.5">{oneClickNotice.title}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold tabular-nums text-[#0F1111]">
                Total: S${oneClickNotice.total.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOneClickNotice(null);
                  setOrdersModalOpen(true);
                }}
                className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium cursor-pointer"
              >
                View Orders
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOneClickNotice(null)}
            aria-label="Dismiss notification"
            className="text-[#565959] hover:text-[#0F1111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        items={cart}
        location={location}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      <LocationModal
        open={locationModalOpen}
        location={location}
        onClose={() => setLocationModalOpen(false)}
        onSave={setLocation}
      />

      <OrdersModal
        open={ordersModalOpen}
        orders={orders}
        onClose={() => setOrdersModalOpen(false)}
      />
    </div>
  );
}
