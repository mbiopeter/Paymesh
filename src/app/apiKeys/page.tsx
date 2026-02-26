"use client";

import React, { useState } from "react";
import ProtectedLayout from "@/component/layouts";
import WindowContainer from "@/component/modal";
import {
    Copy,
    RotateCcw,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    BookOpen,
    Key,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface ApiKey {
    id: number;
    name: string;
    key: string;
    visible: boolean;
    status: "Active" | "Revoked";
    created: string;
}

const ITEMS_PER_PAGE = 3;
const DOC_ITEMS_PER_PAGE = 2; // Pagination for documentation

const generateKey = (id: number | string) =>
    `pk_live_${Math.random().toString(36).slice(2)}_${id}`;

const initialKeys: ApiKey[] = Array.from({ length: 17 }).map((_, i) => ({
    id: i + 1,
    name: `Paymesh API Key ${i + 1}`,
    key: generateKey(i + 1),
    visible: false,
    status: i % 4 === 0 ? "Revoked" : "Active",
    created: "2024-01-15",
}));

// Documentation Data Array
const DOC_SECTIONS = [
    {
        id: 1,
        title: "1. Authorization",
        content: <p>Include your API key in the request header:</p>,
        code: `Authorization: Bearer pk_live_xxxxxxxxxxxxxx`
    },
    {
        id: 2,
        title: "2. Example API Request",
        content: <p>Fetch account details:</p>,
        code: `curl -X GET https://api.paymesh.com/v1/account \\
-H "Authorization: Bearer pk_live_xxxxxxxxxxxxxx" \\
-H "Content-Type: application/json"`
    },
    {
        id: 3,
        title: "3. Example API Response",
        content: null,
        code: `{
    "id": "acct_123456789",
    "balance": 150000,
    "status": "active"
}`
    },
    {
        id: 4,
        title: "4. Person to Business Payment Request (P2B)",
        content: <p>Send a POST request to create a new payment; payment is done to the primary account</p>,
        code: `POST https://api.paymesh.com/v1/payments
Content-Type: application/json
Authorization: Bearer pk_live_xxxxxxxxxxxxxx

{
    "amount": 5000,
    "source": "254712345678",
    "description": "Payment for order #1234"
}`
    },
    {
        id: 5,
        title: "5. Person to Person Payment Request (P2P)",
        content: <p>Use this endpoint for direct individual transfers. The senders credentials will be used for STK push.</p>,
        code: `POST https://api.paymesh.com/v1/payments/p2p
Content-Type: application/json
Authorization: Bearer pk_live_xxxxxxxxxxxxxx

{
    "amount": 1200,
    "from": { "phone": "254712345678" },
    "to": { "phone": "254798765432" },
    "description": "Refund for shared expenses"
}`
    },
    {
        id: 6,
        title: "6. Webhook Response Example",
        content: <p>Paymesh sends a POST request to your endpoint upon completion:</p>,
        code: `{
    "event": "success",
    "data": {
        "transaction_id": "txn_123456",
        "amount": 5000,
        "code": "QXWUIWED"
    }
}`
    },
    {
        id: 7,
        title: "7. Payment Failure Response",
        content: <p>If payment fails, you will receive a 400 or 402 response:</p>,
        code: `{
    "event": "failure",
    "error": {
        "code": "payment_failed",
        "message": "User cancelled the request"
    }
}`
    },
    {
        id: 8,
        title: "8. Best Practices",
        content: (
            <ul className="list-disc ml-5 space-y-1">
                <li>Never expose your API keys publicly.</li>
                <li>Rotate keys if compromised.</li>
                <li>Use separate keys for dev and production.</li>
            </ul>
        ),
        code: null
    }
];

const Page = () => {
    const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
    const [page, setPage] = useState(1);
    const [docPage, setDocPage] = useState(1);
    
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

    // Table Pagination Logic
    const totalPages = Math.ceil(keys.length / ITEMS_PER_PAGE);
    const paginatedKeys = keys.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Documentation Pagination Logic
    const totalDocPages = Math.ceil(DOC_SECTIONS.length / DOC_ITEMS_PER_PAGE);
    const paginatedDocs = DOC_SECTIONS.slice((docPage - 1) * DOC_ITEMS_PER_PAGE, docPage * DOC_ITEMS_PER_PAGE);

    const handleCreateKey = (e: React.FormEvent) => {
        e.preventDefault();
        const newSecret = generateKey(Date.now());
        const newEntry: ApiKey = {
            id: Date.now(),
            name: newKeyName || "Untitled Key",
            key: newSecret,
            visible: false,
            status: "Active",
            created: new Date().toISOString().split('T')[0],
        };
        setKeys([newEntry, ...keys]);
        setGeneratedSecret(newSecret);
    };

    const closeWindow = () => {
        setIsWindowOpen(false);
        setNewKeyName("");
        setGeneratedSecret(null);
    };

    const copyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        alert("API key copied to clipboard");
    };

    const toggleVisibility = (id: number) => {
        setKeys((prev) => prev.map((k) => k.id === id ? { ...k, visible: !k.visible } : k));
    };

    const regenerateKey = (id: number) => {
        if (!confirm("Regenerating will invalidate the old key. Continue?")) return;
        setKeys((prev) => prev.map((k) => k.id === id ? { ...k, key: generateKey(id), visible: true } : k));
    };

    const deleteKey = (id: number) => {
        if (!confirm("Are you sure you want to delete this API key?")) return;
        setKeys((prev) => prev.filter((k) => k.id !== id));
    };

    return (
        <ProtectedLayout>
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">API Credentials</h1>
                        <p className="text-xs hidden md:block text-gray-500">
                            Create, manage, and document your API keys for Paymesh integrations.
                        </p>
                    </div>
                    <button onClick={() => setIsWindowOpen(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xs text-xs font-bold hover:opacity-90">
                        <Plus size={16} /> Create API Key
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Name</th>
                                <th className="px-6 py-4 text-left font-semibold">API Key</th>
                                <th className="px-6 py-4 text-left font-semibold">Status</th>
                                <th className="px-6 py-4 text-left font-semibold">Created</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedKeys.map((item) => (
                                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                        {item.visible ? item.key : "••••••••••••••••••••••••"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === "Active" ? "bg-teal-100 text-teal-600" : "bg-red-100 text-red-500"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{item.created}</td>
                                    <td className="px-6 py-4 flex justify-end gap-3 text-gray-400">
                                        <button onClick={() => toggleVisibility(item.id)}>{item.visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                        <button onClick={() => copyKey(item.key)}><Copy size={16} /></button>
                                        <button onClick={() => regenerateKey(item.id)}><RotateCcw size={16} /></button>
                                        <button onClick={() => deleteKey(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-40">Previous</button>
                            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </div>

                {/* --- PAGINATED DOCUMENTATION SECTION --- */}
                <div className="bg-white rounded-sm  shadow-sm border border-gray-100 p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-teal-600" />
                            <h3 className="font-bold hidden text-gray-800 text-sm md:text-base">API Documentation & Usage Guide</h3>
                            <h3 className="font-bold md:hidden text-gray-800 text-sm md:text-base">API Docs</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Step {docPage} of {totalDocPages}</span>
                            <div className="flex gap-1">
                                <button 
                                    disabled={docPage === 1} 
                                    onClick={() => setDocPage(docPage - 1)}
                                    className="p-1 rounded border border-gray-100 hover:bg-gray-50 disabled:opacity-30"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    disabled={docPage === totalDocPages} 
                                    onClick={() => setDocPage(docPage + 1)}
                                    className="p-1 rounded border border-gray-100 hover:bg-gray-50 disabled:opacity-30"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {paginatedDocs.map((doc) => (
                            <div key={doc.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">{doc.title}</h4>
                                {doc.content && <div className="text-xs text-gray-600 leading-relaxed">{doc.content}</div>}
                                {doc.code && (
                                    <pre className="bg-gray-900 text-teal-400 text-[11px] p-4 rounded-lg font-mono overflow-x-auto shadow-inner border border-gray-800">
                                        {doc.code}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Generator (Remains unchanged) */}
            {isWindowOpen && (
                <WindowContainer id="gen-key" title="API Key Generator" onClose={closeWindow} onFocus={() => {}} zIndex={100} initialState={{ width: 450, height: 320 }}>
                    <div className="p-6 h-full bg-white">
                        {!generatedSecret ? (
                            <form onSubmit={handleCreateKey} className="space-y-6">
                                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                                    <Key className="text-teal-600" size={20} />
                                    <p className="text-[11px] text-teal-700">Assign a name to your key to identify its purpose.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Key Name</label>
                                    <input autoFocus type="text" className="w-full px-4 py-2 border border-gray-200 rounded-md outline-none" placeholder="e.g. Mobile Application" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} required />
                                </div>
                                <button type="submit" className="w-full py-2 bg-teal-600 text-white font-bold rounded-md">Generate and Save</button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4 animate-in zoom-in duration-300">
                                <div className="flex justify-center"><CheckCircle2 className="text-teal-500" size={40} /></div>
                                <h4 className="font-bold text-gray-800">Key Created & Saved</h4>
                                <div className="bg-gray-50 p-3 rounded-xs border border-dashed border-gray-300 font-mono text-xs break-all text-gray-700">{generatedSecret}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => copyKey(generatedSecret)} className="flex-1 py-2 border rounded-xs text-xs font-bold flex justify-center items-center gap-1"><Copy size={12} /> Copy</button>
                                    <button onClick={closeWindow} className="flex-1 py-2 bg-gray-900 text-white rounded-xs text-xs font-bold">Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </WindowContainer>
            )}
        </ProtectedLayout>
    );
};

export default Page;