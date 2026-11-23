'use client';

import React, { useState } from 'react';
import { CabMode } from '@/types/cabcircle';
import { CAB_MODES, estimateCabFare } from '@/data/seedTravellers';

interface RidePreferencesProps {
  distanceKm: number;
  toll: number;
  cabMode: CabMode;
  onChangeCabMode: (mode: CabMode) => void;
  passengers: number;
  onChangePassengers: (count: number) => void;
  luggageType: 'light' | 'heavy';
  onChangeLuggage: (type: 'light' | 'heavy') => void;
  onApply: () => void;
}

export function RidePreferences({
  distanceKm,
  toll,
  cabMode,
  onChangeCabMode,
  passengers,
  onChangePassengers,
  luggageType,
  onChangeLuggage,
  onApply,
}: RidePreferencesProps) {
  const [quotedFareInput, setQuotedFareInput] = useState('');
  const isLargeVehicle = luggageType === 'heavy' || passengers === 4;

  const fare = estimateCabFare({
    cabMode,
    distanceKm,
    toll,
    passengers,
    isLargeVehicle,
    customQuotedFare: quotedFareInput ? Number(quotedFareInput) : null,
  });

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E6E9EF] shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#111622]">Cab Mode &amp; Fare Estimator</h2>
        <p className="text-xs text-[#5C667A]">
          Auto-calculated from airport tariff ({distanceKm} km + ₹{toll} toll).
        </p>
      </div>

      {/* Cab Mode Selector */}
      <div>
        <label className="text-xs font-bold text-[#111622]">Cab Booking Mode</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {CAB_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeCabMode(mode)}
              className={`p-3 rounded-2xl text-xs font-semibold border text-left transition cursor-pointer ${
                cabMode === mode
                  ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
                  : 'bg-[#F5F6F8] text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Optional: Driver Quoted / App Fare Override */}
      <div>
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-[#111622]">
            Know Driver / App Price? (Optional)
          </label>
          {quotedFareInput && (
            <button
              type="button"
              onClick={() => setQuotedFareInput('')}
              className="text-[11px] font-semibold text-[#9A722E] hover:underline cursor-pointer"
            >
              Reset to Auto
            </button>
          )}
        </div>
        <div className="mt-1.5 flex items-center bg-[#F5F6F8] border border-[#DCE0E8] rounded-2xl px-3.5 py-2.5 focus-within:border-[#0D1F3C]">
          <span className="text-xs font-bold text-[#0D1F3C] pr-2">₹</span>
          <input
            type="number"
            value={quotedFareInput}
            onChange={(e) => setQuotedFareInput(e.target.value)}
            placeholder="e.g. 1150 (if negotiated with local cab)"
            className="bg-transparent text-xs font-semibold text-[#111622] w-full outline-none"
          />
        </div>
      </div>

      {/* Riders Count */}
      <div>
        <label className="text-xs font-bold text-[#111622]">Co-Travellers ({passengers} Riders)</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChangePassengers(num)}
              className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                passengers === num
                  ? 'bg-[#C89D54] text-[#0D1F3C] border-[#C89D54]'
                  : 'bg-[#F5F6F8] text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
              }`}
            >
              {num} Riders
            </button>
          ))}
        </div>
      </div>

      {/* Luggage */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChangeLuggage('light')}
          className={`p-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            luggageType === 'light'
              ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
              : 'bg-[#F5F6F8] text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
          }`}
        >
          1 Cabin Bag
        </button>
        <button
          type="button"
          onClick={() => onChangeLuggage('heavy')}
          className={`p-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            luggageType === 'heavy'
              ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
              : 'bg-[#F5F6F8] text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
          }`}
        >
          2+ Suitcases (SUV)
        </button>
      </div>

      {/* Live Fare Breakdown Box */}
      <div className="bg-[#0D1F3C] text-white rounded-2xl p-4 flex items-center justify-between border border-[#C89D54]/30">
        <div>
          <p className="text-[10px] text-white/75">{fare.rateLabel}</p>
          <p className="text-lg font-extrabold text-[#E5C285]">
            {fare.perPersonMin === fare.perPersonMax
              ? `₹${fare.perPersonMin} / person`
              : `₹${fare.perPersonMin} – ₹${fare.perPersonMax} / person`}
          </p>
          <p className="text-[10px] text-white/70">
            Total Cab: ₹{fare.minTotal} – ₹{fare.maxTotal} ({isLargeVehicle ? 'SUV' : 'Sedan'})
          </p>
        </div>
        <button
          type="button"
          onClick={onApply}
          className="bg-[#C89D54] hover:bg-[#B88D44] text-[#0D1F3C] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}