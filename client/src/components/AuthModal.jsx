import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, demoLogin } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please complete all fields.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed');
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        setIsLoading(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed');
      }
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 select-none">
        {/* Dark Backdrop with atmospheric glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
        />

        {/* Ambient background glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#E50914]/15 blur-[160px] pointer-events-none" />

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(229,9,20,0.3)] bg-[#0d0d13]"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="text-center mb-6">
            <span className="font-['Syne'] font-black text-2xl sm:text-3xl tracking-[0.25em] text-white">
              FLIX<span className="text-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]">ORA</span>
            </span>
            <p className="text-sm font-semibold text-gray-300 mt-2">
              {isSignUp ? 'START WATCHING.' : 'Welcome Back.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vaibhav Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vaibhav@flixora.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#E50914] hover:bg-[#ff2232] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          {!isSignUp && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={demoLogin}
                className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E50914]" />
                <span>Instant 1-Click Demo Login (Vaibhav)</span>
              </button>
            </div>
          )}

          {/* Toggle Login / Sign Up */}
          <div className="text-center mt-5 text-xs text-gray-400">
            {isSignUp ? (
              <span>
                Already have a membership?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-white font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to FLIXORA?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-white font-bold hover:underline ml-1"
                >
                  Sign Up now
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
