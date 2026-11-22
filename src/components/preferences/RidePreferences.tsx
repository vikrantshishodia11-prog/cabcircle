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
    <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#111915]">Cab Mode &amp; Fare Estimator</h2>
        <p className="text-xs text-[#5B665F]">
          Auto-calculated from airport tariff ({distanceKm} km + ₹{toll} toll).
        </p>
      </div>

      {/* Cab Mode Selector */}
      <div>
        <label className="text-xs font-bold text-[#111915]">Cab Booking Mode</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {CAB_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeCabMode(mode)}
              className={`p-3 rounded-2xl text-xs font-semibold border text-left transition ${
                cabMode === mode
                  ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                  : 'bg-[#F6F7F2] text-[#111915] border-[#DCE0D5]'
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
          <label className="text-xs font-bold text-[#111915]">
            Know Driver / App Price? (Optional)
          </label>
          {quotedFareInput && (
            <button
              type="button"
              onClick={() => setQuotedFareInput('')}
              className="text-[11px] font-semibold text-[#0F3D2E]"
            >
              Reset to Auto
            </button>
          )}
        </div>
        <div className="mt-1.5 flex items-center bg-[#F6F7F2] border border-[#DCE0D5] rounded-2xl px-3.5 py-2.5">
          <span className="text-xs font-bold text-[#0F3D2E] pr-2">₹</span>
          <input
            type="number"
            value={quotedFareInput}
            onChange={(e) => setQuotedFareInput(e.target.value)}
            placeholder="e.g. 1150 (if negotiated with local cab)"
            className="bg-transparent text-xs font-semibold text-[#111915] w-full outline-none"
          />
        </div>
      </div>

      {/* Riders Count */}
      <div>
        <label className="text-xs font-bold text-[#111915]">Co-Travellers ({passengers} Riders)</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChangePassengers(num)}
              className={`py-2 rounded-xl text-xs font-bold border ${
                passengers === num
                  ? 'bg-[#C6F432] text-[#0F3D2E] border-[#0F3D2E]'
                  : 'bg-[#F6F7F2] text-[#3E4A43] border-[#DCE0D5]'
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
          className={`p-2.5 rounded-xl text-xs font-semibold border ${
            luggageType === 'light'
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
              : 'bg-[#F6F7F2] text-[#3E4A43] border-[#DCE0D5]'
          }`}
        >
          1 Cabin Bag
        </button>
        <button
          type="button"
          onClick={() => onChangeLuggage('heavy')}
          className={`p-2.5 rounded-xl text-xs font-semibold border ${
            luggageType === 'heavy'
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
              : 'bg-[#F6F7F2] text-[#3E4A43] border-[#DCE0D5]'
          }`}
        >
          2+ Suitcases (SUV)
        </button>
      </div>

      {/* Live Fare Breakdown Box */}
      <div className="bg-[#0F3D2E] text-white rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/75">{fare.rateLabel}</p>
          <p className="text-lg font-extrabold text-[#C6F432]">
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
          className="bg-[#C6F432] text-[#0F3D2E] text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          Apply
        </button>
      </div>
    </div>
  );
}