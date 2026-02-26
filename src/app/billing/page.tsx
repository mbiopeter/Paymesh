"use client";

import React, { useState, useMemo } from "react";
import ProtectedLayout from "@/component/layouts";
import WindowContainer from "@/component/modal";
import { 
    Check, Smartphone, Loader2, Plus, Phone, 
    Trash2, Coins, Wallet, ChevronLeft, 
    ChevronRight, Search 
} from "lucide-react";

interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    priceValue: number;
    features: string[];
}

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        description: "Get started and test Paymesh APIs",
        price: "KES 0",
        priceValue: 0,
        features: [
            "Up to KES 40,000 total processed",
            "Up to 50 transactions",
            "1 API key",
            "Basic webhook support",
            "Community support",
        ],
    },
    {
        id: "starter",
        name: "Starter",
        description: "Best for small merchants and individuals",
        price: "KES 5 per successful transaction",
        priceValue: 5,
        features: [
            "Up to KES 300,000 total processed per month",
            "Up to 1,000 transactions per month",
            "2 API keys",
            "Standard webhooks",
            "Email support",
        ],
    },
    {
        id: "growth",
        name: "Growth",
        description: "Predictable monthly pricing for growing businesses",
        price: "KES 250 / month",
        priceValue: 3,
        features: [
            "Up to KES 500,000 total processed per month",
            "Up to 1,000 transactions per month",
            "5 API keys",
            "Advanced webhooks",
            "Free transactions for amounts below KES 100",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "High-volume businesses and platforms",
        price: "KES 400 / month",
        priceValue: 1.5,
        features: [
            "Unlimited total processed amount",
            "Unlimited transactions",
            "Unlimited API keys",
            "Advanced analytics",
            "Priority support",
        ],
    },
];

