import React from 'react';

interface AmazonFooterProps {
  onSelectSearch: (q: string) => void;
}

export const AmazonFooter: React.FC<AmazonFooterProps> = ({ onSelectSearch }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-10 w-full">
      {/* Back to top bar */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-[13px] font-medium py-3.5 text-center transition-colors cursor-pointer"
      >
        Back to top
      </button>

      {/* Main Footer Columns */}
      <div className="bg-[#232F3E] text-white py-10 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
          <div>
            <h4 className="font-bold text-[15px] mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('iphone duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  About Amazon Singapore
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('magsafe duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Amazon Prime SG
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('spigen duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Official Brand Stores
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-3">Shop by Case Style</h4>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('clear magsafe duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Clear Hybrid Duo Cases
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('wallet duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Magnetic Wallet Folios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectSearch('kickstand duo case')}
                  className="hover:underline text-left cursor-pointer"
                >
                  Kickstand Armor Cases
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-3">Payment &amp; Shipping</h4>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>SGD (S$) Pricing &amp; GST</li>
              <li>Free One-Day Prime Delivery</li>
              <li>Free Delivery Over S$40</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[15px] mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-[#DDDDDD]">
              <li>Track Packages or View Orders</li>
              <li>15-Day Free Singapore Returns</li>
              <li>Device Compatibility Guide</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Locale Strip */}
      <div className="bg-[#131921] border-t border-[#3A4553] py-6 px-6 text-center text-[#DDDDDD]">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-3">
          <div className="flex items-baseline">
            <span className="text-[18px] font-extrabold tracking-tight text-white">amazon</span>
            <span className="text-[12px] font-semibold text-[#FF9900]">.sg</span>
          </div>
          <span className="px-3 py-1 border border-[#848688] rounded-[3px] text-[12px] text-[#CCCCCC]">
            Singapore (SGD · S$)
          </span>
        </div>
        <p className="text-[11px] text-[#999999]">
          Amazon.sg Search Storefront UI Replication · iPhone Duo Case Catalog
        </p>
      </div>
    </footer>
  );
};
