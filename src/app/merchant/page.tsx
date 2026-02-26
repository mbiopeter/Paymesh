"use client";

import React, { useState, useMemo } from "react";
import ProtectedLayout from "@/component/layouts";
import WindowContainer from "@/component/modal";
import { 
    Smartphone, Zap, Loader2, Plus, Coins, Wallet, Search, CheckCircle2, 
    XCircle, Clock, ArrowUpRight, Filter, ChevronLeft, ChevronRight 
} from "lucide-react";

const INITIAL_TRANSACTIONS = [
    { id: "TXN001", customer: "254712345678", amount: 1500, status: "success", time: "10:30 AM" },
    { id: "TXN002", customer: "254799888777", amount: 50, status: "pending", time: "11:45 AM" },
    { id: "TXN003", customer: "254711222333", amount: 200, status: "failed", time: "12:15 PM" },
    { id: "TXN004", customer: "254700000001", amount: 300, status: "success", time: "01:00 PM" },
    { id: "TXN005", customer: "254700000002", amount: 450, status: "pending", time: "01:15 PM" },
    { id: "TXN006", customer: "254700000003", amount: 1000, status: "success", time: "02:30 PM" },
];

const ITEMS_PER_PAGE = 5;

const Page = () => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [accountBalance, setAccountBalance] = useState(75.00);
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [customerPhone, setCustomerPhone] = useState("");
    const [requestAmount, setRequestAmount] = useState("");

    // 1. Calculate Global Summary (based on all transactions)
    const summary = useMemo(() => {
        return {
            total: transactions.length,
            success: transactions.filter(t => t.status === "success").length,
            pending: transactions.filter(t => t.status === "pending").length,
            failed: transactions.filter(t => t.status === "failed").length,
            volume: transactions.filter(t => t.status === "success").reduce((acc, curr) => acc + curr.amount, 0)
        };
    }, [transactions]);

    // 2. Filter Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.customer.includes(searchTerm) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [transactions, searchTerm, statusFilter]);

    // 3. Pagination Logic
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const handlePaymentRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (accountBalance < 5) {
            setIsRequestModalOpen(false);
            setIsTopUpModalOpen(true);
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            const newTx = {
                id: `TXN${Math.floor(Math.random() * 1000)}`,
                customer: "254" + customerPhone,
                amount: parseInt(requestAmount),
                status: "pending",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setTransactions([newTx, ...transactions]);
            setAccountBalance(prev => prev - 5);
            setIsSaving(false);
            setIsRequestModalOpen(false);
            setCustomerPhone("");
            setRequestAmount("");
            setCurrentPage(1);
        }, 1500);
    };

    return (
        <ProtectedLayout>
            <div className="w-full mx-auto px-4 py-4 space-y-4">
                
                {/* Header & Main Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-lg font-black text-gray-800 tracking-tight">Merchant Dashboard</h1>
                        <p className="text-xs text-gray-500">Manual STK Push collection portal.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-xs flex items-center gap-3">
                            <Wallet className="text-teal-600" size={20} />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Service Credits</p>
                                <p className="text-sm font-black text-gray-900 leading-none">KES {accountBalance}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsRequestModalOpen(true)}
                            className="bg-teal-600 hover:bg-black text-white px-6 py-3 rounded-xs font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-teal-900/20">
                            <Plus size={18} /> Request Payment
                        </button>
                    </div>
                </div>

                {/* Daily Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xs border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={16}/></div>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Success</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{summary.success}</p>
                        <p className="text-xs text-gray-400 font-medium">Successful Requests</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xs border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock size={16}/></div>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{summary.pending}</p>
                        <p className="text-xs text-gray-400 font-medium">Awaiting PIN entry</p>
                    </div>

                    <div className="bg-white p-4 rounded-xs border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-red-50 rounded-lg text-red-600"><XCircle size={16}/></div>
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Failed</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{summary.failed}</p>
                        <p className="text-xs text-gray-400 font-medium">Cancelled/Timed out</p>
                    </div>

                    <div className="bg-white p-4 rounded-xs border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white/20 rounded-lg text-amber-500"><Coins size={16}/></div>
                        </div>
                        <p className="text-lg font-black">KES {summary.volume.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 font-medium">Total Volume Today</p>
                    </div>
                </div>

                {/* Transactions Table Section */}
                <div className="bg-white rounded-xs border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-sm text-gray-800">Todays Transactions</h3>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search Phone or ID..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-teal-500/20"
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}/>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                                <Filter size={14} className="text-gray-400" />
                                <select 
                                    className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}>
                                    <option value="all">All Status</option>
                                    <option value="success">Success</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-[12px] text-gray-800 uppercase tracking-widest">
                                    <th className="px-6 py-4 font-medium text-xs">Transaction ID</th>
                                    <th className="px-6 py-4 font-medium text-xs">Customer</th>
                                    <th className="px-6 py-4 font-medium text-xs">Amount</th>
                                    <th className="px-6 py-4 font-medium text-xs">Status</th>
                                    <th className="px-6 py-4 font-medium text-xs">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedTransactions.length > 0 ? (
                                    paginatedTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{tx.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><Smartphone size={14}/></div>
                                                    <span className="text-xs font-bold text-gray-700">+{tx.customer}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-black text-gray-900">KES {tx.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                                    tx.status === "success" ? "bg-green-100 text-green-700" :
                                                    tx.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-400">{tx.time}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-xs italic">
                                            No transactions found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">
                                Showing page <span className="text-gray-900 font-bold">{currentPage}</span> of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-opacity">
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-opacity">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Payment Modal */}
            {isRequestModalOpen && (
                <WindowContainer
                    id="request-payment"
                    title="Initiate STK Push"
                    onClose={() => setIsRequestModalOpen(false)}
                    onFocus={() => {}}
                    zIndex={110}
                    initialState={{ width: 400, height: 380 }} >
                    <div className="p-6 bg-white h-full flex flex-col">
                        <div className="grow space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xs border border-teal-100 flex gap-3">
                                <Zap className="text-teal-600 shrink-0" size={18} />
                                <p className="text-[11px] text-teal-900 leading-relaxed">
                                    This will trigger an M-Pesa popup on the customers phone.
                                </p>
                            </div>

                            <form id="pay-request-form" onSubmit={handlePaymentRequest} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Customer Number</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">+254</span>
                                        <input
                                            type="tel"
                                            maxLength={9}
                                            required
                                            className="w-full pl-16 pr-4 py-2 text-xs border border-gray-200 rounded-xs outline-none focus:ring-2 focus:ring-teal-500/20 font-bold"
                                            placeholder="700123456"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Amount (KES)</label>
                                    <div className="relative">
                                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full pl-12 pr-4 py-2 text-xs border border-gray-200 rounded-xs outline-none focus:ring-2 focus:ring-teal-500/20 font-black"
                                            placeholder="0.00"
                                            value={requestAmount}
                                            onChange={(e) => setRequestAmount(e.target.value)}/>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <button 
                                form="pay-request-form"
                                type="submit"
                                disabled={isSaving || customerPhone.length < 9}
                                className="w-full py-4 bg-teal-600 text-white text-xs rounded-xs font-bold flex justify-center items-center gap-2 hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg">
                                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <><ArrowUpRight size={18}/> Send STK Request</>}
                            </button>
                        </div>
                    </div>
                </WindowContainer>
            )}

            {/* Top-up Modal */}
            {isTopUpModalOpen && (
                <WindowContainer
                    id="topup"
                    title="Recharge Credits"
                    onClose={() => setIsTopUpModalOpen(false)}
                    onFocus={() => {}}
                    zIndex={120}
                    initialState={{ width: 400, height: 450 }} >
                    <div className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                            <Wallet size={32} />
                        </div>
                        <h3 className="font-black text-gray-800 text-xl">Insufficient Credits</h3>
                        <p className="text-xs text-gray-500">You need a minimum balance of KES 5.00 to send a request. Please top up your account.</p>
                        <button 
                            className="w-full py-3 bg-black text-white rounded-xs font-bold"
                            onClick={() => { /* Logic to handle deposit */ }}
                        >
                            Deposit KES 50 (Min)
                        </button>
                    </div>
                </WindowContainer>
            )}

        </ProtectedLayout>
    );
};

export default Page;