const Page = () => {
    const [activePlan, setActivePlan] = useState<string>("free");
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [accountBalance, setAccountBalance] = useState(0);
    const [topUpAmount, setTopUpAmount] = useState<string>("");
    const [mpesaNumbers, setMpesaNumbers] = useState([
        { id: 1, phone: "254712345678", isDefault: true },
        { id: 2, phone: "254700000000", isDefault: false },
        { id: 3, phone: "254711111111", isDefault: false },
        { id: 4, phone: "254722222222", isDefault: false },
        { id: 5, phone: "254755555555", isDefault: false },
    ]);
    const [selectedPhoneId, setSelectedPhoneId] = useState<number | null>(1);
    const [newPhone, setNewPhone] = useState("");

    // Top-Up Modal Pagination & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [modalPage, setModalPage] = useState(1);
    const modalItemsPerPage = 3;

    // Filtered Numbers for Modal
    const filteredModalNumbers = useMemo(() => {
        return mpesaNumbers.filter(n => n.phone.includes(searchQuery));
    }, [mpesaNumbers, searchQuery]);

    const totalModalPages = Math.ceil(filteredModalNumbers.length / modalItemsPerPage);
    const paginatedModalNumbers = filteredModalNumbers.slice(
        (modalPage - 1) * modalItemsPerPage,
        modalPage * modalItemsPerPage
    );

    // Main Page Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(mpesaNumbers.length / itemsPerPage);
    const paginatedNumbers = mpesaNumbers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePlanSelection = (plan: Plan) => {
        if (plan.id === "free") {
            setActivePlan("free");
            return;
        }

        if (accountBalance < plan.priceValue) {
            setIsTopUpModalOpen(true);
        } else {
            if (plan.id !== "growth") {
                setAccountBalance(prev => prev - plan.priceValue);
            }
            setActivePlan(plan.id);
        }
    };

    const handleTopUp = () => {
        const amount = parseInt(topUpAmount);
        if (!amount || amount < 50) return;

        setIsSaving(true);
        setTimeout(() => {
            setAccountBalance(prev => prev + amount);
            setIsSaving(false);
            setIsTopUpModalOpen(false);
            setTopUpAmount("");
        }, 2000);
    };

    const handleAddMpesa = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhone) return;
        setIsSaving(true);
        setTimeout(() => {
            const newEntry = {
                id: Date.now(),
                phone: "254" + newPhone,
                isDefault: mpesaNumbers.length === 0
            };
            setMpesaNumbers([...mpesaNumbers, newEntry]);
            setNewPhone("");
            setIsSaving(false);
            setIsBillingModalOpen(false);
        }, 1200);
    };

    const deleteNumber = (id: number) => {
        if (mpesaNumbers.length === 1) return alert("You must have at least one payment method.");
        setMpesaNumbers(mpesaNumbers.filter(n => n.id !== id));
        if (paginatedNumbers.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <ProtectedLayout>
            <div className="w-full mx-auto px-4 py-4 space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-sm font-black text-gray-800 tracking-tight">
                            Billing & Subscriptions
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Balance-based billing management.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`${accountBalance < 50 ? 'bg-red-50 border-red-200 text-red-700':'bg-teal-50 border-teal-200 text-teal-900'} border px-4 py-2 rounded-xs flex items-center gap-3 transition-colors`}>
                            <Wallet size={20} className={accountBalance < 50 ? 'text-red-500' : 'text-teal-600'}/>
                            <div>
                                <p className="text-[10px] uppercase font-medium opacity-70">Balance</p>
                                <p className="text-xs font-black leading-none">KES {accountBalance}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsTopUpModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xs shadow-sm transition-all active:scale-95">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border flex flex-col justify-between rounded-sm p-2 shadow-sm transition-all duration-200 ${
                                activePlan === plan.id 
                                ? "border-teal-600 ring-2 ring-teal-600 bg-teal-50/30" 
                                : "border-gray-100 bg-white hover:border-gray-200"
                            }`}>
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800 tracking-tight text-sm">{plan.name}</h3>
                                    {activePlan === plan.id && (
                                        <span className="text-[10px] font-medium bg-teal-600 text-white px-2 py-0.5 rounded-full">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-4 h-8">{plan.description}</p>
                                <div className="text-sm font-black text-gray-900 mb-4">{plan.price}</div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                            <Check size={12} className="text-teal-600 mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handlePlanSelection(plan)}
                                className={`w-full py-2.5 rounded-xs text-xs font-bold transition-all active:scale-[0.98] ${
                                    activePlan === plan.id 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-teal-600 text-white hover:bg-teal-500 shadow-md"}`}
                                disabled={activePlan === plan.id}>
                                {activePlan === plan.id ? "Active Plan" : "Select Plan"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* M-Pesa Management Section */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">M-Pesa Payment Methods</h3>
                        <button 
                            onClick={() => setIsBillingModalOpen(true)}
                            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xs text-xs font-bold hover:bg-black transition-all">
                            <Plus size={14} /> Add Number
                        </button>
                    </div>
                    
                    <div className="p-2 min-h-60">
                        {paginatedNumbers.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xs transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
                                        <Smartphone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">+{item.phone}</p>
                                        {item.isDefault && <span className="text-[9px] bg-teal-100 text-teal-700 px-1.5 rounded-full py-px font-bold">DEFAULT</span>}
                                    </div>
                                </div>
                                <button onClick={() => deleteNumber(item.id)} className="text-gray-300 hover:text-red-500 p-2">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Showing {paginatedNumbers.length} numbers</p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-20"><ChevronLeft size={16}/></button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 text-xs font-bold rounded ${currentPage === i + 1 ? 'bg-teal-600 text-white' : 'text-gray-400'}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-20"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Up Modal with Filter and Pagination */}
            {isTopUpModalOpen && (
                <WindowContainer
                    id="topup-modal"
                    title="Top Up Account Balance"
                    onClose={() => setIsTopUpModalOpen(false)}
                    onFocus={() => {}}
                    zIndex={110}
                    initialState={{ width: 450, height: 470 }} >
                    <div className="p-4 bg-white h-full flex flex-col">
                        <div className=" grow">
                            {/* Filter Input */}
                            <div className="space-y-2 pb-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase">1. Search & Select Number</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="Filter numbers..."
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xs text-xs outline-none focus:ring-2 focus:ring-teal-500/10"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setModalPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Paginated Number List */}
                            <div className="space-y-2 min-h-42">
                                {paginatedModalNumbers.length > 0 ? (
                                    paginatedModalNumbers.map((num) => (
                                        <div 
                                            key={num.id}
                                            onClick={() => setSelectedPhoneId(num.id)}
                                            className={`flex items-center justify-between p-3 rounded-xs border cursor-pointer transition-all ${
                                                selectedPhoneId === num.id 
                                                ? "border-teal-500 bg-teal-50" 
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <Smartphone size={16} className={selectedPhoneId === num.id ? "text-teal-600" : "text-gray-400"} />
                                                <span className="text-xs font-bold text-gray-700">+{num.phone}</span>
                                            </div>
                                            {selectedPhoneId === num.id && <Check size={16} className="text-teal-600" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center text-gray-400 text-xs italic">No numbers found</div>
                                )}
                            </div>

                            {/* Modal Pagination Controls */}
                            {totalModalPages > 1 && (
                                <div className="flex items-center justify-end gap-4 pb-2 border-b border-gray-50">
                                    <button 
                                        onClick={() => setModalPage(p => Math.max(1, p - 1))}
                                        disabled={modalPage === 1}
                                        className="text-gray-400 disabled:opacity-20"><ChevronLeft size={16} /></button>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Page {modalPage} of {totalModalPages}</span>
                                    <button 
                                        onClick={() => setModalPage(p => Math.min(totalModalPages, p + 1))}
                                        disabled={modalPage === totalModalPages}
                                        className="text-gray-400 disabled:opacity-20"><ChevronRight size={16} /></button>
                                </div>
                            )}

                            {/* Amount Input */}
                            <div className="space-y-2 pt-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase">2. Amount (Min KES 50)</label>
                                <div className="relative">
                                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="number"
                                        className={`w-full pl-12 pr-4 text-xs py-2 border rounded-xs focus:ring-2 outline-none font-bold ${
                                            topUpAmount && parseInt(topUpAmount) < 50 ? "border-red-500" : "border-gray-200"
                                        }`}
                                        placeholder="Enter amount"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                    />
                                </div>
                                {topUpAmount && parseInt(topUpAmount) < 50  && (
                                    <p className="text-[10px] text-red-500 font-bold">Minimum top-up amount is KES 50</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={handleTopUp}
                                disabled={isSaving || !topUpAmount || parseInt(topUpAmount) < 50}
                                className="w-full py-3 text-xs bg-teal-600 text-white rounded-xs font-bold flex justify-center items-center gap-2 hover:bg-teal-700 disabled:opacity-50 transition-all">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Complete Top Up"}
                            </button>
                        </div>
                    </div>
                </WindowContainer>
            )}

            {/* Add Number Modal */}
            {isBillingModalOpen && (
                <WindowContainer
                    id="add-mpesa-modal"
                    title="Add M-Pesa Number"
                    onClose={() => setIsBillingModalOpen(false)}
                    onFocus={() => {}}
                    zIndex={120}
                    initialState={{ width: 400, height: 280 }}    >
                    <div className="p-4 bg-white">
                        <form onSubmit={handleAddMpesa} className="space-y-6">
                            <div className="bg-teal-50 p-4 rounded-xs border border-teal-100 flex gap-3">
                                <Phone className="text-teal-600 shrink-0" size={18} />
                                <p className="text-xs text-teal-900 leading-relaxed font-medium">A KES 1 verification STK Push will be sent.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs border-r pr-3">+254</span>
                                    <input
                                        autoFocus
                                        type="tel"
                                        maxLength={9}
                                        className="w-full pl-16 pr-4 py-2 border border-gray-200 rounded-xs focus:ring-2 focus:ring-teal-600 outline-none font-mono"
                                        placeholder="712345678"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSaving || newPhone.length < 9} className="w-full py-3 bg-teal-600 text-xs text-white rounded-xs font-bold disabled:opacity-50">
                                {isSaving ? <Loader2 size={16} className="animate-spin m-auto" /> : "Verify & Add"}
                            </button>
                        </form>
                    </div>
                </WindowContainer>
            )}
        </ProtectedLayout>
    );
};

export default Page;