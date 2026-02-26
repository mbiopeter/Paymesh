import React, { useState } from 'react';
import {  Plus, Maximize, Bell, Menu, LayoutDashboard, 
    CreditCard, Key, LogOut, X, Wallet, Wallpaper, Fingerprint
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Upbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Dashboard');
    const router = useRouter();

    const menuItems = [
        { name: 'Dashboard', route: "/", icon: <LayoutDashboard size={20} /> },
        { name: 'Business', route: "/business", icon: <Wallet size={20} /> },
        { name: 'Merchant', route: "/merchant", icon: <Wallpaper size={20} /> },
        { name: 'Credentials', route: "/credentials", icon: <Fingerprint size={20} /> },
        { name: 'API Keys', route: "/apiKeys", icon: <Key size={20} /> },
        { name: 'Billing', route: "/billing", icon: <CreditCard size={20} /> },
    ];

    return (
        <>
            {/* Topbar */}
            <header className="flex px-2 flex-col h-10 md:h-15 lg:px-0 md:flex-row border-b justify-center border-b-gray-100 shadow-sm w-full bg-transparent z-60 relative">
                
                {/* Top Row */}
                <div className="flex items-center justify-between w-full py-4">
                    <div className="flex items-center gap-4">
                        {/* Hamburger for Mobile */}
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors md:hidden z-50">
                            {dropdownOpen ? (
                                <X size={22} strokeWidth={2.5} className="text-gray-700" />
                            ) : (
                                <Menu size={22} strokeWidth={2.5} className="text-gray-700" />
                            )}
                        </button>

                        {/* Logo */}
                        <div className='hidden md:block'>
                            <Image 
                                src="/logo.png"  
                                alt="Paymesh"
                                height={40}
                                width={200}
                                className="object-contain"/>
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                        <button className="p-2.5 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Maximize size={18} strokeWidth={2.5} />
                        </button>
                        <div className="relative">
                            <button className="p-2.5 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                                <Bell size={20} strokeWidth={2.5} />
                            </button>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay - Animated via opacity */}
            <div
                className={`fixed inset-0 bg-transparent z-40 transition-opacity duration-300 md:hidden ${
                    dropdownOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setDropdownOpen(false)}>
            </div>

            {/* Floating Mobile Dropdown - Animated via Transform/Opacity */}
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 w-full bg-[#113a48] text-white shadow-2xl rounded-b-xl z-50 p-4 flex flex-col space-y-2 transition-all duration-300 ease-in-out md:hidden ${
                dropdownOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible"}`}>
                {menuItems.map((item) => {
                    const isActive = activeItem === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => { 
                                setActiveItem(item.name); 
                                setDropdownOpen(false);
                                router.push(item.route);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xs transition-all w-full text-left ${
                                isActive 
                                    ? 'bg-teal-600 shadow-inner' 
                                    : 'hover:bg-teal-600/30 opacity-90'
                            }`}>
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </button>
                    );
                })}
                
                <hr className="border-teal-800 my-2" />
                
                <button className="flex items-center justify-center gap-2 w-full bg-white text-teal-900 py-3 rounded-xs text-sm font-bold hover:bg-gray-100 transition-colors">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
};

export default Upbar;