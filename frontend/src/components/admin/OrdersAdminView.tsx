/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertCircle, Calendar, Download, Eye, Printer, Search, Truck, User, X } from "lucide-react";
import { formatVnd } from "../../format";
import { AdminOrder } from "./mockAdminData";
import { exportToExcel } from "./exportUtils";

interface OrdersAdminViewProps {
  orders: AdminOrder[];
  selectedOrder: AdminOrder | null;
  onSelectOrder: (order: AdminOrder | null) => void;
  onUpdateOrderStatus: (orderId: string, status: "Processing" | "Shipped" | "Delivered" | "Cancelled") => void;
}

const PAYMENT_LABELS: Record<AdminOrder["paymentStatus"], string> = {
  Paid: "Đã thanh toán",
  Pending: "Chờ thanh toán",
  Refunded: "Đã hoàn tiền",
};

const DELIVERY_LABELS: Record<AdminOrder["deliveryStatus"], string> = {
  Processing: "Đang xử lý",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

export function OrdersAdminView({ orders, selectedOrder, onSelectOrder, onUpdateOrderStatus }: OrdersAdminViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState("");

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const keyword = searchTerm.toLowerCase();
      const matchesSearch = order.customerName.toLowerCase().includes(keyword) || order.id.toLowerCase().includes(keyword) || order.invoiceNo.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter;
      const matchesDate = !dateFilter || order.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleExportOrders = () => {
    const dataToExport = filteredOrders.map((order) => ({
      ID: order.id,
      "Mã hóa đơn": order.invoiceNo,
      "Khách hàng": order.customerName,
      Email: order.customerEmail,
      "Số điện thoại": order.customerPhone,
      "Địa chỉ": order.customerAddress,
      "Ngày tạo": order.date,
      "Tổng tiền": order.totalPrice,
      "Thanh toán": PAYMENT_LABELS[order.paymentStatus],
      "Giao hàng": DELIVERY_LABELS[order.deliveryStatus],
      "Sản phẩm": order.items.map((item) => `${item.productName} (x${item.quantity})`).join("; "),
    }));

    exportToExcel(
      dataToExport,
      ["ID", "Mã hóa đơn", "Khách hàng", "Email", "Số điện thoại", "Địa chỉ", "Ngày tạo", "Tổng tiền", "Thanh toán", "Giao hàng", "Sản phẩm"],
      ["ID", "Mã hóa đơn", "Khách hàng", "Email", "Số điện thoại", "Địa chỉ", "Ngày tạo", "Tổng tiền", "Thanh toán", "Giao hàng", "Sản phẩm"],
      "bao_cao_don_hang.xlsx"
    );
  };

  const handlePrintInvoice = (order: AdminOrder) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Vui lòng cho phép trình duyệt mở cửa sổ in hóa đơn.");
      return;
    }

    const invoiceHtml = `
      <html>
        <head>
          <title>SignHub | Hóa đơn #${order.invoiceNo}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #1b1c1c; padding: 40px; }
            h1 { letter-spacing: 2px; border-bottom: 2px solid #775a19; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 12px; border-bottom: 1px solid #efeded; font-size: 12px; text-align: left; }
            .total { text-align: right; font-size: 16px; font-weight: bold; color: #775a19; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>SIGNHUB</h1>
          <p><strong>Mã hóa đơn:</strong> #${order.invoiceNo}</p>
          <p><strong>Ngày tạo:</strong> ${order.date}</p>
          <p><strong>Khách hàng:</strong> ${order.customerName}</p>
          <p><strong>Địa chỉ:</strong> ${order.customerAddress}</p>
          <p><strong>Điện thoại:</strong> ${order.customerPhone}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Thanh toán:</strong> ${PAYMENT_LABELS[order.paymentStatus]}</p>
          <p><strong>Giao hàng:</strong> ${DELIVERY_LABELS[order.deliveryStatus]}</p>
          <table>
            <thead>
              <tr><th>Sản phẩm</th><th>Tùy chọn</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.finish} | ${item.size}</td>
                  <td>${formatVnd(item.price)}</td>
                  <td>${item.quantity}</td>
                  <td>${formatVnd(item.price * item.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total">Tổng cộng: ${formatVnd(order.totalPrice)}</div>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="orders-admin-view">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">QUẢN LÝ BÁN HÀNG</span>
          <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">Đơn hàng</h1>
        </div>
        <button onClick={handleExportOrders} className="flex items-center gap-2 pl-3.5 pr-4 py-2 border border-[#c4c7c7]/60 hover:border-[#1b1c1c] text-[#444748] hover:text-[#1b1c1c] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors self-start sm:self-auto">
          <Download size={13} />
          Xuất Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#c4c7c7]/20 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2.5 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <Search size={14} className="text-[#444748]/60" />
          <input type="text" placeholder="Tìm tên khách hoặc mã hóa đơn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none placeholder-[#444748]/40 w-full" />
        </div>
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">Trạng thái:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0">
            <option value="all">Tất cả</option>
            <option value="Processing">Đang xử lý</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">Ngày:</span>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0" />
        </div>
        {(searchTerm || statusFilter !== "all" || dateFilter) && (
          <div className="flex items-center justify-end px-2">
            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); setDateFilter(""); }} className="text-[10px] text-[#775a19] font-bold tracking-widest uppercase hover:opacity-75">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#c4c7c7]/20 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c4c7c7]/20 bg-[#fbf9f9]/50">
                {["Mã hóa đơn", "Khách hàng", "Ngày tạo", "Số lượng", "Tổng tiền", "Thanh toán", "Giao hàng", "Thao tác"].map((heading) => (
                  <th key={heading} className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c7c7]/10 text-xs">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#efeded]/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-[#1b1c1c]">#{order.invoiceNo}</td>
                  <td className="py-4 px-4 font-semibold text-[#1b1c1c]">{order.customerName}</td>
                  <td className="py-4 px-4 text-[#444748] font-medium">{order.date}</td>
                  <td className="py-4 px-4 font-bold text-center">{order.items.reduce((acc, item) => acc + item.quantity, 0)} cái</td>
                  <td className="py-4 px-4 font-display font-bold text-[#775a19] text-sm">{formatVnd(order.totalPrice)}</td>
                  <td className="py-4 px-4"><Badge tone={order.paymentStatus === "Paid" ? "green" : "amber"}>{PAYMENT_LABELS[order.paymentStatus]}</Badge></td>
                  <td className="py-4 px-4"><Badge tone={order.deliveryStatus === "Delivered" ? "green" : order.deliveryStatus === "Cancelled" ? "red" : "amber"}>{DELIVERY_LABELS[order.deliveryStatus]}</Badge></td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => onSelectOrder(order)} className="p-1.5 text-[#444748] hover:text-[#775a19] hover:bg-[#efeded]/50 rounded-lg" title="Xem chi tiết"><Eye size={14} /></button>
                      <button onClick={() => handlePrintInvoice(order)} className="p-1.5 text-[#444748] hover:text-[#1b1c1c] hover:bg-[#efeded]/50 rounded-lg" title="In hóa đơn"><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-[#444748]">
                    <div className="flex flex-col items-center gap-3"><AlertCircle className="w-12 h-12 text-[#c4c7c7]" /><p className="font-display font-semibold text-base italic">Không tìm thấy đơn hàng</p></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="order-details-drawer">
          <div onClick={() => onSelectOrder(null)} className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#fbf9f9] shadow-2xl flex flex-col justify-between h-full border-l border-[#c4c7c7]/30">
              <div className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase">Chi tiết hóa đơn</span>
                  <h3 className="font-display text-2xl font-bold text-[#1b1c1c]">#{selectedOrder.invoiceNo}</h3>
                </div>
                <button onClick={() => onSelectOrder(null)} className="p-2 text-[#444748] hover:text-[#1b1c1c] rounded-full hover:bg-[#efeded]/30" aria-label="Đóng"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-[#c4c7c7]/30 space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-[#775a19] uppercase block">Cập nhật giao hàng</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(DELIVERY_LABELS) as AdminOrder["deliveryStatus"][]).map((status) => (
                      <button key={status} onClick={() => onUpdateOrderStatus(selectedOrder.id, status)} className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border ${selectedOrder.deliveryStatus === status ? "bg-[#775a19] text-white border-[#775a19]" : "bg-[#fbf9f9] text-[#444748] border-[#c4c7c7]/50 hover:bg-white"}`}>
                        {DELIVERY_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">Thông tin khách hàng</span>
                  <div className="bg-white p-5 rounded-xl border border-[#c4c7c7]/20 space-y-3.5 text-xs text-[#1b1c1c]">
                    <Info icon={<User size={14} />} label="Tên" value={selectedOrder.customerName} />
                    <Info icon={<Calendar size={14} />} label="Ngày tạo" value={selectedOrder.date} />
                    <Info icon={<Truck size={14} />} label="Địa chỉ giao hàng" value={selectedOrder.customerAddress} />
                    <Info label="Email" value={selectedOrder.customerEmail} />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] tracking-widest font-bold text-[#444748] uppercase block">Sản phẩm ({selectedOrder.items.length})</span>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={`${item.productName}-${index}`} className="flex justify-between items-center p-4 bg-white border border-[#c4c7c7]/20 rounded-xl">
                        <div>
                          <h5 className="font-display font-bold text-sm text-[#1b1c1c]">{item.productName}</h5>
                          <p className="text-[10px] text-[#775a19] font-bold tracking-wider uppercase mt-1">{item.finish} | {item.size}</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-sans text-xs font-bold text-[#1b1c1c]">x{item.quantity} cái</span>
                          <span className="block font-mono text-xs text-[#444748] font-semibold mt-0.5">{formatVnd(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex gap-4">
                <button type="button" onClick={() => handlePrintInvoice(selectedOrder)} className="flex-1 py-3.5 border border-[#1b1c1c] text-[#1b1c1c] rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#efeded]/40 flex items-center justify-center gap-2">
                  <Printer size={13} /> In hóa đơn
                </button>
                <button type="button" onClick={() => onSelectOrder(null)} className="flex-1 py-3.5 bg-[#1b1c1c] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#775a19]">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ tone, children }: { tone: "green" | "amber" | "red"; children: React.ReactNode }) {
  const colorClass = tone === "green" ? "bg-green-50 text-green-700 border-green-100" : tone === "red" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100";
  return <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full border ${colorClass}`}>{children}</span>;
}

function Info({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-[#775a19]">{icon}</span>
      <strong>{label}:</strong>
      <span className="font-medium text-[#444748] ml-auto text-right">{value}</span>
    </div>
  );
}
