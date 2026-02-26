"use client";

import React, { useState } from 'react';
import ProtectedLayout from '@/component/layouts';
import { 
    CheckCircle2, 
    AlertCircle, 
    Briefcase, 
    ArrowUpRight, 
    ArrowDownRight, 
    Search, 
    ChevronLeft, 
    ChevronRight
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    ResponsiveContainer, 
    XAxis, 
    Tooltip 
} from 'recharts';

const STATS = [
    { label: 'STK Sent', value: '2,506', change: '+2.1%', trend: 'up', icon: <CheckCircle2 className="text-teal-600" />, bg: 'bg-teal-50/50' },
    { label: 'Failed', value: '156', change: '-3.9%', trend: 'down', icon: <AlertCircle className="text-red-500" />, bg: 'bg-red-50/50' },
    { label: 'Successful', value: '2,350', subValue: '8.5ms Avg time', icon: <CheckCircle2 className="text-teal-600" />, bg: 'bg-teal-50/50' },
    { label: 'Revenue', value: '$5,800', hasAction: true, icon: <Briefcase className="text-orange-500" />, bg: 'bg-orange-50/50' },
];

const DETAILED_TRANSACTIONS = Array.from({ length: 22 }, (_, i) => ({
    reference: `C2B${24669 + i}`,
    number: `+254 721 111 ${222 + i}`,
    date: 'Apr 14, 2024, 14:12',
    amount: `$${(12.50 + i).toFixed(2)}`,
    status: 'SUCCESSFUL'
}));

const STK_PUSH_DATA = [
    { reference: 'C2B78901', number: '+254 712 555-333', date: 'Apr 14, 2024, 14:20', status: 'Queued' },
    { reference: 'C2B93772', number: '+254 765 222 111', date: 'Apr 14, 2024, 11:44', status: 'Queued' },
    { reference: 'C2B25897', number: '+254 793 111 444', date: 'Apr 14, 2024, 11:34', status: 'Queued' },
    { reference: 'C2B47991', number: '+254 710 989 222', date: 'Apr 14, 2024, 11:34', status: 'Queued' },
];

const FAILED_DATA = [
    { reference: 'C2B12254', number: '+254 765 123 456', status: 'Failed' },
    { reference: 'C2B56192', number: '+254 722 345 678', status: 'Failed' },
    { reference: 'C2B96976', number: '+254 790 339 111', status: 'Failed' },
];

const CHART_DATA = [
    { name: 'Mon', val: 400 },
    { name: 'Tue', val: 300 },
    { name: 'Wed', val: 600 },
    { name: 'Thu', val: 500 },
    { name: 'Fri', val: 900 },
    { name: 'Sat', val: 700 },
    { name: 'Sun', val: 850 },
];

