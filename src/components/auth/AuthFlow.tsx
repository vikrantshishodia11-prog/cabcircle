'use client';

import React, { useState } from 'react';
import { AuthStep, GenderOption, UserProfile } from '@/types/cabcircle';
import { extractCompanyBadge, findUserByPhone, saveUserAndSession } from '@/lib/storage';

interface AuthFlowProps {
  onAuthenticated: (user: UserProfile) => void;
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<GenderOption>('Female');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setOtp('4829');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Enter the 4-digit OTP.');
      return;
    }
    setError('');
    const existingUser = findUserByPhone(phone);
    if (existingUser) {
      saveUserAndSession(existingUser);
      onAuthenticated(existingUser);
      return;
    }
    setStep('profile_setup');
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Valid email is required for trip updates & invoices.');
      return;
    }
    setError('');
    const profile: UserProfile = {
      phone,
      fullName: fullName.trim(),
      gender,
      email: email.trim().toLowerCase(),
      companyBadge: extractCompanyBadge(email.trim()),
    };
    saveUserAndSession(profile);
    onAuthenticated(profile);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F5F6F8] overflow-y-auto">
      <div className="bg-[#0D1F3C] text-white rounded-3xl p-6 border border-[#C89D54]/30 shadow-md">
        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-[#E5C285] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#C89D54] animate-pulse" />
          SahYatri · Airport Crew
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">
          Your Way. <span className="text-[#C89D54]">Together.</span>
        </h1>
        <p className="text-sm text-white/80 mt-2 leading-relaxed">
          Meet verified travellers heading your way and split airport cabs (Uber, Ola, Prepaid &amp; Local) by up to 65%.
        </p>
      </div>

      {step === 'welcome' && (
        <form onSubmit={handleSendOtp} className="bg-white rounded-3xl p-6 border border-[#E6E9EF] shadow-sm space-y-4 my-4">
          <div>
            <h2 className="text-xl font-bold text-[#111622]">Let&apos;s get you moving</h2>
            <p className="text-xs text-[#5C667A] mt-1">
              New or returning account is detected automatically after OTP.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5C667A]">
              Mobile Number
            </label>
            <div className="mt-1.5 flex items-center bg-[#F5F6F8] border border-[#DCE0E8] rounded-2xl px-4 py-3.5 focus-within:border-[#0D1F3C]">
              <span className="text-sm font-bold text-[#0D1F3C] pr-3 border-r border-[#DCE0E8]">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="bg-transparent pl-3 text-base font-semibold text-[#111622] w-full outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-[#5C667A] mt-1.5">
              Use <span className="font-semibold text-[#0D1F3C]">9999999999</span> for instant returning login or any new number to sign up.
            </p>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white font-semibold py-4 rounded-2xl transition shadow-md cursor-pointer"
          >
            Continue with phone
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="bg-white rounded-3xl p-6 border border-[#E6E9EF] shadow-sm space-y-4 my-4">
          <button
            type="button"
            onClick={() => setStep('welcome')}
            className="text-xs font-semibold text-[#0D1F3C] cursor-pointer"
          >
            ← Change number (+91 {phone})
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#111622]">Verify 4-digit OTP</h2>
            <p className="text-xs text-[#5C667A] mt-1">
              Demo OTP ready: <span className="font-bold text-[#0D1F3C]">4829</span>
            </p>
          </div>

          <input
            type="text"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center tracking-[0.6em] text-2xl font-bold text-[#111622] bg-[#F5F6F8] border border-[#DCE0E8] rounded-2xl py-4 outline-none focus:border-[#0D1F3C]"
            required
          />

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white font-semibold py-4 rounded-2xl shadow-md transition cursor-pointer"
          >
            Verify &amp; Continue
          </button>
        </form>
      )}

      {step === 'profile_setup' && (
        <form onSubmit={handleCreateProfile} className="bg-white rounded-3xl p-6 border border-[#E6E9EF] shadow-sm space-y-4 my-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('welcome')}
              className="text-xs font-semibold text-[#0D1F3C] cursor-pointer"
            >
              ← Back
            </button>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FBF6EC] text-[#0D1F3C] border border-[#C89D54]/40 px-2.5 py-1 rounded-full">
              New Traveller
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#111622]">Create Traveller Profile</h2>
            <p className="text-xs text-[#5C667A] mt-0.5">
              Email is required for trip updates &amp; fare invoices.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5C667A]">Full Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Verma"
              className="mt-1 w-full bg-[#F5F6F8] border border-[#DCE0E8] rounded-2xl px-4 py-3 text-sm font-medium text-[#111622] outline-none focus:border-[#0D1F3C]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5C667A]">
              Gender (Women-Only Filter)
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(['Female', 'Male', 'Non-binary'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    gender === g
                      ? 'bg-[#0D1F3C] text-white border-[#0D1F3C]'
                      : 'bg-[#F5F6F8] text-[#111622] border-[#DCE0E8] hover:border-[#C89D54]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#5C667A]">Email Address *</label>
              <span className="text-[10px] font-semibold text-[#9A722E]">Alerts &amp; Invoices</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com or work email"
              className="mt-1 w-full bg-[#F5F6F8] border border-[#DCE0E8] rounded-2xl px-4 py-3 text-sm font-medium text-[#111622] outline-none focus:border-[#0D1F3C]"
              required
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#0D1F3C] hover:bg-[#162E54] text-white font-semibold py-3.5 rounded-2xl shadow-md transition cursor-pointer"
          >
            Complete Setup &amp; Find Rides
          </button>
        </form>
      )}

      <div className="text-center text-[11px] text-[#5C667A]">
        Instant Browser PWA · Zero App Download Required
      </div>
    </div>
  );
}