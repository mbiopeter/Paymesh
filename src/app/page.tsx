"use client";

import React, { useState, useSyncExternalStore, useCallback } from 'react';
import ProtectedLayout from "@/component/layouts";
import WindowContainer from "@/component/modal"; 
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
    ArrowUpRight, ArrowDownLeft, Users, 
    ShoppingCart, TrendingUp, DollarSign, Fuel, 
    Utensils, ShoppingBag, UserCircle, Calendar,
} from 'lucide-react';

const DUMMY_DATA = {
    balance: {
        total: 1500,
        lastFour: "2325",
    },
    spendings: [
        { name: 'Jan', value: 100 }, { name: 'Feb', value: 150 }, { name: 'Mar', value: 120 },
        { name: 'Apr', value: 200 }, { name: 'May', value: 180 }, { name: 'Jun', value: 250 },
        { name: 'Jul', value: 320 }, { name: 'Aug', value: 210 }, { name: 'Sep', value: 280 },
        { name: 'Oct', value: 190 }, { name: 'Nov', value: 230 }, { name: 'Dec', value: 170 },
    ],
    barStats:  [
        { name: 'Jan', inco: 40, expe: 30 },
        { name: 'Feb', inco: 70, expe: 40 },
        { name: 'Mar', inco: 45, expe: 55 },
        { name: 'Apr', inco: 90, expe: 60 },
        { name: 'May', inco: 65, expe: 45 },
        { name: 'Jun', inco: 30, expe: 20 },
        { name: 'Jul', inco: 50, expe: 40 },
        { name: 'Aug', inco: 60, expe: 35 },
        { name: 'Sep', inco: 80, expe: 50 },
        { name: 'Oct', inco: 55, expe: 25 },
        { name: 'Nov', inco: 70, expe: 45 },
        { name: 'Dec', inco: 95, expe: 60 },
    ],
    miniStats: [
        { title: "Customers", val: "20.032", icon: <Users size={16}/>, trend: "up" as const },
        { title: "Orders", val: "350", icon: <ShoppingCart size={16}/>, trend: "up" as const },
        { title: "Growth", val: "25%", icon: <TrendingUp size={16}/>, trend: "down" as const },
        { title: "Revenue", val: "$ 3,540", icon: <DollarSign size={16}/>, trend: "up" as const },
    ],
    transactions: [
        { icon: <Fuel size={18}/>, name: "Gas Station", time: "1 hours ago", price: "$ 10.00", type:'Income' },
        { icon: <UserCircle size={18}/>, name: "Transfer to Lorem", time: "2 hours ago", price: "-$ 60.00",type:'Expenses' },
        { icon: <Utensils size={18}/>, name: "Food", time: "3 hours ago", price: "-$ 8.00", type:'Expenses' },
        { icon: <ShoppingBag size={18}/>, name: "Online Shopping", time: "4 hours ago", price: "-$ 45.00", type:'Expenses' },
    ],
    performance: [
        { name: 'Completed', value: 70, color: '#44C0C7' },
        { name: 'Pending', value: 30, color: '#F36B6B' },
    ],
    userHighlights: [
        { amount: "$280.00", label: "45% Increase", trend: "up" as const },
        { amount: "$60.00", label: "15% Decrease", trend: "down" as const },
    ]
};

