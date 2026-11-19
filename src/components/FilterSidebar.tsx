import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { FilterState } from '../types/product';
import { ALL_BRANDS, ALL_MODELS, ALL_FEATURES } from '../data/products';
import { StarRating, PrimeBadge } from './StarRating';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  brandCounts: Record<string, number>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const PRICE_PRESETS: Array<{ label: string; range: [number | null, number | null] }> = [
  { label: 'Under S$25', range: [null, 25] },
  { label: 'S$25 to S$45', range: [25, 45] },
  { label: 'S$45 to S$70', range: [45, 70] },
  { label: 'S$70 & Above', range: [70, null] },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  brandCounts,
  mobileOpen,
  onCloseMobile,
}) => {
  const [minInput, setMinInput] = useState(
    filters.priceRange[0] !== null ? String(filters.priceRange[0]) : ''
  );
  const [maxInput, setMaxInput] = useState(
    filters.priceRange[1] !== null ? String(filters.priceRange[1]) : ''
  );

  useEffect(() => {
    setMinInput(filters.priceRange[0] !== null ? String(filters.priceRange[0]) : '');
    setMaxInput(filters.priceRange[1] !== null ? String(filters.priceRange[1]) : '');
  }, [filters.priceRange]);

  const toggleArrayValue = (key: 'brands' | 'models' | 'features', val: string) => {
    const current = filters[key];
    const next = current.includes(val)
      ? current.filter((item) => item !== val)
      : [...current, val];
    onChange({ ...filters, [key]: next });
  };

  const applyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minInput.trim() === '' ? null : Number(minInput);
    const maxVal = maxInput.trim() === '' ? null : Number(maxInput);
    onChange({
      ...filters,
      priceRange: [
        minVal !== null && !Number.isNaN(minVal) ? minVal : null,
        maxVal !== null && !Number.isNaN(maxVal) ? maxVal : null,
      ],
    });
  };

  const hasActiveFilters =
    filters.deliveryTomorrowOnly ||
    filters.primeOnly ||
    filters.minRating > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== null ||
    filters.priceRange[1] !== null ||
    filters.models.length > 0 ||
    filters.features.length > 0 ||
    filters.department !== 'All Departments';

  const sidebarContent = (
    <div className="space-y-5 text-[13px] text-[#0F1111]">
      {hasActiveFilters && (
        <div className="pb-3 border-b border-[#E7E7E7]">
          <button
            type="button"
            onClick={onReset}
            className="text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Delivery Day */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Delivery Day</h3>
        <label className="flex items-center gap-2 cursor-pointer group py-0.5">
          <input
            type="checkbox"
            checked={filters.deliveryTomorrowOnly}
            onChange={(e) =>
              onChange({ ...filters, deliveryTomorrowOnly: e.target.checked })
            }
            className="w-4 h-4 accent-[#007185] rounded cursor-pointer"
          />
          <span className="group-hover:text-[#C7511F]">Get It by Tomorrow</span>
        </label>
      </div>

      {/* Amazon Prime */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Amazon Prime</h3>
        <label className="flex items-center gap-2 cursor-pointer group py-0.5">
          <input
            type="checkbox"
            checked={filters.primeOnly}
            onChange={(e) => onChange({ ...filters, primeOnly: e.target.checked })}
            className="w-4 h-4 accent-[#007185] rounded cursor-pointer"
          />
          <PrimeBadge />
        </label>
      </div>

      {/* Customer Reviews */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Customer Reviews</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  onChange({ ...filters, minRating: active ? 0 : stars })
                }
                className={`flex items-center gap-1.5 w-full text-left py-0.5 cursor-pointer group ${
                  active ? 'font-bold text-[#C7511F]' : 'text-[#0F1111]'
                }`}
              >
                <StarRating rating={stars} size="sm" />
                <span className="text-[12px] group-hover:text-[#C7511F]">&amp; Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Brands</h3>
        <div className="space-y-1.5">
          {ALL_BRANDS.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between gap-2 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayValue('brands', brand)}
                    className="w-4 h-4 accent-[#007185] rounded cursor-pointer"
                  />
                  <span className="group-hover:text-[#C7511F]">{brand}</span>
                </span>
                <span className="text-[11px] text-[#565959] tabular-nums">
                  ({brandCounts[brand] ?? 0})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Price</h3>
        <div className="space-y-1 mb-2.5">
          {PRICE_PRESETS.map((preset) => {
            const active =
              filters.priceRange[0] === preset.range[0] &&
              filters.priceRange[1] === preset.range[1];
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    priceRange: active ? [null, null] : preset.range,
                  })
                }
                className={`block text-left text-[13px] py-0.5 hover:text-[#C7511F] cursor-pointer ${
                  active ? 'font-bold text-[#C7511F]' : 'text-[#0F1111]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={applyCustomPrice} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              step="1"
              aria-label="Minimum price in SGD"
              placeholder="Min"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full pl-6 pr-1.5 py-1 text-[12px] border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185] tabular-nums"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              step="1"
              aria-label="Maximum price in SGD"
              placeholder="Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full pl-6 pr-1.5 py-1 text-[12px] border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185] tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 text-[12px] font-medium bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-[8px] shadow-xs cursor-pointer"
          >
            Go
          </button>
        </form>
      </div>

      {/* Compatible Phone Models */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Compatible Phone Models</h3>
        <div className="space-y-1.5">
          {ALL_MODELS.map((model) => {
            const checked = filters.models.includes(model);
            return (
              <label key={model} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayValue('models', model)}
                  className="w-4 h-4 accent-[#007185] rounded cursor-pointer"
                />
                <span className="group-hover:text-[#C7511F]">{model}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Case Features */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Case Features</h3>
        <div className="space-y-1.5">
          {ALL_FEATURES.map((feat) => {
            const checked = filters.features.includes(feat);
            return (
              <label key={feat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayValue('features', feat)}
                  className="w-4 h-4 accent-[#007185] rounded cursor-pointer"
                />
                <span className="group-hover:text-[#C7511F]">{feat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Seller / Condition */}
      <div>
        <h3 className="text-[14px] font-bold mb-2 text-[#0F1111]">Availability</h3>
        <div className="flex items-center gap-2 text-[#0F1111]">
          <Check className="w-4 h-4 text-[#007600]" />
          <span>Ships from Singapore</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside
        aria-label="Search refinements"
        className="hidden lg:block w-[236px] shrink-0 pr-5 border-r border-[#EEEEEE]"
      >
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full overflow-y-auto p-5 shadow-2xl custom-scrollbar z-10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D5D9D9]">
              <h2 className="text-[16px] font-bold text-[#0F1111]">Filter Results</h2>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="p-1.5 rounded-md hover:bg-[#F3F3F3] text-[#0F1111] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
