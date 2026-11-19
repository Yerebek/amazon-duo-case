import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
  User,
  Package,
} from 'lucide-react';
import { DeliveryLocation } from '../types/product';
import { RELATED_SEARCHES } from '../data/products';

interface AmazonHeaderProps {
  query: string;
  department: string;
  cartCount: number;
  location: DeliveryLocation;
  ordersCount: number;
  onSearchSubmit: (newQuery: string, newDepartment: string) => void;
  onOpenCart: () => void;
  onOpenLocation: () => void;
  onOpenOrders: () => void;
  onOpenMobileFilters: () => void;
  onQuickFilter: (preset: 'all' | 'prime' | 'deals' | 'bestsellers' | 'electronics' | 'accessories') => void;
  activeNavPreset: string;
}

const DEPARTMENTS = [
  'All Departments',
  'Electronics',
  'Mobile Accessories',
];

export const AmazonHeader: React.FC<AmazonHeaderProps> = ({
  query,
  department,
  cartCount,
  location,
  ordersCount,
  onSearchSubmit,
  onOpenCart,
  onOpenLocation,
  onOpenOrders,
  onOpenMobileFilters,
  onQuickFilter,
  activeNavPreset,
}) => {
  const [inputValue, setInputValue] = useState(query);
  const [selectedDept, setSelectedDept] = useState(department);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [signedInUser, setSignedInUser] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    setSelectedDept(department);
  }, [department]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit(inputValue.trim() || 'iphone duo case', selectedDept);
  };

  const filteredSuggestions = [
    'iphone duo case',
    ...RELATED_SEARCHES,
    'spigen ultra hybrid duo',
    'torras ostand duo iphone 16 pro max',
    'otterbox symmetry duo magsafe',
  ].filter(
    (s, idx, arr) =>
      arr.indexOf(s) === idx &&
      (!inputValue.trim() || s.toLowerCase().includes(inputValue.trim().toLowerCase()))
  );

  return (
    <header className="w-full z-40 sticky top-0 shadow-sm">
      {/* Upper Amazon Navy Bar */}
      <div className="bg-[#131921] text-white px-2 sm:px-4 h-[60px] flex items-center gap-2 sm:gap-3">
        {/* Amazon.sg Logo */}
        <button
          type="button"
          onClick={() => {
            setInputValue('iphone duo case');
            setSelectedDept('All Departments');
            onSearchSubmit('iphone duo case', 'All Departments');
            onQuickFilter('all');
          }}
          className="flex items-start px-2 py-1.5 rounded-sm border border-transparent hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] shrink-0 transition-colors"
          aria-label="Amazon.sg Home"
        >
          <div className="flex flex-col items-start">
            <div className="flex items-baseline leading-none">
              <span className="text-[20px] sm:text-[22px] font-extrabold tracking-tight text-white">
                amazon
              </span>
              <span className="text-[13px] font-semibold text-[#FF9900] ml-[1px]">.sg</span>
            </div>
            {/* Signature Smile Arrow */}
            <svg viewBox="0 0 92 14" className="w-[74px] sm:w-[82px] h-[11px] -mt-[1px]" aria-hidden="true">
              <path
                d="M6 3.5C24 11.5 55 11.5 76 3.5"
                fill="none"
                stroke="#FF9900"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M72 2.2L78.5 3.1L75.4 8.8"
                fill="none"
                stroke="#FF9900"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Deliver to Singapore */}
        <button
          type="button"
          onClick={onOpenLocation}
          className="hidden md:flex items-end gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] shrink-0 text-left transition-colors"
        >
          <MapPin className="w-4 h-4 text-white mb-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[11px] text-[#CCCCCC] whitespace-nowrap">Deliver to</div>
            <div className="text-[13px] font-bold text-white whitespace-nowrap tabular-nums">
              {location.city} {location.postalCode}
            </div>
          </div>
        </button>

        {/* Search Bar */}
        <div ref={searchRef} className="flex-1 relative min-w-0">
          <form
            onSubmit={handleSubmit}
            className="flex items-center h-[40px] rounded-[4px] overflow-hidden bg-white focus-within:ring-[3px] focus-within:ring-[#FF9900]"
          >
            {/* Department Select */}
            <div className="hidden sm:flex items-center relative bg-[#E6E6E6] hover:bg-[#D4D4D4] text-[#555555] border-r border-[#CDCDCD] h-full shrink-0 transition-colors">
              <select
                aria-label="Search in department"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  onSearchSubmit(inputValue.trim() || 'iphone duo case', e.target.value);
                }}
                className="appearance-none bg-transparent pl-3 pr-7 h-full text-[12px] font-medium text-[#0F1111] cursor-pointer focus:outline-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All Departments' ? 'All' : dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-2 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 h-full flex items-center min-w-0">
              <input
                type="text"
                aria-label="Search Amazon.sg"
                value={inputValue}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search Amazon.sg"
                className="w-full h-full px-3 text-[14px] text-[#0F1111] placeholder-[#767676] focus:outline-none bg-white"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setShowSuggestions(true);
                  }}
                  aria-label="Clear search query"
                  className="p-1.5 mr-1 text-[#565959] hover:text-[#0F1111]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              aria-label="Go"
              className="h-full px-3.5 bg-[#FEBD69] hover:bg-[#F3A847] text-[#131921] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[42px] bg-white border border-[#D5D9D9] rounded-b-md shadow-lg z-50 py-1 text-[#0F1111]">
              {filteredSuggestions.slice(0, 6).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion);
                    setShowSuggestions(false);
                    onSearchSubmit(suggestion, selectedDept);
                  }}
                  className="w-full text-left px-3.5 py-2 text-[14px] hover:bg-[#F3F3F3] flex items-center gap-2.5 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#888C8C] shrink-0" />
                  <span className="truncate font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language / Country */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2 py-2 rounded-sm border border-transparent hover:border-white shrink-0 select-none"
          title="Singapore · English"
        >
          <span
            className="inline-flex items-center justify-center w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/25 text-[9px] font-bold bg-[#EF3340] text-white"
            aria-hidden="true"
          >
            SG
          </span>
          <span className="text-[13px] font-bold">EN</span>
        </div>

        {/* Account & Lists */}
        <div ref={accountRef} className="relative hidden sm:block shrink-0">
          <button
            type="button"
            onClick={() => setShowAccountMenu((v) => !v)}
            className="flex flex-col items-start px-2 py-1.5 rounded-sm border border-transparent hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] text-left transition-colors cursor-pointer"
          >
            <span className="text-[11px] text-[#CCCCCC] leading-tight whitespace-nowrap">
              {signedInUser ? `Hello, ${signedInUser}` : 'Hello, sign in'}
            </span>
            <span className="text-[13px] font-bold text-white leading-tight flex items-center gap-0.5 whitespace-nowrap">
              Account & Lists
              <ChevronDown className="w-3.5 h-3.5 text-[#CCCCCC]" />
            </span>
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 top-[52px] w-64 bg-white text-[#0F1111] rounded-md shadow-xl border border-[#D5D9D9] p-4 z-50">
              {!signedInUser ? (
                <div className="pb-3 mb-3 border-b border-[#E7E7E7] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSignedInUser('Wei Ming');
                      setShowAccountMenu(false);
                    }}
                    className="w-full py-1.5 px-4 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium text-[#0F1111] cursor-pointer"
                  >
                    Sign in as Demo Shopper
                  </button>
                  <p className="text-[11px] text-[#565959] mt-2">
                    Singapore Prime Member preview
                  </p>
                </div>
              ) : (
                <div className="pb-3 mb-3 border-b border-[#E7E7E7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#007185]" />
                    <span className="text-[13px] font-bold">Wei Ming (Prime SG)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSignedInUser(null)}
                    className="text-[12px] text-[#007185] hover:underline cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}
              <div className="space-y-2 text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountMenu(false);
                    onOpenOrders();
                  }}
                  className="w-full text-left hover:text-[#C7511F] hover:underline flex items-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#565959]" />
                  Your Orders ({ordersCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountMenu(false);
                    onOpenLocation();
                  }}
                  className="w-full text-left hover:text-[#C7511F] hover:underline flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#565959]" />
                  Delivery Address ({location.postalCode})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <button
          type="button"
          onClick={onOpenOrders}
          className="hidden md:flex flex-col items-start px-2 py-1.5 rounded-sm border border-transparent hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] text-left shrink-0 transition-colors cursor-pointer"
        >
          <span className="text-[11px] text-[#CCCCCC] leading-tight whitespace-nowrap">
            Returns
          </span>
          <span className="text-[13px] font-bold text-white leading-tight whitespace-nowrap">
            & Orders{ordersCount > 0 ? ` (${ordersCount})` : ''}
          </span>
        </button>

        {/* Cart Button */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Shopping cart with ${cartCount} items`}
          className="flex items-end gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] shrink-0 transition-colors cursor-pointer"
        >
          <div className="relative flex items-center">
            <ShoppingCart className="w-7 h-7 text-white" strokeWidth={1.8} />
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[14px] font-extrabold text-[#F08804] bg-[#131921] px-1 leading-none tabular-nums">
              {cartCount}
            </span>
          </div>
          <span className="hidden sm:inline text-[13px] font-bold text-white leading-none pb-0.5">
            Cart
          </span>
        </button>
      </div>

      {/* Sub-Navigation Bar */}
      <nav
        aria-label="Primary categories"
        className="bg-[#232F3E] text-white px-2 sm:px-4 h-[39px] flex items-center gap-1 overflow-x-auto custom-scrollbar text-[13px]"
      >
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="flex items-center gap-1 px-2.5 py-1 rounded-sm border border-transparent hover:border-white font-bold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>All Filters</span>
        </button>

        {[
          { id: 'all', label: 'All Results' },
          { id: 'prime', label: 'Prime Eligible' },
          { id: 'bestsellers', label: 'Best Sellers' },
          { id: 'deals', label: "Today's Deals" },
          { id: 'electronics', label: 'Electronics' },
          { id: 'accessories', label: 'Mobile Accessories' },
        ].map((item) => {
          const isActive = activeNavPreset === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onQuickFilter(item.id as 'all' | 'prime' | 'deals' | 'bestsellers' | 'electronics' | 'accessories')}
              className={`px-2.5 py-1 rounded-sm border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#FF9900] text-[#FF9900] font-semibold'
                  : 'border-transparent hover:border-white text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenLocation}
          className="md:hidden ml-auto flex items-center gap-1 px-2 py-1 text-[12px] text-[#CCCCCC] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>SG {location.postalCode}</span>
        </button>
      </nav>
    </header>
  );
};
