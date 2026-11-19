import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types/product';
import { IMG_BANNER_COLLECTION } from '../data/products';
import { StarRating, PrimeBadge, ResilientProductImage } from './StarRating';

interface SponsoredBrandBannerProps {
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterBrand: (brand: string) => void;
}

export const SponsoredBrandBanner: React.FC<SponsoredBrandBannerProps> = ({
  featuredProducts,
  onSelectProduct,
  onFilterBrand,
}) => {
  return (
    <section
      aria-label="Featured Duo Case Collection"
      className="mb-5 border border-[#D5D9D9] rounded-[4px] overflow-hidden bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Left Banner Showcase */}
        <div className="md:col-span-5 relative min-h-[175px] bg-[#1D242B] text-white overflow-hidden flex flex-col justify-between p-5">
          <img
            src={IMG_BANNER_COLLECTION}
            alt="Duo Series iPhone Cases in matte black, titanium blue, and frosted clear"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-85"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#131921]/95 via-[#131921]/75 to-transparent"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-[230px]">
            <p className="text-[11px] font-semibold tracking-wider text-[#FEBD69] mb-1">
              DUO PROTECTION SERIES
            </p>
            <h2 className="text-[19px] font-bold leading-snug text-white mb-2">
              Two-Piece MagSafe &amp; Armor Cases
            </h2>
            <p className="text-[12px] text-[#E5E7EB] mb-3">
              Engineered for iPhone 16 Pro Max, 16 Pro &amp; 15 Series.
            </p>
            <button
              type="button"
              onClick={() => onFilterBrand('iPhone Duo')}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-white hover:text-[#FEBD69] underline underline-offset-2 cursor-pointer"
            >
              Shop Duo Collection
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 3 Quick Showcase Items */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EEEEEE] bg-white">
          {featuredProducts.slice(0, 3).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelectProduct(product)}
              className="p-3.5 text-left hover:bg-[#F7F8F8] transition-colors flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-full sm:h-28 bg-[#F7F7F7] rounded-[3px] overflow-hidden shrink-0 flex items-center justify-center p-2">
                <ResilientProductImage
                  src={product.image}
                  alt={product.title}
                  fallbackLabel={product.brand}
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-150"
                />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[13px] font-medium text-[#0F1111] group-hover:text-[#C7511F] line-clamp-2 leading-snug mb-1">
                  {product.title}
                </p>
                <div className="flex items-center gap-1 mb-1">
                  <StarRating rating={product.rating} size="sm" />
                  <span className="text-[11px] text-[#007185] tabular-nums">
                    {product.reviewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-bold text-[#0F1111] tabular-nums">
                    S${product.price.toFixed(2)}
                  </span>
                  {product.isPrime && <PrimeBadge />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
