/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, Eye, ShieldCheck, ShieldAlert, Lock, Unlock, X, Download, 
  ChevronLeft, ChevronRight, AlertCircle, ShoppingBag, Mail, Phone, MapPin 
} from "lucide-react";
import { AdminCustomer, AdminOrder } from "./mockAdminData";
import { exportToExcel } from "./exportUtils";

interface CustomersAdminViewProps {
  customers: AdminCustomer[];
  orders: AdminOrder[];
  onToggleCustomerLock: (customerId: string) => void;
}

export function CustomersAdminView({
  customers,
  orders,
  onToggleCustomerLock,
}: CustomersAdminViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCustomer, setSelectedCustomer] = React.useState<AdminCustomer | null>(null);

  const filteredCustomers = React.useMemo(() => {
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [customers, searchTerm]);

  const handleExportCustomers = () => {
    const dataToExport = filteredCustomers.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Address: c.address,
      "Date Joined": c.joinedDate,
      "Total Costs ($) Spent": c.totalSpent,
      Status: c.status
    }));

    exportToExcel(
      dataToExport,
      ["ID", "Name", "Email", "Phone", "Address", "Date Joined", "Total Costs ($) Spent", "Status"],
      ["ID", "Name", "Email", "Phone", "Address", "Date Joined", "Total Costs ($) Spent", "Status"],
      "customers_report.xlsx"
    );
  };

  // Get matching orders for a customer
  const customerOrders = React.useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(o => 
      o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase()
    );
  }, [selectedCustomer, orders]);

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="customers-admin-view">
      
      {/* Title block with export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
            CLIENT CONVENTIONS
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
            VIP Client Registry
          </h1>
        </div>

        <button
          onClick={handleExportCustomers}
          className="flex items-center gap-2 pl-3.5 pr-4 py-2 border border-[#c4c7c7]/60 hover:border-[#1b1c1c] text-[#444748] hover:text-[#1b1c1c] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors self-start sm:self-auto"
        >
          <Download size={13} />
          EXCEL REGISTRY LOGS
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="flex items-center gap-2.5 bg-white border border-[#c4c7c7]/20 rounded-2xl px-4 py-3 shadow-sm max-w-md">
        <Search size={14} className="text-[#444748]/60" />
        <input 
          type="text"
          placeholder="Search customer name, email, or telephone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none placeholder-[#444748]/40 w-full"
        />
      </div>

      {/* CUSTOMER LIST REGISTRY TABLE */}
      <div className="bg-white rounded-2xl border border-[#c4c7c7]/20 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c4c7c7]/20 bg-[#fbf9f9]/50">
                <th className="py-4 pl-6 pr-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Client reference</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Direct Details</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Joined date</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-right">Sum total spent</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-center">Security state</th>
                <th className="py-4 pr-6 pl-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-right">Showroom Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c7c7]/10 text-xs">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr 
                    key={cust.id}
                    className="hover:bg-[#efeded]/20 transition-colors"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#efeded] border border-[#c4c7c7]/30 flex-shrink-0">
                          <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#1b1c1c]">{cust.name}</h4>
                          <span className="text-[9px] text-[#444748] uppercase font-bold font-mono tracking-wider">ID: {cust.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#444748] text-[10px]">
                        <Mail size={10} className="text-[#775a19]" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#444748] text-[10px]">
                        <Phone size={10} className="text-[#775a19]" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#444748] font-medium font-mono text-[10px]">
                      {cust.joinedDate}
                    </td>

                    <td className="py-4 px-4 text-right font-display font-semibold text-[#775a19] text-sm">
                      ${cust.totalSpent.toLocaleString()}.00
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                        cust.status === "Active" 
                          ? "bg-green-50 text-green-700 border border-green-100" 
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {cust.status === "Active" ? "Active" : "Locked / Barred"}
                      </span>
                    </td>

                    <td className="py-4 pr-6 pl-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 text-[#444748] hover:text-[#775a19] hover:bg-[#efeded]/50 rounded-lg transition-colors"
                          title="View dynamic client dashboard"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onToggleCustomerLock(cust.id)}
                          className={`p-1.5 rounded-lg transition-colors ${cust.status === "Active" ? "text-[#444748] hover:text-red-600 hover:bg-red-50" : "text-[#775a19] hover:bg-[#775a19]/10"}`}
                          title={cust.status === "Active" ? "Restrict client profile" : "Grant access permissions"}
                        >
                          {cust.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center flex-col justify-center text-[#444748]">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-[#c4c7c7]" />
                      <p className="font-display font-semibold text-base italic">No client registrations located</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SLIDEOVER DRAWER: DYNAMIC VIP CUSTOMER DEEP PROFILE */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="customer-profile-drawer">
          <div 
            onClick={() => setSelectedCustomer(null)}
            className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#fbf9f9] shadow-2xl flex flex-col justify-between h-full border-l border-[#c4c7c7]/30 transform translate-x-0 animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase">
                    CLIENT ARCHIVE
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#1b1c1c]">
                    Profile Dossier
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-[#444748] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded]/30"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Curator profile badge */}
                <div className="bg-white p-6 rounded-2xl border border-[#c4c7c7]/20 flex flex-col items-center text-center gap-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#775a19] bg-[#efeded]">
                    <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#1b1c1c]">
                      {selectedCustomer.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#444748]">Client Reference: {selectedCustomer.id}</span>
                  </div>
                  
                  {/* Lock/Unlock Toggle directly inside the drawer card */}
                  <button
                    onClick={() => {
                      onToggleCustomerLock(selectedCustomer.id);
                      // Update drawer reference immediately for high-fidelity sync
                      setSelectedCustomer(prev => prev ? { ...prev, status: prev.status === "Active" ? "Locked" : "Active" } : null);
                    }}
                    className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-bold border ${
                      selectedCustomer.status === "Active"
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {selectedCustomer.status === "Active" ? (
                      <>
                        <Lock size={11} /> LOCK ACCOUNT CONTROL
                      </>
                    ) : (
                      <>
                        <Unlock size={11} /> DEAUTHORIZE BAN RESTRICTIONS
                      </>
                    )}
                  </button>
                </div>

                {/* Direct info list */}
                <div className="space-y-4">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">
                    CONTACT LEDGER
                  </span>
                  
                  <div className="bg-white p-5 rounded-xl border border-[#c4c7c7]/20 space-y-3.5 text-xs text-[#1b1c1c]">
                    <div className="flex gap-2 items-center">
                      <Mail size={14} className="text-[#444748]" />
                      <strong>Email:</strong> <span className="font-mono text-[#444748] ml-auto">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Phone size={14} className="text-[#444748]" />
                      <strong>Phone Number:</strong> <span className="font-mono text-[#444748] ml-auto">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <MapPin size={14} className="text-[#444748] mt-0.5" />
                      <strong>Ship Residence:</strong> 
                      <span className="font-medium text-[#444748] text-right ml-auto max-w-[220px]">{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Historic Acquisitions list */}
                <div className="space-y-3">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">
                    Acquisition history ({customerOrders.length})
                  </span>
                  
                  {customerOrders.length > 0 ? (
                    customerOrders.map(o => (
                      <div key={o.id} className="p-4 bg-white border border-[#c4c7c7]/20 rounded-xl space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="font-mono text-xs font-bold text-[#1b1c1c]">Invoice #{o.invoiceNo}</span>
                          <span className="text-[10px] text-[#444748] font-semibold">{o.date}</span>
                        </div>
                        
                        <div className="space-y-1">
                          {o.items.map((item, id) => (
                            <p key={id} className="text-xs text-[#444748]">
                              <strong>{item.productName}</strong> (x{item.quantity}) - <span className="text-[10px] text-[#775a19]">{item.finish}</span>
                            </p>
                          ))}
                        </div>
                        
                        <div className="pt-2 border-t border-[#c4c7c7]/10 flex justify-between items-baseline">
                          <span className="text-[9px] tracking-wider uppercase text-[#444748] font-bold">Total Spent</span>
                          <strong className="text-sm font-display text-[#775a19]">${o.totalPrice.toLocaleString()}.00</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-[#444748] bg-white border border-dashed border-[#c4c7c7]/40 rounded-xl">
                      <ShoppingBag className="text-[#c4c7c7] w-8 h-8 mb-2" />
                      <p className="text-xs font-semibold italic">No past acquisitions registered yet.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Action buttons footer */}
              <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-3.5 bg-[#1b1c1c] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#775a19] transition-colors"
                >
                  DISMISS PROFILE
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
