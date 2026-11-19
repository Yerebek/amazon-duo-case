import React, { useState } from 'react';
import { X, Trash2, CheckCircle2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { CartItem, DeliveryLocation } from '../types/product';
import { PrimeBadge, ResilientProductImage } from './StarRating';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  location: DeliveryLocation;
  onClose: () => void;
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (orderTotal: number) => string;
}

const FREE_DELIVERY_THRESHOLD = 40;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  location,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) => {
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!open) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const allPrime = items.length > 0 && items.every((i) => i.product.isPrime);
  const freeShippingUnlocked = allPrime || subtotal >= FREE_DELIVERY_THRESHOLD;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleCheckout = () => {
    const orderId = onCheckout(subtotal);
    setConfirmedOrderId(orderId);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/55"
        onClick={() => {
          setConfirmedOrderId(null);
          onClose();
        }}
        aria-hidden="true"
      />

      <aside
        aria-label="Shopping Cart"
        className="relative z-10 w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#131921] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FEBD69]" />
            <h2 className="text-[17px] font-bold">
              Shopping Cart ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrderId(null);
              onClose();
            }}
            aria-label="Close cart"
            className="p-1.5 rounded-md hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmation State */}
        {confirmedOrderId ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#007600]" />
            <div>
              <h3 className="text-[20px] font-bold text-[#0F1111]">
                Order Confirmed — #{confirmedOrderId}
              </h3>
              <p className="text-[14px] text-[#565959] mt-1">
                Preparing shipment to {location.city} {location.postalCode}. Estimated
                delivery: Tomorrow, 19 Nov.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmedOrderId(null);
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[14px] font-medium text-[#0F1111] cursor-pointer"
            >
              Continue shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#888C8C]" strokeWidth={1.5} />
            <h3 className="text-[18px] font-bold text-[#0F1111]">
              Your Amazon.sg Cart is empty
            </h3>
            <p className="text-[13px] text-[#565959] max-w-[280px]">
              Add any iPhone duo case from the search results to see Singapore Prime delivery options and subtotal.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Browse iPhone duo cases
            </button>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress */}
            <div className="px-5 py-3 bg-[#F7F8F8] border-b border-[#E7E7E7] text-[13px]">
              {freeShippingUnlocked ? (
                <div className="flex items-center gap-2 text-[#007600] font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Your order qualifies for FREE Singapore Delivery!
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[#0F1111]">
                    Add <span className="font-bold tabular-nums">S${remainingForFree.toFixed(2)}</span> of eligible items for FREE Singapore Delivery.
                  </p>
                  <div className="w-full h-2 bg-[#E7E7E7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007600] transition-all duration-200"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7] px-5 custom-scrollbar">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedModel}`}
                  className="py-4 flex gap-3.5"
                >
                  <div className="w-20 h-20 bg-[#F7F7F7] rounded-[4px] p-1.5 shrink-0 flex items-center justify-center border border-[#EEEEEE]">
                    <ResilientProductImage
                      src={
                        item.product.colors.find((c) => c.name === item.selectedColor)
                          ?.image || item.product.image
                      }
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-medium text-[#0F1111] line-clamp-2 leading-snug">
                      {item.product.title}
                    </h4>
                    <p className="text-[12px] text-[#565959] mt-0.5">
                      Colour: {item.selectedColor} · {item.selectedModel}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[15px] font-bold text-[#0F1111] tabular-nums">
                        S${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.product.isPrime && <PrimeBadge />}
                    </div>

                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="inline-flex items-center border border-[#D5D9D9] rounded-full bg-[#F0F2F2]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => onUpdateQty(idx, -1)}
                          className="px-2.5 py-1 hover:bg-[#E3E6E6] rounded-l-full cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-[13px] font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => onUpdateQty(idx, 1)}
                          className="px-2.5 py-1 hover:bg-[#E3E6E6] rounded-r-full cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Checkout Module */}
            <div className="p-5 border-t border-[#D5D9D9] bg-[#F7F8F8] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[16px] text-[#0F1111]">
                  Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="text-[20px] font-bold text-[#0F1111] tabular-nums">
                  S${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[14px] font-semibold text-[#0F1111] shadow-xs cursor-pointer transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