// Custom Tooltip Component
interface TooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { name: string } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-100 shadow-lg rounded-lg text-xs">
                <p className="font-bold text-slate-700">{payload[0].payload.name}</p>
                <p className="text-teal-600">Value: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(DETAILED_TRANSACTIONS.length / itemsPerPage);
    
    const currentTableData = DETAILED_TRANSACTIONS.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <ProtectedLayout>
            <div className="p-4 space-y-4 min-h-screen overflow-y-auto w-full font-sans text-slate-700">
                
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <div key={i} className="p-4 rounded-xs border border-slate-100 shadow-sm bg-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xs ${stat.bg}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-lg font-medium text-slate-800">{stat.value}</h3>
                                        {stat.change && (
                                            <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-teal-600' : 'text-red-500'}`}>
                                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                {stat.change}
                                            </span>
                                        )}
                                        {stat.subValue && <span className="text-[10px] text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full">{stat.subValue}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Queued STK Push List */}
                        <div className="bg-white p-4 flex flex-col justify-between rounded-xs border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-medium text-slate-800 flex items-center gap-2 text-xs">
                                    <CheckCircle2 size={14} className="text-teal-600" /> Queued STK Push
                                </span>
                                <span className="text-xs text-slate-400 font-medium">2,506 <ChevronRight size={14} className="inline" /></span>
                            </div>
                            <table className="w-full text-xs">
                                <thead className="text-slate-800 border-b bg-gray-50 border-slate-50">
                                    <tr className="text-left">
                                        <th className="py-2 font-medium text-xs">Reference</th>
                                        <th className="py-2 font-medium text-xs">Number</th>
                                        <th className="py-2 font-medium text-xs">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {STK_PUSH_DATA.map((row, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-2 text-black text-xs text-nowrap">{row.reference}</td>
                                            <td className="py-2 text-slate-700 text-xs text-nowrap">{row.number}</td>
                                            <td className="py-2 text-slate-800 text-xs text-nowrap">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Failed STK Push List */}
                        <div className="bg-white p-4 flex flex-col justify-between rounded-xs border border-slate-100 shadow-sm">
                            <div className='flex flex-col justify-between gap-4'>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-medium text-slate-800 flex items-center gap-2 text-xs">
                                        <AlertCircle size={16} className="text-red-500" /> Failed STK Push
                                    </h4>
                                    <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-medium text-slate-700">156 <ChevronRight size={12} className="inline" /></div>
                                </div>
                                <table className="w-full text-xs">
                                    <thead className="text-slate-700 border-b border-slate-50">
                                        <tr className="text-left">
                                            <th className="pb-2 font-medium">Reference</th>
                                            <th className="pb-2 font-medium">Number</th>
                                            <th className="pb-2 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {FAILED_DATA.map((row, idx) => (
                                            <tr key={idx} className="border-b border-slate-50">
                                                <td className="py-2 text-xs">
                                                    <div className=" text-slate-700">{row.reference}</div>
                                                </td>
                                                <td className="py-2 text-xs">
                                                    <div className=" text-slate-700">{row.number}</div>
                                                </td>
                                                <td className="py-2 text-xs">
                                                    <span className="bg-red-600 text-white px-2 py-1 rounded-xs text-[8px] font-bold uppercase tracking-wider">Failed</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Failed STK Push List */}
                        <div className="bg-white p-4 flex flex-col justify-between rounded-xs border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-slate-800 flex items-center gap-2 text-xs">
                                    <CheckCircle2 size={16} className="text-teal-600" /> Revenue
                                </h4>
                            </div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B9B3" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10ABB9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                                            dy={10}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="val" stroke="#10B9B6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Large Detailed Table with Working Pagination */}
                        <div className="bg-white p-4 rounded-xs border border-slate-100 shadow-sm col-span-2 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h4 className="font-medium text-xs text-slate-800 flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-teal-600" /> Detailed Transactions
                                    </h4>
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Search reference..." 
                                            className="w-full pl-10 pr-4 outline-none py-2 bg-slate-50 border-none rounded-xs text-xs focus:ring-2 focus:ring-teal-600 transition-all"/>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead className="text-slate-700 bg-slate-50/50">
                                            <tr className="text-left">
                                                <th className="p-2 font-medium">Reference</th>
                                                <th className="p-2 font-medium">Number</th>
                                                <th className="p-2 font-medium">Date</th>
                                                <th className="p-2 font-medium">Amount</th>
                                                <th className="p-2 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {currentTableData.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-2 text-slate-700">{row.reference}</td>
                                                    <td className="p-2 text-slate-700">{row.number}</td>
                                                    <td className="p-2 text-slate-700">{row.date}</td>
                                                    <td className="p-2 text-slate-700">{row.amount}</td>
                                                    <td className="p-2">
                                                        <span className="bg-teal-600 text-white px-3 py-1 rounded-xs text-[10px] font-bold uppercase">{row.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* WORKING PAGINATION */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-medium disabled:opacity-30">
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${p === currentPage ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 text-slate-700 hover:text-slate-600 text-xs font-medium disabled:opacity-30">
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Successful STK Push Chart */}
                        <div className="bg-white p-4 rounded-xs border border-slate-100 shadow-sm col-span-1">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-xs text-slate-800 flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-teal-600" /> Successful STK
                                </h4>
                                <span className="text-xs font-bold text-slate-400">2,350 <ChevronRight size={14} className="inline" /></span>
                            </div>
                            <div className="h-32 w-full mb-6 border-b border-slate-50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                                            dy={10}/>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {STK_PUSH_DATA.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div>
                                            <p className="text-xs text-slate-700">{item.reference}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-700">{item.number}</p>
                                        </div>
                                        <span className="bg-teal-600 text-white px-2 py-0.5 rounded-xs text-[10px] font-bold">SUCCESSFUL</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ProtectedLayout>
    );
};

export default Page;