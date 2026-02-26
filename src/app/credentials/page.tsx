"use client";

import React, { useState, useCallback } from "react";
import ProtectedLayout from "@/component/layouts";
import { Plus, Trash2, Pencil, CheckCircle, XCircle } from "lucide-react";
import WindowContainer from "@/component/modal";

/* ---------------- TYPES ---------------- */
type CredentialType = "till" | "paybill";

interface MpesaCredential {
    id: string;
    owner: string;
    type: CredentialType;
    shortcodeOrTill: string;
    accountReference?: string;
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
    active: true;
    primary: boolean;
}

/* ---------------- PAGE ---------------- */
export default function Page() {
    const [credentials, setCredentials] = useState<MpesaCredential[]>([]);
    const [editing, setEditing] = useState<MpesaCredential | null>(null);
    const [focusedWindow, setFocusedWindow] = useState<string | number | null>(null);

    const handleFocus = useCallback((id: string | number) => {
        setFocusedWindow(id);
    }, []);

    const handleSave = (data: MpesaCredential) => {
        setCredentials(prev => {
            let next = prev;
            if (data.primary) {
                next = next.map(c => ({ ...c, primary: false }));
            }
            const exists = next.find(c => c.id === data.id);

            if (exists) {
                return next.map(c => (c.id === data.id ? data : c));
            }
            return [...next, data];
        });
        setEditing(null);
    };

    return (
        <ProtectedLayout>
            <div className="w-full mx-auto p-4 space-y-6 relative">
                {/* Header */}
                <div className="flex flex-row justify-between items-center">
                    <div className="hidden md:block">
                        <h1 className="text-lg font-black text-gray-800">
                            M-Pesa Credentials
                        </h1>
                        <p className="text-xs text-gray-500">
                            Configure how payments are processed through Safaricom M-Pesa
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setEditing({
                                id: crypto.randomUUID(),
                                owner: "",
                                type: "till",
                                shortcodeOrTill: "",
                                accountReference: "",
                                consumerKey: "",
                                consumerSecret: "",
                                passkey: "",
                                active: true,
                                primary: false
                            })
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xs bg-teal-600 text-white text-xs font-bold">
                        <Plus size={14} />
                        Add Credential
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="border-b border-gray-200 text-gray-800">
                            <tr>
                                <th className="text-left p-3">Owner</th>
                                <th className="text-left">Type</th>
                                <th className="text-left">Number</th>
                                <th className="text-left">Status</th>
                                <th className="text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {credentials.map(c => (
                                <tr key={c.id} className="border-b border-gray-200">
                                    <td className="p-3 text-nowrap min-w-35 font-bold text-gray-800">
                                        {c.owner}
                                        {c.primary && (
                                            <span className="ml-2 text-[10px] bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">
                                                PRIMARY
                                            </span>
                                        )}
                                    </td>
                                    <td className="uppercase text-nowrap min-w-30 text-xs">{c.type}</td>
                                    <td className="text-nowrap min-w-30">
                                        {c.shortcodeOrTill}
                                        {c.accountReference && (
                                            <div className="text-xs text-gray-400">
                                                Acc: {c.accountReference}
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-nowrap min-w-30">
                                        {c.active ? (
                                            <span className="flex items-center gap-1 text-teal-600 text-xs font-bold">
                                                <CheckCircle size={12} /> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                                                <XCircle size={12} /> Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="flex p-3 text-nowrap min-w-30 justify-end gap-3 pr-4">
                                        <button
                                            onClick={() => setEditing(c)}
                                            className="text-gray-800 hover:text-black">
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCredentials(prev =>
                                                    prev.filter(x => x.id !== c.id)
                                                )
                                            }
                                            className="text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MODAL WINDOW */}
                {editing && (
                    <WindowContainer
                        id="mpesa-credential-modal"
                        title={editing.owner ? "Edit M-Pesa Credential" : "Add M-Pesa Credential"}
                        onClose={() => setEditing(null)}
                        onFocus={handleFocus}
                        zIndex={focusedWindow === "mpesa-credential-modal" ? 1000 : 500}
                        initialState={{ width: 600, height: 520 }}>
                        <div className="flex h-full flex-col justify-between">
                            <div className="p-4 space-y-4">
                                <Input
                                    label="Owner / Business Name"
                                    value={editing.owner}
                                    onChange={v => setEditing({ ...editing, owner: v })}/>
                                <Select
                                    label="Credential Type"
                                    value={editing.type}
                                    onChange={v =>
                                        setEditing({
                                            ...editing,
                                            type: v as CredentialType
                                        })
                                    }
                                    options={[
                                        { label: "Till Number", value: "till" },
                                        { label: "Paybill", value: "paybill" }
                                    ]}/>

                                <Input
                                    label={editing.type === "till" ? "Till Number" : "Business Shortcode"}
                                    value={editing.shortcodeOrTill}
                                    onChange={v =>
                                        setEditing({ ...editing, shortcodeOrTill: v })
                                    }/>

                                {editing.type === "paybill" && (
                                    <Input
                                        label="Account Reference"
                                        value={editing.accountReference ?? ""}
                                        onChange={v =>
                                            setEditing({
                                                ...editing,
                                                accountReference: v
                                            })
                                        }
                                    />
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Consumer Key"
                                        value={editing.consumerKey}
                                        onChange={v =>
                                            setEditing({ ...editing, consumerKey: v })
                                        }/>
                                    <Input
                                        label="Consumer Secret"
                                        value={editing.consumerSecret}
                                        onChange={v =>
                                            setEditing({ ...editing, consumerSecret: v })
                                        }/>
                                </div>

                                <Input
                                    label="Passkey"
                                    value={editing.passkey}
                                    onChange={v =>
                                        setEditing({ ...editing, passkey: v })
                                    }/>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editing.primary}
                                        onChange={e =>
                                            setEditing({
                                                ...editing,
                                                primary: e.target.checked
                                            })
                                        }/>
                                    <span className="text-xs font-bold text-gray-600">
                                        Set as Primary Business Credential
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end p-4 gap-3 pt-4">
                                <button
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 border border-gray-200 rounded-xs text-xs">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSave(editing)}
                                    className="px-4 py-2 rounded-xs bg-teal-600 text-white text-xs font-bold">
                                    Save Credential
                                </button>
                            </div>
                        </div>
                    </WindowContainer>
                )}
            </div>
        </ProtectedLayout>
    );
}

/* ---------------- UI HELPERS ---------------- */

function Input({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xs  text-xs focus:ring-2 focus:ring-teal-600 outline-none"
            />
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    options
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string }[];
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-600">{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xs text-xs focus:ring-2 focus:ring-teal-600 outline-none">
                {options.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}