// --- HELPER TO AVOID CASCADING RENDERS ---
const emptySubscribe = () => () => {};
function useIsClient() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function HomePage() {
    const isClient = useIsClient();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const closeModal = useCallback(() => setActiveModal(null), []);
    const handleFocus = useCallback(() => {}, []); 

    return (
        <ProtectedLayout>
            <div className="flex flex-col gap-4 p-2 overflow-y-auto h-full w-full">
                <div className='grid grid-cols-[repeat(12,1fr)] gap-4'>
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                        <div className="bg-white p-3 rounded-sm flex justify-between items-center shadow-sm">
                            <ActionButton icon={<ArrowUpRight size={16} />} label="Transfer" onClick={() => setActiveModal('transfer')} />
                            <ActionButton icon={<ArrowDownLeft size={16} />} label="Withdraw" onClick={() => setActiveModal('withdraw')} />
                            <ActionButton icon={<DollarSign size={16} />} label="Deposit" onClick={() => setActiveModal('deposit')} />
                        </div>

                        <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-gray-500 font-bold text-sm">My Balance</h3>
                            </div>
                            <div className="flex flex-col items-center py-2">
                                <div className="relative mb-2">
                                    <div className="w-16 h-12 bg-[#f38237] rounded-sm flex items-center justify-center shadow-inner">
                                        <div className="w-6 h-2 bg-white/30 rounded-full mb-2"></div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 flex gap-1">
                                        <div className="w-3 h-3 bg-teal-600 rounded-full border-2 border-white"></div>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs tracking-2 mb-4">xxxx {DUMMY_DATA.balance.lastFour}</p>
                                <div className="bg-gray-100/80 px-8 py-2 rounded-full font-black text-sm text-gray-800">
                                    KES {DUMMY_DATA.balance.total.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-9">
                        <div className="bg-white p-4 rounded-sm shadow-sm h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    Spendings <span className="text-gray-700 font-medium text-sm">$ {DUMMY_DATA.balance.total.toLocaleString()} <span className="text-red-400">↓</span></span>
                                </h3>
                                <div className="bg-teal-600 text-white text-[10px] px-4 py-1.5 rounded-full flex items-center gap-2 font-bold cursor-pointer">
                                    <Calendar size={12} /> Lifetime
                                </div>
                            </div>
                            
                            <div className="w-full h-64">
                                {isClient && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={DUMMY_DATA.spendings}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22B8C5" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#22B5C5" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#48494B', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#48494B', fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                            <Area type="monotone" dataKey="value" stroke="#21A792" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-[repeat(12,1fr)] gap-4'>
                    <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-white p-4 rounded-sm shadow-sm">
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className="text-sm font-bold text-gray-800">Weekly Activity</h3>
                                <div className="bg-teal-600 text-white text-[10px] px-4 py-1.5 rounded-full flex items-center gap-2 font-bold cursor-pointer">
                                    <Calendar size={12} /> This Year
                                </div>
                            </div>
                            <div className="h-40 w-full">
                                {isClient && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={DUMMY_DATA.barStats}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9fafb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                            <Tooltip cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="inco" fill="#25BDAB" radius={[2, 2, 0, 0]} barSize={8} />
                                            <Bar dataKey="expe" fill="#F36B6B" radius={[2, 2, 0, 0]} barSize={8} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                        {DUMMY_DATA.miniStats.map((stat, idx) => (
                            <StatMini key={idx} {...stat} />
                        ))}
                    </div>

                    <div className="col-span-12 lg:col-span-4 bg-white p-4 rounded-sm shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-8">Last Transaction</h3>
                        <div className="space-y-7">
                            {DUMMY_DATA.transactions.map((t, idx) => (
                                <TransactionItem key={idx} {...t} />
                            ))}
                        </div>
                    </div>

                    {/* RESTORED DATA INFORMATION SECTION WITH CHART */}
                    <div className="col-span-12 lg:col-span-3 bg-white p-4 rounded-sm shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-1">Data information</h3>
                        <p className="text-xs text-gray-400 mb-8">System performance overview</p>
                        
                        <div className="flex justify-around mb-10">
                            {DUMMY_DATA.userHighlights.map((user, idx) => (
                                <UserInfo key={idx} {...user} />
                            ))}
                        </div>

                        <div className="flex items-center gap-5 border-t border-gray-50 pt-8">
                            <div className="relative w-24 h-24">
                                {isClient && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={DUMMY_DATA.performance}
                                                innerRadius={30}
                                                outerRadius={45}
                                                paddingAngle={2}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={450}>
                                                {DUMMY_DATA.performance.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-700">
                                    {DUMMY_DATA.performance[0].value}%
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Performance</h4>
                                <div className="text-[10px] text-gray-400 flex flex-col gap-1 mt-1">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2aabb4]"></span> income</span>
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F36B6B]"></span> expenses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {activeModal === 'transfer' && (
                <WindowContainer id="transfer" title="Fund Transfer" onClose={closeModal} onFocus={handleFocus} zIndex={100} initialState={{ width: 400, height: 300 }}>
                    <div className="p-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-700 uppercase">Recipient name</label>
                        <input type="text" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xs outline-none" placeholder="john doe" />
                        <label className="text-[10px] font-black text-gray-700 uppercase">Amount</label>
                        <input type="text" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xs outline-none"/>
                        <button className="w-full py-2 bg-[#f38237] text-white rounded-xs font-bold">Confirm Transfer</button>
                    </div>
                </WindowContainer>
            )}

            {activeModal === 'withdraw' && (
                <WindowContainer id="withdraw" title="Withdraw Funds" onClose={closeModal} onFocus={handleFocus} zIndex={100} initialState={{ width: 400, height: 300 }}>
                    <div className="p-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-700 uppercase">Amount</label>
                        <input type="number" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xs outline-none" placeholder="0.00" />
                        <label className="text-[10px] font-black text-gray-700 uppercase">Detailes</label>
                        <input type="text" className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xs outline-none" placeholder="Details" />
                        <button className="w-full py-2 bg-red-600 text-white rounded-xs font-bold">Process Withdrawal</button>
                    </div>
                </WindowContainer>
            )}

            {activeModal === 'deposit' && (
                <WindowContainer id="deposit" title="Deposit Money" onClose={closeModal} onFocus={handleFocus} zIndex={100} initialState={{ width: 420, height: 300 }}>
                    <div className="p-2 space-y-5">
                        <label className="text-[10px] font-black text-gray-700 uppercase">Amount</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-100 rounded-xs outline-none text-teal-600" />
                        <label className="text-[10px] font-black text-gray-700 uppercase">Details</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-100 rounded-xs outline-none text-teal-600" placeholder="Details" />
                        <button className="w-full py-2 bg-teal-600 text-white rounded-xs font-bold">Add Funds</button>
                    </div>
                </WindowContainer>
            )}

        </ProtectedLayout>
    );
}

// --- HELPER COMPONENTS ---

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <div onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`${label === 'Transfer' ? 'bg-[#f38237]':label === 'Withdraw' ? 'bg-red-600':'bg-teal-600'} p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold text-gray-700">{label}</span>
        </div>
    );
}

function StatMini({ title, val, icon, trend }: { title: string; val: string; icon: React.ReactNode; trend: 'up' | 'down' }) {
    return (
        <div className="bg-white py-2 px-4 rounded-sm border border-gray-50 relative shadow-sm overflow-hidden">
            <div className="flex justify-between items-start mb-2 ">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">{title}</p>
                <div className={`h-14 w-14 flex items-end justify-start p-4 absolute -right-4 -top-4 rounded-3xl text-white ${trend === 'up' ? 'bg-teal-600' : 'bg-red-400'}`}>
                    {trend === 'up' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                </div>
            </div>
            <div className="text-gray-700 p-2 bg-gray-50 w-fit rounded-lg mb-1">{icon}</div>
            <p className="text-sm font-black text-gray-800">{val}</p>
        </div>
    );
}

function TransactionItem({ icon, name, time, price, type }: { icon: React.ReactNode; name: string; time: string; price: string; type: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 text-white rounded-full flex items-center justify-center shadow-lg ${type === 'Income' ? 'bg-teal-600':'bg-red-400'}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-800">{name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{time}</p>
                </div>
            </div>
            <span className={`text-xs font-bold ${type === 'Income' ? 'text-teal-600':'text-red-400'}`}>{price}</span>
        </div>
    );
}

function UserInfo({ amount, label, trend }: { amount: string; label: string; trend: 'up' | 'down' }) {
    return (
        <div className="text-center">
            <div className={`w-12 h-12 ${trend === 'up' ? 'bg-teal-600':'bg-red-400'} rounded-full mx-auto mb-3 flex items-center justify-center text-white border border-gray-100`}>
                <UserCircle size={24} />
            </div>
            <p className="font-black text-sm text-gray-800">{amount}</p>
            <p className={`text-[10px] font-bold ${trend === 'up' ? 'text-teal-600' : 'text-red-400'}`}>
                {trend === 'up' ? '↑' : '↓'} {label}
            </p>
        </div>
    );
}