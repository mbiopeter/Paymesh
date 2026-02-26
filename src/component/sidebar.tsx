"use client";

import React from 'react';
import { 
    LayoutDashboard, 
    CreditCard, 
    Key, 
    Fingerprint, 
    LogOut,
    Wallet,
    ChevronRight,
    Wallpaper
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', route: "/", icon: <LayoutDashboard size={20} /> },
        { name: 'Business', route: "/business", icon: <Wallet size={20} /> },
        { name: 'Merchant', route: "/merchant", icon: <Wallpaper size={20} /> },
        { name: 'Credentials', route: "/credentials", icon: <Fingerprint size={20} /> },
        { name: 'API Keys', route: "/apiKeys", icon: <Key size={20} /> },
        { name: 'Billing', route: "/billing", icon: <CreditCard size={20} /> },
    ];

    return (
        <aside className="md:flex hidden flex-col w-64 h-[calc(100vh-5rem)] bg-[#113a48] text-white p-4 rounded-2xl my-2 ml-2 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-teal-400/5 rounded-full blur-2xl"></div>
            <div className="relative flex flex-col items-center py-2 mb-2 border-b border-white/10">
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 border-2 border-dashed border-teal-400 rounded-full animate-[spin_15s_linear_infinite] group-hover:border-teal-400/60 transition-colors"></div>
                    <div className="w-15 h-15 bg-linear-to-tr from-teal-50 to-white rounded-full flex items-center justify-center m-2 shadow-inner">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg border border-gray-100">
                            <span className="text-teal-500 font-black text-xl tracking-tighter">PM</span>
                        </div>
                    </div>
                </div>
                <h2 className="mt-4 text-[10px] font-black tracking-[0.3em] uppercase text-teal-400/80">
                    Paymesh Enterprise
                </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.route;
                    return (
                        <button
                            key={item.name}
                            onClick={() => router.push(item.route)}
                            className={`w-full flex items-center justify-between group px-4 py-3 rounded-sm transition-all duration-200 outline-none
                                ${isActive 
                                    ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/40' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? 'text-white' : 'text-teal-500 group-hover:text-teal-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-white/50" />}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 px-2 space-y-4">
                <div className="bg-white/5 rounded-sm p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-300">SYSTEM LIVE</span>
                    </div>
                    <p className="text-[9px] text-gray-500">API Latency: 24ms</p>
                </div>
                <button 
                    onClick={() => console.log('logout')}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#0a2e1a] rounded-sm font-bold text-sm hover:bg-teal-50 transition-all active:scale-[0.98] shadow-lg shadow-black/20">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;