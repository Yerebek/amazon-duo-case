import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, Check, Lock } from 'lucide-react';
import { Product, DeliveryLocation } from '../types/product';
import {
  StarRating,
  PrimeBadge,
  PriceLockup,
  ResilientProductImage,
} from './StarRating';

interface ProductDetailModalProps {
  product: Product | null;
  initialColor?: string;
  location: DeliveryLocation;
  onClose: () => void;
  onAddToCart: (product: Product, colorName: string, model: string, qty: number) => void;
  onOneClickBuy: (product: Product, colorName: string, model: string, qty: number) => void;
  onBuyNow: (product: Product, colorName: string, model: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  location,
  onClose,
  onAddToCart,
  onOneClickBuy,
  onBuyNow,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState('');
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!product) return;
    const idx = initialColor
      ? product.colors.findIndex((c) => c.name === initialColor)
      : 0;
    setSelectedColorIdx(idx >= 0 ? idx : 0);
    setSelectedModel(product.compatibleModels[0] || 'iPhone 16 Pro Max');
    setQty(1);
    setAddedFeedback(false);
  }, [product, initialColor]);

  if (!product) return null;

  const activeColor = product.colors[selectedColorIdx] ?? {
    name: 'Standard',
    hex: '#1f2024',
    image: product.image,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[1040px] w-full max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-[#E7E7E7] px-5 py-3 flex items-center justify-between">
          <div className="text-[12px] text-[#565959] truncate pr-4">
            <span>Electronics</span>
            <span className="mx-1.5">›</span>
            <span>{product.category}</span>
            <span className="mx-1.5">›</span>
            <span className="font-medium text-[#0F1111]">{product.brand}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-full hover:bg-[#F3F3F3] text-[#0F1111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main 3-Zone Product Module */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Product Image + Color Swatch Preview */}
          <div className="lg:col-span-5">
            <div className="bg-[#F7F7F7] rounded-[6px] aspect-square w-full flex items-center justify-center p-6 border border-[#EEEEEE]">
              <ResilientProductImage
                src={activeColor.image || product.image}
                alt={`${product.title} - ${activeColor.name}`}
                fallbackLabel={product.brand}
                className="w-full h-full object-contain"
              />
            </div>

            {product.colors.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-14 h-14 rounded-[4px] bg-[#F7F7F7] p-1 border-2 shrink-0 cursor-pointer transition-colors ${
                      idx === selectedColorIdx
                        ? 'border-[#007185]'
                        : 'border-[#D5D9D9] hover:border-[#888C8C]'
                    }`}
                    title={color.name}
                  >
                    <ResilientProductImage
                      src={color.image}
                      alt={color.name}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Product Specs & Ratings Breakdown */}
          <div className="lg:col-span-4 space-y-3.5">
            <div>
              <p className="text-[13px] text-[#007185] font-medium mb-1">
                Brand: {product.brand}
              </p>
              <h2 className="text-[20px] font-semibold leading-snug text-[#0F1111]">
                {product.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 pb-3 border-b border-[#E7E7E7]">
              <span className="text-[14px] font-semibold text-[#0F1111] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <StarRating rating={product.rating} size="sm" />
              <span className="text-[13px] text-[#007185] tabular-nums">
                {product.reviewCount.toLocaleString()} ratings
              </span>
            </div>

            {/* Price */}
            <div className="pb-3 border-b border-[#E7E7E7]">
              <PriceLockup price={product.price} listPrice={product.listPrice} size="lg" />
              <p className="text-[12px] text-[#565959] mt-1">
                Inclusive of GST · Free returns within 15 days
              </p>
            </div>

            {/* Colour Selector */}
            <div>
              <div className="text-[13px] mb-1.5">
                <span className="text-[#565959]">Colour: </span>
                <span className="font-bold text-[#0F1111]">{activeColor.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`px-2.5 py-1 text-[12px] rounded-[4px] border flex items-center gap-1.5 cursor-pointer ${
                      idx === selectedColorIdx
                        ? 'border-[#007185] bg-[#F2FAFB] font-semibold text-[#0F1111]'
                        : 'border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] text-[#0F1111]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Compatible Model Selector */}
            <div>
              <div className="text-[13px] mb-1.5">
                <span className="text-[#565959]">Model Size: </span>
                <span className="font-bold text-[#0F1111]">{selectedModel}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.compatibleModels.map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setSelectedModel(model)}
                    className={`px-2.5 py-1 text-[12px] rounded-[4px] border cursor-pointer ${
                      selectedModel === model
                        ? 'border-[#E77600] bg-[#FEF8F2] font-semibold text-[#0F1111]'
                        : 'border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] text-[#0F1111]'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* About this item */}
            <div className="pt-2 border-t border-[#E7E7E7]">
              <h3 className="text-[14px] font-bold text-[#0F1111] mb-2">About this item</h3>
              <ul className="list-disc pl-4 space-y-1.5 text-[13px] text-[#0F1111] leading-relaxed">
                {product.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Customer Rating Histogram */}
            <div className="pt-3 border-t border-[#E7E7E7]">
              <h3 className="text-[14px] font-bold text-[#0F1111] mb-2">
                Customer review breakdown
              </h3>
              <div className="space-y-1.5">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const pct = product.ratingBreakdown[star];
                  return (
                    <div key={star} className="flex items-center gap-2 text-[12px]">
                      <span className="w-10 text-[#007185] shrink-0">{star} star</span>
                      <div className="flex-1 h-3.5 bg-[#F0F2F2] rounded-[2px] border border-[#D5D9D9] overflow-hidden">
                        <div
                          className="h-full bg-[#FFA41C]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-[#565959] tabular-nums shrink-0">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Contiguous Buy Box */}
          <div className="lg:col-span-3 border border-[#D5D9D9] rounded-[8px] p-4 space-y-3 bg-white">
            <PriceLockup price={product.price} size="md" />

            {product.isPrime && (
              <div>
                <PrimeBadge />
              </div>
            )}

            <p className="text-[13px] text-[#0F1111] leading-snug">
              <span className="font-semibold">{product.deliveryText}</span>
            </p>

            <div className="flex items-start gap-1.5 text-[12px] text-[#007185]">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#565959]" />
              <span>
                Deliver to {location.city} {location.postalCode}
              </span>
            </div>

            <p className="text-[16px] font-semibold text-[#007600]">In Stock</p>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <label htmlFor="modal-qty" className="text-[13px] text-[#0F1111]">
                Quantity:
              </label>
              <select
                id="modal-qty"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border border-[#D5D9D9] rounded-[6px] bg-[#F0F2F2] px-2.5 py-1 text-[13px] text-[#0F1111] cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, activeColor.name, selectedModel, qty);
                  setAddedFeedback(true);
                  window.setTimeout(() => setAddedFeedback(false), 1600);
                }}
                className={`w-full py-2 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  addedFeedback
                    ? 'bg-[#067D62] text-white'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111]'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onOneClickBuy(product, activeColor.name, selectedModel, qty);
                  onClose();
                }}
                className="w-full py-2 px-4 rounded-full text-[13px] font-medium bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] transition-colors cursor-pointer"
              >
                Buy now with 1-Click
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, activeColor.name, selectedModel, qty)}
                className="w-full py-2 px-4 rounded-full text-[13px] font-medium bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] text-[#0F1111] transition-colors cursor-pointer"
              >
                Proceed via Cart
              </button>
            </div>

            <div className="pt-2 border-t border-[#E7E7E7] text-[12px] text-[#565959] space-y-1.5">
              <div className="flex justify-between gap-2">
                <span>Ships from</span>
                <span className="text-[#0F1111] font-medium">Amazon.sg</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Sold by</span>
                <span className="text-[#007185] truncate">{product.seller}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-[#007185]">
                <Lock className="w-3.5 h-3.5 text-[#565959]" />
                <span>Secure transaction</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#565959]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#007600]" />
                <span>15-day Singapore return guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
