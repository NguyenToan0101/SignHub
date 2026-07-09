/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  TrendingUp, ShoppingCart, Inbox, Users, AlertCircle, ArrowRight, ArrowUpRight, ShieldCheck 
} from "lucide-react";
import { AdminProduct, AdminOrder, AdminCustomer } from "./mockAdminData";
import { formatVnd } from "../../format";
interface DashboardViewProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  lowStockThreshold: number;
  onNavigateToTab: (tab: string) => void;
  onSelectOrder: (order: AdminOrder) => void;
}

export function DashboardView({ 
  products, 
  orders, 
  customers, 
  lowStockThreshold,
  onNavigateToTab, 
  onSelectOrder 
}: DashboardViewProps) {

  // 1. Calculate realistic KPIs from memory arrays
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Paid" && o.deliveryStatus !== "Cancelled")
    .reduce((acc, o) => acc + o.totalPrice, 0);

  const activeOrders = orders.filter(o => o.deliveryStatus !== "Delivered" && o.deliveryStatus !== "Cancelled").length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  
  // Best seller logic from orders items count
  const itemsCounter: { [name: string]: { count: number; image: string; price: number } } = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const matchProd = products.find(p => p.name === item.productName);
      const img = matchProd ? matchProd.image : "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=120";
      if (itemsCounter[item.productName]) {
        itemsCounter[item.productName].count += item.quantity;
      } else {
        itemsCounter[item.productName] = { count: item.quantity, image: img, price: item.price };
      }
    });
  });

  const bestSellers = Object.entries(itemsCounter)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // SVG dimensions for Monthly Revenue Line Chart
  const svgWidth = 500;
  const svgHeight = 180;
  const monthlyRevenueData = buildMonthlyRevenueData(orders);
  const maxRevenue = Math.max(1, ...monthlyRevenueData.map((item) => item.revenue));
  const points = monthlyRevenueData.map((d, index) => {
    const x = monthlyRevenueData.length === 1 ? svgWidth / 2 : 50 + (index * (svgWidth - 100)) / (monthlyRevenueData.length - 1);
    const y = svgHeight - 30 - (d.revenue * (svgHeight - 70)) / maxRevenue;
    return { x, y, label: d.month, revenue: d.revenue };
  });

  const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Order delivery status counts for status chart
  const statusSummary = {
    Processing: orders.filter(o => o.deliveryStatus === "Processing").length,
    Shipped: orders.filter(o => o.deliveryStatus === "Shipped").length,
    Delivered: orders.filter(o => o.deliveryStatus === "Delivered").length,
    Cancelled: orders.filter(o => o.deliveryStatus === "Cancelled").length,
  };

  return (
    <div className="space-y-10 animate-fade-in" id="dashboard-tab-view">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
            Tổng quan
          </span>
          <h1 className="font-display text-4xl font-bold text-[#1b1c1c] tracking-tight">
            Bàn điều khiển của người phụ trách
          </h1>
          <p className="font-sans text-xs text-[#444748] mt-1.5 leading-relaxed max-w-xl">
            Điều chỉnh tối ưu sự hài hòa không gian, yêu cầu của khách hàng và hàng tồn kho thủ công. Nhật ký hoạt động xưởng tại Thành phố Đà Nẵng theo thời gian thực.
          </p>
        </div>
        <div className="mt-4 md:mt-0 font-mono text-[10px] text-[#444748] bg-white border border-[#c4c7c7]/30 rounded-xl px-4 py-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#775a19] rounded-full animate-ping" />
          UTC CENTRAL SYNC: ACTIVE
        </div>
      </div>

      {/* 1. FOUR STATISTIC CARDS WITH LUXURY EDITORIAL STYLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-statistics">
        
        {/* Total Revenue Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36 relative overflow-hidden group hover:border-[#775a19]/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#444748] font-sans">
              Tổng doanh thu (VND)
            </span>
            <TrendingUp size={16} className="text-[#775a19]" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
               {formatVnd(totalRevenue)} 
            </h3>
            <span className="text-[9px] text-[#775a19] font-bold tracking-wider uppercase block mt-1.5">
              ▲ 18.4% SO VỚI KỲ TRƯỚC
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#775a19]/5 rounded-bl-[100%] translate-x-8 -translate-y-8 duration-500 group-hover:scale-110" />
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36 relative overflow-hidden group hover:border-[#775a19]/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#444748] font-sans">
              GIAO DỊCH ĐANG HOẠT ĐỘNG
            </span>
            <ShoppingCart size={16} className="text-[#775a19]" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
              {activeOrders} đang chờ
            </h3>
            <span className="text-[9px] text-[#444748] font-bold tracking-wider uppercase block mt-1.5">
              {orders.length} TỔNG SỐ HÓA ĐƠN ĐÃ NỘP
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#775a19]/5 rounded-bl-[100%] translate-x-8 -translate-y-8 duration-500 group-hover:scale-110" />
        </div>

        {/* Total Products Curation Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36 relative overflow-hidden group hover:border-[#775a19]/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#444748] font-sans">
              SẢN PHẨM ĐÃ BÁN
            </span>
            <Inbox size={16} className="text-[#775a19]" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
              {products.length} sản phẩm
            </h3>
            <span className="text-[9px] text-[#775a19] font-bold tracking-wider uppercase block mt-1.5">
              {outOfStockCount > 0 ? `${outOfStockCount} MỘT SỐ SẢN PHẨM HẾT HÀNG` : "TẤT CẢ KHO LƯU TRỮ ĐỀU ĐẦY ĐỦ"}
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#775a19]/5 rounded-bl-[100%] translate-x-8 -translate-y-8 duration-500 group-hover:scale-110" />
        </div>

        {/* Total Client Registrations Page */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between h-36 relative overflow-hidden group hover:border-[#775a19]/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-widest font-bold uppercase text-[#444748] font-sans">
             NGƯỜI DÙNG ĐĂNG KÍ
            </span>
            <Users size={16} className="text-[#775a19]" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
              {customers.length} người
            </h3>
            <span className="text-[9px] text-[#444748] font-bold tracking-wider uppercase block mt-1.5">
              VIET NAM
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#775a19]/5 rounded-bl-[100%] translate-x-8 -translate-y-8 duration-500 group-hover:scale-110" />
        </div>

      </div>

      {/* 2. GRIDS: INTEGRATED SVG CHARTS CARD & LOW-STOCK ALERT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Chart Component - Custom Styled Golden Curve */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <span className="text-[9px] text-[#775a19] font-bold tracking-widest uppercase block">
                BÁO CÁO TÀI CHÍNH HÀNG THÁNG
              </span>
              <h4 className="font-display text-lg text-[#1b1c1c] font-semibold mt-0.5">
                Doanh thu theo tháng
              </h4>
            </div>
            <span className="text-[10px] text-[#444748] font-mono">EST. CAP: $150K</span>
          </div>

          {/* SVG line-graph rendered on light gray background */}
          <div className="bg-[#fbf9f9] border border-[#c4c7c7]/10 p-4 rounded-xl flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                {/* Back grids */}
                <line x1="50" y1="30" x2="450" y2="30" stroke="#efeded" strokeDasharray="4 4" />
                <line x1="50" y1="75" x2="450" y2="75" stroke="#efeded" strokeDasharray="4 4" />
                <line x1="50" y1="110" x2="450" y2="110" stroke="#efeded" strokeDasharray="4 4" />
                <line x1="50" y1="150" x2="450" y2="150" stroke="#c4c7c7" strokeWidth="0.5" />

                {/* Y-axis metrics */}
                <text x="15" y="34" className="fill-[#444748]/60 text-[8px] font-mono leading-none">{formatShortMoney(maxRevenue)}</text>
                <text x="15" y="79" className="fill-[#444748]/60 text-[8px] font-mono leading-none">{formatShortMoney(maxRevenue / 2)}</text>
                <text x="15" y="114" className="fill-[#444748]/60 text-[8px] font-mono leading-none">0</text>

                {/* Line Path */}
                <path d={linePath} fill="none" stroke="#775a19" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Coordinate dots & values */}
                {points.map((pt, idx) => (
                  <g key={idx} className="group/coord cursor-pointer">
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="4" 
                      fill="#775a19" 
                      stroke="#white" 
                      strokeWidth="1.5"
                      className="transition-all duration-300 hover:r-6" 
                    />
                    <text 
                      x={pt.x} 
                      y={pt.y - 12} 
                      textAnchor="middle" 
                      className="fill-[#1b1c1c] text-[8px] font-mono font-bold opacity-0 group-hover/coord:opacity-100 transition-opacity bg-white px-1"
                    >
                      {formatShortMoney(pt.revenue)}
                    </text>
                    <text 
                      x={pt.x} 
                      y="168" 
                      textAnchor="middle" 
                      className="fill-[#444748] text-[8px] font-semibold"
                    >
                      {pt.label.split(" ")[0]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#c4c7c7]/10">
            <span className="text-[10px] text-[#444748] font-sans">
              Dữ liệu được tính trực tiếp từ đơn hàng .
            </span>
            <button 
              onClick={() => onNavigateToTab("analytics")}
              className="text-[#775a19] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 hover:opacity-75 transition-opacity"
            >
              THỐNG KÊ CỤ THỂ <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* LOW-STOCK ALERTS PANEL */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-red-700 font-bold tracking-widest uppercase block">
              CẢNH BÁO
            </span>
            <h4 className="font-display text-lg text-[#1b1c1c] font-semibold mt-0.5">
              Cảnh báo sắp hết hàng
            </h4>
            
            <div className="mt-4 space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="flex gap-3 bg-red-50/50 border border-red-100 p-3 rounded-xl items-center justify-between">
                    <div className="flex gap-3.5 items-center min-w-0">
                      <div className="w-10 h-12 bg-[#efeded] rounded overflow-hidden flex-shrink-0 border border-[#c4c7c7]/10">
                        <img src={p.image} referrerPolicy="no-referrer" className="w-full h-full object-cover bg-white" alt={p.name} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-[#1b1c1c] truncate">{p.name}</h5>
                        <p className="text-[9px] text-[#444748] font-semibold uppercase">{p.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded-full">
                        {p.stock} units
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center flex flex-col items-center justify-center text-[#444748] gap-2 bg-[#fbf9f9] border border-dashed border-[#c4c7c7]/40 rounded-xl">
                  <ShieldCheck className="text-[#c4c7c7] w-10 h-10" />
                  <p className="text-xs font-semibold italic">Đảm bảo an toàn. Tất cả sản phẩm đều có sẵn trong kho.</p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab("products")}
            className="w-full mt-4 text-center py-2.5 border border-[#c4c7c7]/60 hover:border-[#1b1c1c] text-[#444748] hover:text-[#1b1c1c] transition-colors rounded-xl font-sans text-[10px] font-bold tracking-wider uppercase block"
          >
            QUẢN LÍ SẢN PHẨM
          </button>
        </div>

      </div>

      {/* 3. GRIDS: RECENT ORDERS TABLE & BEST SELLING CARD PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)] lg:col-span-2">
          <div className="flex justify-between items-baseline mb-5">
            <div>
              <span className="text-[9px] text-[#775a19] font-bold tracking-widest uppercase block">
                ĐƠN HÀNG
              </span>
              <h4 className="font-display text-lg text-[#1b1c1c] font-semibold mt-0.5">
                Đơn hàng gần đây
              </h4>
            </div>
            <button 
              onClick={() => onNavigateToTab("orders")}
              className="text-[#775a19] text-[10px] font-bold tracking-wider uppercase hover:opacity-75"
            >
              TẤT CẢ ĐƠN HÀNG
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c4c7c7]/20 pb-2">
                  <th className="text-[9px] font-bold tracking-wider uppercase text-[#444748] py-2">Invoice No</th>
                  <th className="text-[9px] font-bold tracking-wider uppercase text-[#444748] py-2">Khách hàng</th>
                  <th className="text-[9px] font-bold tracking-wider uppercase text-[#444748] py-2">Ngày</th>
                  <th className="text-[9px] font-bold tracking-wider uppercase text-[#444748] py-2">Cost</th>
                  <th className="text-[9px] font-bold tracking-wider uppercase text-[#444748] py-2">Vận chuyển</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c7c7]/10 text-xs">
                {orders.slice(0, 4).map((ord) => (
                  <tr 
                    key={ord.id} 
                    onClick={() => onSelectOrder(ord)}
                    className="hover:bg-[#efeded]/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono font-bold text-[#1b1c1c]">#{ord.invoiceNo}</td>
                    <td className="py-3 font-semibold text-[#1b1c1c]">{ord.customerName}</td>
                    <td className="py-3 text-[#444748] font-medium">{ord.date}</td>
                    <td className="py-3 font-bold text-[#775a19]">{formatVnd(ord.totalPrice)}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                        ord.deliveryStatus === "Delivered" 
                          ? "bg-green-50 text-green-700 border border-green-100" 
                          : ord.deliveryStatus === "Cancelled"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {ord.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BEST SELLING PRODUCTS COLUMN */}
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div>
            <span className="text-[9px] text-[#775a19] font-bold tracking-widest uppercase block">
              Sản phẩm 
            </span>
            <h4 className="font-display text-lg text-[#1b1c1c] font-semibold mt-0.5">
              Sản phẩm bán chạy
            </h4>

            <div className="mt-5 space-y-4">
              {bestSellers.map((bs, index) => (
                <div key={bs.name} className="flex gap-3.5 items-center p-2.5 border border-[#c4c7c7]/10 rounded-xl hover:bg-[#efeded]/30 transition-colors">
                  <span className="font-display font-bold text-[#775a19] text-xl w-6 text-center">
                    0{index + 1}
                  </span>
                  <div className="w-12 h-14 bg-[#efeded] rounded-lg overflow-hidden border border-[#c4c7c7]/10 flex-shrink-0">
                    <img src={bs.image} referrerPolicy="no-referrer" alt={bs.name} className="w-full h-full object-cover bg-white" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h5 className="text-[11px] font-bold text-[#1b1c1c] truncate">{bs.name}</h5>
                    <p className="text-[9px] text-[#444748] tracking-wider uppercase font-semibold">
                      ${bs.price.toLocaleString("en-US")}.00 | <span className="text-[#775a19] font-bold">{bs.count} sold</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function buildMonthlyRevenueData(orders: AdminOrder[]) {
  const monthKeys: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }

  const revenueByMonth = new Map(monthKeys.map((key) => [key, { revenue: 0, orders: 0 }]));
  orders
    .filter((order) => order.paymentStatus === "Paid" && order.deliveryStatus !== "Cancelled")
    .forEach((order) => {
      const key = order.date?.slice(0, 7);
      if (!key) return;
      if (!revenueByMonth.has(key)) revenueByMonth.set(key, { revenue: 0, orders: 0 });
      const item = revenueByMonth.get(key)!;
      item.revenue += order.totalPrice;
      item.orders += 1;
    });

  return Array.from(revenueByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, value]) => ({
      month: new Date(`${key}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
      ...value,
    }));
}

function formatShortMoney(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return `${Math.round(value)}`;
}
