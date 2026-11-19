import React from 'react';
import { X, Package } from 'lucide-react';
import { OrderRecord } from '../types/product';
import { ResilientProductImage } from './StarRating';

interface OrdersModalProps {
  open: boolean;
  orders: OrderRecord[];
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ open, orders, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="Your Orders"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[680px] w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F0F2F2] px-5 py-3.5 border-b border-[#D5D9D9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0F1111]" />
            <h2 className="text-[17px] font-bold text-[#0F1111]">
              Your Orders ({orders.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#565959]" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
          {orders.length === 0 ? (
            <div className="py-10 text-center text-[#565959] text-[14px]">
              You haven&apos;t placed any orders in this session yet. Add an iPhone duo case to your cart and proceed to checkout to test order confirmation.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-[#D5D9D9] rounded-[6px] overflow-hidden"
              >
                <div className="bg-[#F0F2F2] px-4 py-2.5 text-[12px] text-[#565959] flex flex-wrap items-center justify-between gap-3 border-b border-[#D5D9D9]">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="uppercase text-[10px] font-semibold">Order Placed</div>
                      <div className="text-[#0F1111] font-medium">{order.date}</div>
                    </div>
                    <div>
                      <div className="uppercase text-[10px] font-semibold">Total</div>
                      <div className="text-[#0F1111] font-bold tabular-nums">
                        S${order.total.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase text-[10px] font-semibold">Ship To</div>
                      <div className="text-[#007185]">{order.deliveryAddress}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="uppercase text-[10px] font-semibold">Order #</div>
                    <div className="text-[#0F1111] font-mono text-[12px]">{order.orderId}</div>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-white">
                  <p className="text-[14px] font-bold text-[#007600]">{order.status}</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#F7F7F7] rounded-[4px] p-1 border border-[#EEEEEE] shrink-0">
                        <ResilientProductImage
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#007185] line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-[12px] text-[#565959]">
                          {item.selectedColor} · {item.selectedModel} · Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-[13px] font-semibold text-[#0F1111] tabular-nums shrink-0">
                        S${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
