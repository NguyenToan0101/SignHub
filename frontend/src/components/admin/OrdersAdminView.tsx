/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, Filter, Eye, Printer, Edit2, X, Download, 
  ChevronLeft, ChevronRight, AlertCircle, ShoppingBag, Truck, Calendar, User 
} from "lucide-react";
import { AdminOrder } from "./mockAdminData";
import { exportToExcel } from "./exportUtils";

interface OrdersAdminViewProps {
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  onSelectOrder: (order: AdminOrder | null) => void;
  onUpdateOrderStatus: (orderId: string, status: "Processing" | "Shipped" | "Delivered" | "Cancelled") => void;
}

export function OrdersAdminView({
  orders,
  selectedOrder,
  onSelectOrder,
  onUpdateOrderStatus,
}: OrdersAdminViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("");

  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" ? true : o.deliveryStatus === statusFilter;
      const matchesDate = dateFilter === "" ? true : o.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleExportOrders = () => {
    const dataToExport = filteredOrders.map((o) => ({
      ID: o.id,
      "Invoice No": o.invoiceNo,
      Customer: o.customerName,
      Email: o.customerEmail,
      Phone: o.customerPhone,
      Address: o.customerAddress,
      Date: o.date,
      "Total Costs ($)": o.totalPrice,
      "Payment Status": o.paymentStatus,
      "Delivery Status": o.deliveryStatus,
      "Itemized Pieces": o.items.map(item => `${item.productName} (x${item.quantity})`).join("; ")
    }));

    exportToExcel(
      dataToExport,
      ["ID", "Invoice No", "Customer", "Email", "Phone", "Address", "Date", "Total Costs ($)", "Payment Status", "Delivery Status", "Itemized Pieces"],
      ["ID", "Invoice No", "Customer", "Email", "Phone", "Address", "Date", "Total Costs ($)", "Payment Status", "Delivery Status", "Itemized Pieces"],
      "orders_report.xlsx"
    );
  };

  const handlePrintInvoice = (order: AdminOrder) => {
    // Elegant client-side printing flow using browser print window and dynamic sandbacked stylesheets!
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print invoices cleanly!");
      return;
    }
    
    // Construct ultra-luxurious print format HTML page
    const invoiceHtml = `
      <html>
        <head>
          <title>L'ART DÉCOR | INVOICE #${order.invoiceNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;600&family=EB+Garamond:ital,wght@0,600;1,400&display=swap');
            body { font-family: 'Be Vietnam Pro', sans-serif; color: #1b1c1c; padding: 40px; }
            h1 { font-family: 'EB Garamond', serif; font-size: 32px; letter-spacing: 4px; border-bottom: 2px solid #775a19; padding-bottom: 10px; margin-bottom: 30px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            h3 { font-family: 'EB Garamond', serif; font-size: 18px; color: #775a19; margin-bottom: 10px; }
            p { font-size: 12px; line-height: 1.6; margin: 0 0 5px; color: #444748; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { border-bottom: 1px solid #1b1c1c; padding: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #efeded; font-size: 12px; }
            .total { text-align: right; font-size: 16px; font-weight: bold; color: #775a19; margin-top: 30px; border-top: 2px solid #775a19; padding-top: 15px; }
            .footer { border-top: 1px solid #c4c7c7; margin-top: 60px; padding-top: 20px; text-align: center; font-size: 10px; color: #444748; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <h1>L'ART DÉCOR</h1>
          <p>ESTABLISHED CIRCLES MMVIII | HO CHI MINH CITY, VIETNAM</p>
          <div style="margin-top:20px; font-size: 12px;"><strong>INVOICE REFERENCE AND RECORD:</strong> #${order.invoiceNo}</div>
          <div style="font-size: 12px;"><strong>PLACED ON DATE:</strong> ${order.date}</div>

          <div class="details" style="margin-top:40px;">
            <div>
              <h3>CLIENT BILLING & SHIPMENT</h3>
              <p><strong>Name:</strong> ${order.customerName}</p>
              <p><strong>Address:</strong> ${order.customerAddress}</p>
              <p><strong>Contact:</strong> ${order.customerPhone}</p>
              <p><strong>Email Address:</strong> ${order.customerEmail}</p>
            </div>
            <div>
              <h3>ACQUISITION CODE STATUS</h3>
              <p><strong>Payment Statement:</strong> ${order.paymentStatus}</p>
              <p><strong>Curation Status:</strong> ${order.deliveryStatus}</p>
              <p><strong>Delivered with:</strong> White Glove Atelier Carriage</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Curated Piece</th>
                <th>Selected Finish</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th style="text-align: right;">Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(it => `
                <tr>
                  <td><strong>${it.productName}</strong><br/><span style="font-size:10px; color:#775a19;">${it.size}</span></td>
                  <td>${it.finish}</td>
                  <td>$${it.price.toLocaleString()}.00</td>
                  <td>${it.quantity}</td>
                  <td style="text-align: right;">$${(it.price * it.quantity).toLocaleString()}.00</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="total">
            TOTAL ACQUISITION SUM: $${order.totalPrice.toLocaleString()}.00 USD
          </div>

          <div class="footer">
            THANK YOU FOR SUPPORTING AUTHENTIC VIETNAMESE MINIMALISM ARCHITECTURE.
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="orders-admin-view">
      
      {/* Curation Title & export logs desk */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
            CLIENT CARRIAGE CONTROL
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
            Acquisitions & Invoices
          </h1>
        </div>

        <button
          onClick={handleExportOrders}
          className="flex items-center gap-2 pl-3.5 pr-4 py-2 border border-[#c4c7c7]/60 hover:border-[#1b1c1c] text-[#444748] hover:text-[#1b1c1c] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors self-start sm:self-auto"
        >
          <Download size={13} />
          EXCEL CARRIAGE LOGS
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#c4c7c7]/20 rounded-2xl p-4 shadow-sm">
        
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <Search size={14} className="text-[#444748]/60" />
          <input 
            type="text"
            placeholder="Search client Name or invoice No..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none placeholder-[#444748]/40 w-full"
          />
        </div>

        {/* Status Selection */}
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">State:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0"
          >
            <option value="all">All progress phases</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped Carriage</option>
            <option value="Delivered">Delivered Handover</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">Created:</span>
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0"
          />
        </div>

        {/* Clear query */}
        {(searchTerm || statusFilter !== "all" || dateFilter) && (
          <div className="flex items-center justify-end px-2">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="text-[10px] text-[#775a19] font-bold tracking-widest uppercase hover:opacity-75 transition-opacity"
            >
              Reset active filter
            </button>
          </div>
        )}
      </div>

      {/* CORE QUEUE TABLE */}
      <div className="bg-white rounded-2xl border border-[#c4c7c7]/20 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c4c7c7]/20 bg-[#fbf9f9]/50">
                <th className="py-4 pl-6 pr-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Invoice No</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Client name</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Created date</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Pieces Count</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-right">Sum total</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-center">Payment</th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-center">Carriage</th>
                <th className="py-4 pr-6 pl-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-right">Acquire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c7c7]/10 text-xs">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr 
                    key={ord.id}
                    className="hover:bg-[#efeded]/20 transition-colors"
                  >
                    <td className="py-4 pl-6 pr-4 font-mono font-bold text-[#1b1c1c]">
                      #{ord.invoiceNo}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#1b1c1c]">
                      {ord.customerName}
                    </td>
                    <td className="py-4 px-4 text-[#444748] font-medium">
                      {ord.date}
                    </td>
                    <td className="py-4 px-4 font-bold text-center w-28">
                      {ord.items.reduce((acc, i) => acc + i.quantity, 0)} Units
                    </td>
                    <td className="py-4 px-4 text-right font-display font-bold text-[#775a19] text-sm">
                      ${ord.totalPrice.toLocaleString()}.00
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                        ord.paymentStatus === "Paid" 
                          ? "bg-green-50 text-green-700 border border-green-100" 
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                        ord.deliveryStatus === "Delivered" 
                          ? "bg-green-50 text-green-700 border border-green-100" 
                          : ord.deliveryStatus === "Cancelled"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-[#fed488]/30"
                      }`}>
                        {ord.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onSelectOrder(ord)}
                          className="p-1.5 text-[#444748] hover:text-[#775a19] hover:bg-[#efeded]/50 rounded-lg transition-colors"
                          title="Open Carriage logs"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(ord)}
                          className="p-1.5 text-[#444748] hover:text-[#1b1c1c] hover:bg-[#efeded]/50 rounded-lg transition-colors"
                          title="Print official invoice"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center flex-col justify-center text-[#444748]">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-[#c4c7c7]" />
                      <p className="font-display font-semibold text-base italic">No matching client invoices index</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SLIDEOVER DRAWER: ORDER SELECTION CARD FOR LOGISTICS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="order-details-drawer">
          {/* Back dim overlay */}
          <div 
            onClick={() => onSelectOrder(null)}
            className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#fbf9f9] shadow-2xl flex flex-col justify-between h-full border-l border-[#c4c7c7]/30 transform translate-x-0 animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase">
                    INVOICE SPECIFICS
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#1b1c1c]">
                    Acquisition #{selectedOrder.invoiceNo}
                  </h3>
                </div>
                <button 
                  onClick={() => onSelectOrder(null)}
                  className="p-2 text-[#444748] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded]/30"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Status Actions controllers */}
                <div className="bg-white p-5 rounded-xl border border-[#c4c7c7]/30 space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-[#775a19] uppercase block">
                    MANAGE CARRIAGE PROGRESSION
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {["Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, st as any)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                          selectedOrder.deliveryStatus === st 
                            ? "bg-[#775a19] text-white border-[#775a19] shadow-sm" 
                            : "bg-[#fbf9f9] text-[#444748] border-[#c4c7c7]/50 hover:bg-white hover:text-[#1b1c1c]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Client Profile */}
                <div className="space-y-4">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">
                    CLIENT ACQUISITOR DETAILS
                  </span>
                  <div className="bg-white p-5 rounded-xl border border-[#c4c7c7]/20 space-y-3.5 text-xs text-[#1b1c1c]">
                    <div className="flex gap-2 items-center">
                      <User size={14} className="text-[#775a19]" />
                      <strong>Name:</strong> <span className="font-medium text-[#444748] ml-auto">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Calendar size={14} className="text-[#775a19]" />
                      <strong>Acquired Date:</strong> <span className="font-mono text-[#444748] ml-auto">{selectedOrder.date}</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Truck size={14} className="text-[#775a19] mt-0.5" />
                      <strong>Shipping Address:</strong> 
                      <span className="font-medium text-[#444748] text-right ml-auto max-w-[220px]">{selectedOrder.customerAddress}</span>
                    </div>
                    <div className="pt-2 border-t border-[#c4c7c7]/10 flex justify-between items-baseline">
                      <strong>Client Email:</strong>
                      <span className="font-mono text-[#444748]">{selectedOrder.customerEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized acquisitions list review */}
                <div className="space-y-3">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">
                    ITEMIZED PIECES ({selectedOrder.items.length})
                  </span>
                  
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white border border-[#c4c7c7]/20 rounded-xl">
                        <div>
                          <h5 className="font-display font-bold text-sm text-[#1b1c1c]">{item.productName}</h5>
                          <p className="text-[10px] text-[#775a19] font-bold tracking-wider uppercase mt-1">
                            {item.finish} | {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block font-sans text-xs font-bold text-[#1b1c1c]">
                            x{item.quantity} Units
                          </span>
                          <span className="block font-mono text-xs text-[#444748] font-semibold mt-0.5">
                            ${(item.price * item.quantity).toLocaleString()}.00
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action buttons footer */}
              <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex gap-4">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="flex-1 py-3.5 border border-[#1b1c1c] text-[#1b1c1c] rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#efeded]/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer size={13} />
                  PRINT INVOICE
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOrder(null)}
                  className="flex-1 py-3.5 bg-[#1b1c1c] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#775a19] transition-colors"
                >
                  SAVE CLOSE
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
