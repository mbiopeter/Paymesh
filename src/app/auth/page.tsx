"use client";

import React, { useState } from 'react';
import { 
    Mail, Lock, User, ArrowRight, CheckCircle2, 
    Fingerprint, Smartphone, ChevronLeft, ShieldCheck 
} from 'lucide-react';
import Image from 'next/image';

type AuthState = 'login' | 'register' | 'verify' | 'forgot-password';

const AuthPage = () => {
    const [view, setView] = useState<AuthState>('login');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        // Move to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xs shadow-xl overflow-hidden border border-gray-100 transition-all duration-500">
                
                {/* Brand Header */}
                <div className="p-6 text-center bg-[#113a48] relative">
                    <div className="flex justify-center mb-2">
                        <div className="bg-teal-500 p-3 rounded-xs shadow-lg">
                        <ShieldCheck className="text-white" size={26} />
                        </div>
                    </div>
                    <h2 className="text-white font-black text-xl tracking-tight">Paymesh Auth</h2>
                    <p className="text-teal-200/70 text-xs mt-1 uppercase font-bold tracking-widest">Secure Gateway</p>
                </div>

                <div className="p-4">
                    {/* View: LOGIN */}
                    {view === 'login' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-black text-gray-800">Welcome Back</h3>
                                <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
                            </div>
                            <AuthInput icon={<Mail size={18}/>} type="email" placeholder="Email Address" />
                            <AuthInput icon={<Lock size={18}/>} type="password" placeholder="Password" />
                            
                            <div className="flex justify-end">
                                <button onClick={() => setView('forgot-password')} className="text-xs font-bold text-teal-600 hover:text-teal-700">
                                    Forgot Password?
                                </button>
                            </div>

                            <button onClick={() => setView('verify')} className="w-full py-2 bg-[#f38237] text-white rounded-xs font-black shadow-lg shadow-orange-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                SIGN IN <ArrowRight size={18} />
                            </button>

                            <p className="text-center text-gray-500 text-xs font-medium">
                                Don`t have an account? 
                                <button onClick={() => setView('register')} className="text-teal-600 font-black ml-1">REGISTER</button>
                            </p>
                        </div>
                    )}

                    {/* View: REGISTER */}
                    {view === 'register' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-gray-800">Create Account</h3>
                                <p className="text-gray-400 text-sm">Join Paymesh and start managing assets</p>
                            </div>
                            <AuthInput icon={<User size={18}/>} type="text" placeholder="Full Name" />
                            <AuthInput icon={<Mail size={18}/>} type="email" placeholder="Email Address" />
                            <AuthInput icon={<Lock size={18}/>} type="password" placeholder="Create Password" />
                            
                            <button className="w-full py-2 bg-teal-600 text-white rounded-xs font-black shadow-lg shadow-teal-100 hover:scale-[1.02] transition-transform">
                                CREATE ACCOUNT
                            </button>

                            <p className="text-center text-gray-500 text-xs font-medium">
                                Already a member? 
                                <button onClick={() => setView('login')} className="text-teal-600 font-black ml-1">LOGIN</button>
                            </p>
                        </div>
                    )}

                    {/* View: 6-CODE VERIFICATION */}
                    {view === 'verify' && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-500">
                            <button onClick={() => setView('login')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-2">
                                <ChevronLeft size={16}/> <span className="text-[10px] font-bold uppercase">Back</span>
                            </button>
                            <div className="text-center">
                                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                                    <Smartphone size={26} />
                                </div>
                                <h3 className="text-sm font-black text-gray-800">Verify Identity</h3>
                                <p className="text-gray-400 text-xs px-4">We`ve sent a 6-digit code to your registered device</p>
                            </div>

                            <div className="flex justify-between gap-2">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                        className="w-10 h-10 text-center text-sm font-black text-gray-800 bg-gray-50 border-2 border-teal-200 focus:border-teal-600 focus:bg-white rounded-xs outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <button className="w-full py-2 bg-[#113a48] text-white rounded-xs font-black shadow-lg hover:opacity-90 transition-opacity">
                                VERIFY CODE
                            </button>

                            <p className="text-center text-xs font-bold text-gray-400">
                                Didn`t receive code? <button className="text-teal-600 underline">Resend</button>
                            </p>
                        </div>
                    )}

                    {/* View: FORGOT PASSWORD */}
                    {view === 'forgot-password' && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
                            <button onClick={() => setView('login')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-2">
                                <ChevronLeft size={16}/> <span className="text-[10px] font-bold uppercase">Back to Login</span>
                            </button>
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-gray-800">Reset Password</h3>
                                <p className="text-gray-400 text-sm">Enter your email to receive a recovery link</p>
                            </div>
                            <AuthInput icon={<Mail size={18}/>} type="email" placeholder="Email Address" />
                            
                            <button className="w-full py-2 bg-teal-600 text-white rounded-xs font-black shadow-lg">
                                SEND RESET LINK
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Security Note */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} className="text-teal-600" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
            </div>
        </div>
    );
};

// --- Helper Component ---
const AuthInput = ({ icon, type, placeholder }: { icon: React.ReactNode, type: string, placeholder: string }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
            {icon}
        </div>
        <input 
            type={type}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xs outline-none focus:ring-2 focus:ring-teal-600/10 focus:bg-white focus:border-teal-600 transition-all text-sm font-medium"
        />
    </div>
);

export default AuthPage;