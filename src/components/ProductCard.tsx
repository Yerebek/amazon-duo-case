import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Product } from '../types/product';
import {
  StarRating,
  PrimeBadge,
  PriceLockup,
  ResilientProductImage,
} from './StarRating';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product, activeColor: string) => void;
  onAddToCart: (product: Product, colorName: string) => void;
  onOneClickBuy: (product: Product, colorName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onOneClickBuy,
}) => {
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [justOrdered, setJustOrdered] = useState(false);

  const activeVariant = product.colors[activeColorIdx] ?? {
    name: 'Default',
    hex: '#1f2024',
    image: product.image,
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeVariant.name);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const handleOneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOneClickBuy(product, activeVariant.name);
    setJustOrdered(true);
    window.setTimeout(() => setJustOrdered(false), 1800);
  };

  const getBadgeStyle = (badge: Product['badge']) => {
    if (badge === "Amazon's Choice") {
      return 'bg-[#232F3E] text-white';
    }
    if (badge === 'Best Seller') {
      return 'bg-[#D14900] text-white';
    }
    if (badge === 'Limited time deal') {
      return 'bg-[#CC0C39] text-white';
    }
    return '';
  };

  return (
    <article className="border border-[#F0F2F2] rounded-[4px] bg-white flex flex-col justify-between hover:shadow-[0_2px_10px_rgba(15,17,17,0.08)] transition-shadow duration-150 overflow-hidden">
      <div>
        {/* Product Image Container */}
        <div
          onClick={() => onSelect(product, activeVariant.name)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(product, activeVariant.name);
            }
          }}
          className="relative bg-[#F7F7F7] aspect-square w-full flex items-center justify-center p-4 cursor-pointer group overflow-hidden"
        >
          {product.badge && (
            <span
              className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-[11px] font-semibold tracking-tight rounded-[2px] ${getBadgeStyle(
                product.badge
              )}`}
            >
              {product.badge}
            </span>
          )}
          <ResilientProductImage
            src={activeVariant.image || product.image}
            alt={`${product.title} - ${activeVariant.name}`}
            fallbackLabel={product.brand}
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-150"
          />
        </div>

        {/* Card Body */}
        <div className="p-3.5 pb-2">
          {/* Interactive Color Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.colors.map((color, idx) => {
                const isSelected = idx === activeColorIdx;
                return (
                  <button
                    key={color.name}
                    type="button"
                    aria-label={`Select colour ${color.name}`}
                    title={color.name}
                    onClick={() => setActiveColorIdx(idx)}
                    className={`w-[18px] h-[18px] rounded-full p-[2px] border cursor-pointer transition-transform ${
                      isSelected
                        ? 'border-[#007185] ring-1 ring-[#007185] scale-105'
                        : 'border-[#D5D9D9] hover:border-[#565959]'
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
              <span className="text-[11px] text-[#565959] ml-1 truncate">
                {activeVariant.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="mb-1.5">
            <button
              type="button"
              onClick={() => onSelect(product, activeVariant.name)}
              className="text-left text-[15px] leading-[1.35] font-normal text-[#0F1111] hover:text-[#C7511F] line-clamp-3 cursor-pointer"
            >
              {product.title}
            </button>
          </h3>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-1">
            <button
              type="button"
              onClick={() => onSelect(product, activeVariant.name)}
              className="inline-flex items-center gap-1 group cursor-pointer"
            >
              <StarRating rating={product.rating} size="sm" />
              <span className="text-[13px] text-[#007185] group-hover:text-[#C7511F] group-hover:underline tabular-nums">
                {product.reviewCount.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Bought past month */}
          {product.boughtPastMonth && (
            <p className="text-[12px] text-[#565959] mb-2">{product.boughtPastMonth}</p>
          )}

          {/* Price Lockup */}
          <div className="mb-2">
            <PriceLockup price={product.price} listPrice={product.listPrice} />
          </div>

          {/* Prime + Delivery Info */}
          <div className="space-y-0.5 text-[12px] text-[#0F1111]">
            {product.isPrime && (
              <div className="mb-0.5">
                <PrimeBadge />
              </div>
            )}
            <p className="leading-snug">
              <span className={product.deliveryTomorrow ? 'font-bold text-[#0F1111]' : 'text-[#565959]'}>
                {product.deliveryText}
              </span>
            </p>
            <p className="text-[11px] text-[#565959]">
              Ships to Singapore · {product.compatibleModels[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-3.5 pb-3.5 pt-2 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
            justAdded
              ? 'bg-[#067D62] text-white'
              : 'bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-[#0F1111]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to cart</span>
            </>
          ) : (
            <span>Add to cart</span>
          )}
        </button>

        <button
          type="button"
          onClick={handleOneClick}
          className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
            justOrdered
              ? 'bg-[#067D62] text-white'
              : 'bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#F08804] text-[#0F1111]'
          }`}
        >
          {justOrdered ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Ordered with 1-Click</span>
            </>
          ) : (
            <span>Buy now with 1-Click</span>
          )}
        </button>
      </div>
    </article>
  );
};
