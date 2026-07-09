/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar, Download } from "lucide-react";
import { AdminProduct, AdminOrder } from "./mockAdminData";
import { exportToExcel } from "./exportUtils";

interface AnalyticsViewProps {
  products: AdminProduct[];
  orders: AdminOrder[];
}

type DateFilter = "today" | "week" | "month" | "custom";

export function AnalyticsView({ products, orders }: AnalyticsViewProps) {
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("month");
  const [customRange, setCustomRange] = React.useState({ from: new Date().toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) });

  const filteredOrders = React.useMemo(() => filterOrdersByDate(orders, dateFilter, customRange), [orders, dateFilter, customRange]);
  const activeOrders = filteredOrders.filter((order) => order.deliveryStatus !== "Cancelled");
  const paidOrders = activeOrders.filter((order) => order.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0;
  const paidRate = activeOrders.length > 0 ? Math.round((paidOrders.length / activeOrders.length) * 1000) / 10 : 0;
  const categoryPerformance = React.useMemo(() => buildCategoryPerformance(products, filteredOrders), [products, filteredOrders]);
  const monthlyRevenue = React.useMemo(() => buildMonthlyRevenueData(filteredOrders), [filteredOrders]);
  const territoryDistribution = React.useMemo(() => buildTerritoryDistribution(filteredOrders), [filteredOrders]);
  const topCategory = categoryPerformance[0]?.category || "Chưa có dữ liệu";
  const maxSalePoints = Math.max(1, ...categoryPerformance.map((category) => category.sales));

  const handleExportStats = () => {
    const dataToExport = monthlyRevenue.map((item) => ({
      "Tháng": item.month,
      "Doanh thu": item.revenue,
      "Số đơn": item.orders,
      "Giá trị trung bình": item.orders > 0 ? Math.round(item.revenue / item.orders) : 0,
    }));

    exportToExcel(
      dataToExport,
      ["Tháng", "Doanh thu", "Số đơn", "Giá trị trung bình"],
      ["Tháng", "Doanh thu", "Số đơn", "Giá trị trung bình"],
      "revenue_analytics.xlsx"
    );
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans" id="analytics-tab-view">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
            INTELLIGENCE DESK
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
            Thống kê doanh thu và vận hành
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white border border-[#c4c7c7]/30 rounded-xl p-2 shadow-sm">
          <div className="flex items-center gap-1.5 px-2 bg-[#fbf9f9] border border-[#c4c7c7]/20 rounded-lg text-xs font-semibold py-1">
            <Calendar size={12} className="text-[#775a19]" />
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as DateFilter)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-[#1b1c1c] text-xs cursor-pointer py-0 font-sans"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>

          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customRange.from}
                onChange={(event) => setCustomRange((previous) => ({ ...previous, from: event.target.value }))}
                className="bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded px-2 py-0.5 text-[#1b1c1c]"
              />
              <span className="text-[#444748] font-bold">to</span>
              <input
                type="date"
                value={customRange.to}
                onChange={(event) => setCustomRange((previous) => ({ ...previous, to: event.target.value }))}
                className="bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded px-2 py-0.5 text-[#1b1c1c]"
              />
            </div>
          )}

          <button
            onClick={handleExportStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#775a19] hover:bg-[#5e4713] text-white text-[10px] font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#775a19]/10"
            title="Tải file Excel"
          >
            <Download size={11} />
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Giá trị đơn trung bình" value={`${averageOrderValue.toLocaleString("vi-VN")}đ`} description="Tính từ các đơn đã thanh toán trong khoảng đang lọc." />
        <MetricCard label="Tỷ lệ thanh toán" value={`${paidRate}%`} description="Đơn đã thanh toán trên tổng đơn không bị hủy." />
        <MetricCard label="Danh mục nổi bật" value={topCategory} description="Danh mục có doanh thu cao nhất từ dữ liệu đơn hàng." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#775a19] font-bold tracking-widest uppercase block mb-1">
              KIỂM TRA DANH MỤC
            </span>
            <h4 className="font-display text-lg font-bold text-[#1b1c1c] mb-6">
              Hiệu suất danh mục và tỷ trọng doanh thu
            </h4>

            <div className="space-y-6">
              {categoryPerformance.length > 0 ? categoryPerformance.map((category) => {
                const percent = Math.round((category.sales / maxSalePoints) * 100);
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-baseline text-xs font-semibold text-[#1b1c1c]">
                      <span>{category.category}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[#775a19] font-bold">{category.sales.toLocaleString("vi-VN")}đ</span>
                        <span className="text-[#444748]/50 text-[10px]">({category.count} sản phẩm)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-[#efeded] rounded-full overflow-hidden w-full">
                      <div style={{ width: `${percent}%` }} className="bg-[#775a19] h-full rounded-full transition-all duration-500" />
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs text-[#444748] bg-[#fbf9f9] border border-dashed border-[#c4c7c7]/40 rounded-xl p-6 text-center">
                  Chưa có dữ liệu bán hàng trong khoảng thời gian này.
                </p>
              )}
            </div>
          </div>

          <p className="text-[10px] text-[#444748] font-medium leading-relaxed mt-6 italic pt-4 border-t border-[#c4c7c7]/10">
            * Dữ liệu được tính trực tiếp từ sản phẩm và đơn hàng.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-sm">
          <span className="text-[10px] text-[#775a19] font-bold tracking-widest uppercase block mb-1">
            KHU VỰC KHÁCH HÀNG
          </span>
          <h4 className="font-display text-lg font-bold text-[#1b1c1c] mb-6">
            Phân bổ khu vực khách hàng
          </h4>

          <div className="space-y-4">
            {territoryDistribution.map((item) => (
              <div key={item.name} className="flex justify-between p-4 bg-[#fbf9f9] border border-[#c4c7c7]/10 rounded-xl items-center">
                <div>
                  <h5 className="text-xs font-bold text-[#1b1c1c]">{item.name}</h5>
                  <p className="text-[10px] text-[#444748] font-medium mt-0.5">{item.orders} đơn hàng</p>
                </div>
                <span className="text-xs font-bold text-[#775a19] bg-[#775a19]/10 px-2.5 py-1 rounded-full border border-[#775a19]/20">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#c4c7c7]/20 shadow-md">
      <span className="text-[9px] font-bold tracking-widest text-[#444748] uppercase block">
        {label}
      </span>
      <h3 className="font-display text-3xl font-bold text-[#775a19] mt-2 break-words">
        {value}
      </h3>
      <p className="text-xs text-[#444748] mt-2 font-medium">
        {description}
      </p>
    </div>
  );
}

function filterOrdersByDate(orders: AdminOrder[], filter: DateFilter, customRange: { from: string; to: string }) {
  const today = new Date();
  const start = new Date(today);
  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "week") {
    start.setDate(today.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    const from = new Date(`${customRange.from}T00:00:00`);
    const to = new Date(`${customRange.to}T23:59:59`);
    return orders.filter((order) => {
      const date = new Date(`${order.date}T12:00:00`);
      return date >= from && date <= to;
    });
  }
  return orders.filter((order) => new Date(`${order.date}T12:00:00`) >= start);
}

function buildCategoryPerformance(products: AdminProduct[], orders: AdminOrder[]) {
  const productCategory = new Map(products.map((product) => [product.name, product.categoryName || product.category]));
  const summary = new Map<string, { category: string; sales: number; count: number }>();
  orders
    .filter((order) => order.paymentStatus === "Paid" && order.deliveryStatus !== "Cancelled")
    .forEach((order) => {
      order.items.forEach((item) => {
        const category = productCategory.get(item.productName) || "Khác";
        const current = summary.get(category) || { category, sales: 0, count: 0 };
        current.sales += item.price * item.quantity;
        current.count += item.quantity;
        summary.set(category, current);
      });
    });
  return Array.from(summary.values()).sort((a, b) => b.sales - a.sales);
}

function buildMonthlyRevenueData(orders: AdminOrder[]) {
  const summary = new Map<string, { month: string; revenue: number; orders: number }>();
  orders
    .filter((order) => order.paymentStatus === "Paid" && order.deliveryStatus !== "Cancelled")
    .forEach((order) => {
      const key = order.date.slice(0, 7);
      const current = summary.get(key) || {
        month: new Date(`${key}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
        revenue: 0,
        orders: 0,
      };
      current.revenue += order.totalPrice;
      current.orders += 1;
      summary.set(key, current);
    });
  return Array.from(summary.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => value);
}

function buildTerritoryDistribution(orders: AdminOrder[]) {
  const summary = new Map<string, number>();
  orders.forEach((order) => {
    const parts = order.customerAddress.split(",").map((part) => part.trim()).filter(Boolean);
    const area = parts[parts.length - 1] || "Không rõ khu vực";
    summary.set(area, (summary.get(area) || 0) + 1);
  });
  const total = Math.max(1, orders.length);
  const values = Array.from(summary.entries())
    .map(([name, count]) => ({ name, orders: count, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3);
  return values.length > 0 ? values : [{ name: "Chưa có dữ liệu", orders: 0, percent: 0 }];
}
