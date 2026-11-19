import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { DeliveryLocation } from '../types/product';

interface LocationModalProps {
  open: boolean;
  location: DeliveryLocation;
  onClose: () => void;
  onSave: (next: DeliveryLocation) => void;
}

const PRESET_LOCATIONS: DeliveryLocation[] = [
  { country: 'Singapore', city: 'Singapore', postalCode: '018956' },
  { country: 'Singapore', city: 'Orchard', postalCode: '238801' },
  { country: 'Singapore', city: 'Tampines', postalCode: '529510' },
  { country: 'Singapore', city: 'Jurong East', postalCode: '608532' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  open,
  location,
  onClose,
  onSave,
}) => {
  const [postalInput, setPostalInput] = useState(location.postalCode);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleApplyPostal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = postalInput.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setError('Please enter a valid 6-digit Singapore postal code.');
      return;
    }
    setError('');
    onSave({ country: 'Singapore', city: 'Singapore', postalCode: cleaned });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-label="Choose your delivery location"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[400px] w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#F0F2F2] px-5 py-3.5 border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#0F1111]">
            Choose your location
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#565959]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[12px] text-[#565959]">
            Delivery options and delivery speeds may vary for different Singapore postal districts.
          </p>

          <div className="space-y-2">
            {PRESET_LOCATIONS.map((preset) => {
              const active = preset.postalCode === location.postalCode;
              return (
                <button
                  key={preset.postalCode}
                  type="button"
                  onClick={() => {
                    onSave(preset);
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-[6px] border flex items-center justify-between text-[13px] cursor-pointer transition-colors ${
                    active
                      ? 'border-[#007185] bg-[#F2FAFB] font-semibold'
                      : 'border-[#D5D9D9] hover:bg-[#F7FAFA]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#007185]" />
                    <span>
                      {preset.city}, Singapore {preset.postalCode}
                    </span>
                  </span>
                  {active && <span className="text-[11px] text-[#007185]">Selected</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E7E7E7]">
            <label
              htmlFor="sg-postal-input"
              className="block text-[12px] font-semibold text-[#0F1111] mb-1.5"
            >
              Or enter a Singapore postal code
            </label>
            <form onSubmit={handleApplyPostal} className="flex gap-2">
              <input
                id="sg-postal-input"
                type="text"
                maxLength={6}
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                placeholder="e.g. 018956"
                className="flex-1 px-3 py-1.5 text-[13px] border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185] tabular-nums"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-[13px] font-medium bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-[8px] shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </form>
            {error && <p className="text-[12px] text-[#CC0C39] mt-1.5">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
