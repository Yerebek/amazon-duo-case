import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;

  return (
    <div className="inline-flex items-center" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isFull = index <= roundedUp;
        const isHalf = !isFull && hasHalf && index === fullStars + 1;
        return (
          <svg
            key={index}
            viewBox="0 0 20 20"
            className={`${starSize} shrink-0`}
            aria-hidden="true"
          >
            {isHalf ? (
              <>
                <defs>
                  <linearGradient id={`half-star-${index}-${rating}`}>
                    <stop offset="50%" stopColor="#DE7921" />
                    <stop offset="50%" stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-star-${index}-${rating})`}
                  stroke="#DE7921"
                  strokeWidth="0.8"
                  d="M10 1.8l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.4l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.8z"
                />
              </>
            ) : (
              <path
                fill={isFull ? '#DE7921' : '#FFFFFF'}
                stroke="#DE7921"
                strokeWidth="1.1"
                d="M10 1.8l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.4l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.8z"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
};

export const PrimeBadge: React.FC = () => (
  <span className="inline-flex items-baseline gap-0.5 select-none" aria-label="Amazon Prime">
    <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 translate-y-[1px]" aria-hidden="true">
      <path
        d="M2 7.5L5.3 10.8L12 3.8"
        fill="none"
        stroke="#FF9900"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-[13px] font-extrabold tracking-tight text-[#00A8E1] leading-none">
      prime
    </span>
  </span>
);

interface PriceLockupProps {
  price: number;
  listPrice?: number;
  size?: 'md' | 'lg';
}

export const PriceLockup: React.FC<PriceLockupProps> = ({ price, listPrice, size = 'md' }) => {
  const whole = Math.floor(price);
  const cents = Math.round((price - whole) * 100)
    .toString()
    .padStart(2, '0');
  const discountPct =
    listPrice && listPrice > price ? Math.round(((listPrice - price) / listPrice) * 100) : null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 tabular-nums">
      <span className="inline-flex items-start text-[#0F1111]">
        <span className="text-[12px] font-medium leading-none mt-[3px] mr-[1px]">S$</span>
        <span className={`${size === 'lg' ? 'text-[28px]' : 'text-[24px]'} font-semibold leading-none tracking-tight`}>
          {whole}
        </span>
        <span className="text-[12px] font-medium leading-none mt-[3px] ml-[1px]">{cents}</span>
      </span>
      {listPrice && listPrice > price && (
        <span className="text-[12px] text-[#565959]">
          List: <span className="line-through">S${listPrice.toFixed(2)}</span>
          {discountPct && discountPct > 0 && (
            <span className="ml-1 text-[#0F1111]">({discountPct}% off)</span>
          )}
        </span>
      )}
    </div>
  );
};

interface ResilientProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientProductImage: React.FC<ResilientProductImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'iPhone Case',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] text-[#565959] p-4 text-center">
        <Smartphone className="w-10 h-10 mb-2 text-[#888c8c]" strokeWidth={1.5} />
        <span className="text-xs font-medium line-clamp-2">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
