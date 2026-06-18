/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, Filter, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, 
  ArrowUpDown, Download, CheckSquare, Square, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { AdminProduct } from "./mockAdminData";
import { exportToExcel } from "./exportUtils";

interface ProductsAdminViewProps {
  products: AdminProduct[];
  onAddProduct: () => void;
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (product: AdminProduct) => void;
  onBulkDelete: (productIds: string[]) => void;
  onBulkStatusUpdate: (productIds: string[], status: "Active" | "Hidden") => void;
}

const STATUS_LABELS: Record<AdminProduct["status"], string> = {
  Active: "Đang bán",
  Hidden: "Đang ẩn",
  "Out of Stock": "Hết hàng",
};

const CATEGORY_LABELS: Record<string, string> = {
  seating: "Khác",
  lighting: "Biển hiệu đèn",
  tables: "Biển số nhà",
  decor: "Trang trí",
};

export function ProductsAdminView({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBulkDelete,
  onBulkStatusUpdate,
}: ProductsAdminViewProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [stockFilter, setStockFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"name" | "price" | "stock">("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Multi-select bulk state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Filter products based on search term, category and stock criteria
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.materials.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" ? true : p.category === categoryFilter;
        
        let matchesStock = true;
        if (stockFilter === "low") {
          matchesStock = p.stock > 0 && p.stock <= 5;
        } else if (stockFilter === "out") {
          matchesStock = p.stock === 0;
        } else if (stockFilter === "instock") {
          matchesStock = p.stock > 5;
        }

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        
        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy, sortDirection]);

  // Adjust pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, categoryFilter, stockFilter]);

  // Pagination metrics
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const toggleSort = (field: "name" | "price" | "stock") => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginatedProducts.map(p => p.id);
    const allSelectedOnPage = currentPageIds.every(id => selectedIds.includes(id));

    if (allSelectedOnPage) {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedIds(prev => [...Array.from(new Set([...prev, ...currentPageIds]))]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportProducts = () => {
    const dataToExport = filteredProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category.toUpperCase(),
      "Price ($)": p.price,
      "Stock Level": p.stock,
      Materials: p.materials,
      Origin: p.origin,
      Dimensions: p.dimensions,
      Status: p.status
    }));

    exportToExcel(
      dataToExport,
      ["ID", "Name", "Category", "Price ($)", "Stock Level", "Materials", "Origin", "Dimensions", "Status"],
      ["ID", "Name", "Category", "Price ($)", "Stock Level", "Materials", "Origin", "Dimensions", "Status"],
      "products_report.xlsx"
    );
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="products-admin-view">
      
      {/* Curation Title & Add action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#c4c7c7]/30 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase block mb-1">
            QUẢN LÝ DANH MỤC
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1b1c1c] tracking-tight">
            Sản phẩm
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 pl-3.5 pr-4 py-2 border border-[#c4c7c7]/60 hover:border-[#1b1c1c] text-[#444748] hover:text-[#1b1c1c] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <Download size={13} />
            Xuất Excel
          </button>
          
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2.5 pl-4 pr-5 py-2.5 bg-[#1b1c1c] text-white hover:bg-[#775a19] transition-all rounded-xl text-xs font-bold tracking-wider uppercase shadow-xl shadow-[#1b1c1c]/10"
            id="curate-new-piece-btn"
          >
            <Plus size={14} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#c4c7c7]/20 rounded-2xl p-4 shadow-sm">
        
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2 w-full">
          <Search size={14} className="text-[#444748]/60" />
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc chất liệu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none placeholder-[#444748]/40 w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">Danh mục:</span>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="seating">Khác</option>
            <option value="lighting">Biển hiệu đèn</option>
            <option value="tables">Biển số nhà</option>
            <option value="decor">Trang trí</option>
          </select>
        </div>

        {/* Stock Warning Levels */}
        <div className="flex items-center gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-xl px-3.5 py-2">
          <span className="text-[10px] font-bold text-[#444748] uppercase">Tồn kho:</span>
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-[#1b1c1c] font-semibold focus:outline-none focus:ring-0 cursor-pointer w-full py-0"
          >
            <option value="all">Tất cả tồn kho</option>
            <option value="instock">Còn nhiều (&gt; 5)</option>
            <option value="low">Sắp hết (&le; 5)</option>
            <option value="out">Hết hàng (0)</option>
          </select>
        </div>

        {/* Selection count context info */}
        <div className="flex items-center justify-end font-mono text-[9px] text-[#444748]/60 px-2 font-bold uppercase">
          {filteredProducts.length} sản phẩm phù hợp
        </div>
      </div>

      {/* BULK ACTION BAR - Shows on row selections */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#775a19]/10 border border-[#775a19]/30 rounded-2xl px-6 py-4 animate-in slide-in-from-top-3">
          <span className="text-xs font-semibold text-[#1b1c1c]">
            Đã chọn <span className="font-bold font-mono bg-[#775a19] text-white rounded-full px-2 py-0.5">{selectedIds.length}</span> sản phẩm
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onBulkStatusUpdate(selectedIds, "Active");
                setSelectedIds([]);
              }}
              className="px-4 py-2 bg-white text-[#775a19] border border-[#775a19]/30 hover:bg-[#775a19] hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              Hiển thị
            </button>
            <button
              onClick={() => {
                onBulkStatusUpdate(selectedIds, "Hidden");
                setSelectedIds([]);
              }}
              className="px-4 py-2 bg-white text-[#444748] border border-[#c4c7c7] hover:bg-[#efeded] rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              Ẩn sản phẩm
            </button>
            <button
              onClick={() => {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              Xóa đã chọn
            </button>
          </div>
        </div>
      )}

      {/* CORE PRODUCTS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-[#c4c7c7]/20 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#c4c7c7]/20 bg-[#fbf9f9]/50">
                <th className="py-4 pl-6 pr-2 w-10">
                  <button 
                    onClick={toggleSelectAll}
                    className="p-1 text-[#444748] hover:text-[#1b1c1c] transition-colors"
                  >
                    {paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p.id)) ? (
                      <CheckSquare className="w-4 h-4 text-[#775a19]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Ảnh</th>
                
                <th className="py-4 px-2 text-[9px] font-bold tracking-widest uppercase text-[#444748] cursor-pointer hover:text-[#1b1c1c]" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-1">
                    Tên & thông số
                    <ArrowUpDown size={10} />
                  </div>
                </th>
                
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748]">Danh mục</th>
                
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] cursor-pointer hover:text-[#1b1c1c] text-right" onClick={() => toggleSort("price")}>
                  <div className="flex items-center gap-1 justify-end">
                    Giá
                    <ArrowUpDown size={10} />
                  </div>
                </th>
                
                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] cursor-pointer hover:text-[#1b1c1c] text-right" onClick={() => toggleSort("stock")}>
                  <div className="flex items-center gap-1 justify-end">
                    Tồn kho
                    <ArrowUpDown size={10} />
                  </div>
                </th>

                <th className="py-4 px-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-center">Trạng thái</th>
                <th className="py-4 pr-6 pl-4 text-[9px] font-bold tracking-widest uppercase text-[#444748] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c7c7]/10 text-xs">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr 
                      key={p.id}
                      className={`hover:bg-[#efeded]/20 transition-colors ${isSelected ? "bg-[#775a19]/5" : ""}`}
                    >
                      <td className="py-4 pl-6 pr-2">
                        <button 
                          onClick={() => toggleSelectRow(p.id)}
                          className={`p-1 ${isSelected ? "text-[#775a19]" : "text-[#444748]"}`}
                        >
                          {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      
                      {/* Image Preview thumbnail with fallback error check */}
                      <td className="py-4 px-4">
                        <div className="w-12 h-16 bg-[#efeded] rounded-lg overflow-hidden border border-[#c4c7c7]/15">
                          <img 
                            src={p.image} 
                            referrerPolicy="no-referrer" 
                            alt={p.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as any).src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=120";
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        <div className="max-w-[200px] md:max-w-xs">
                          <h4 className="font-display font-medium text-sm text-[#1b1c1c] leading-snug">{p.name}</h4>
                          <span className="text-[9px] text-[#444748] block truncate leading-tight uppercase font-semibold mt-1 font-sans">{p.materials}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 uppercase text-[9px] font-bold tracking-wider text-[#444748]">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </td>

                      <td className="py-4 px-4 text-right font-display font-bold text-sm text-[#1b1c1c]">
                        {p.price.toLocaleString("vi-VN")} đ
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className={`font-mono font-medium ${p.stock <= 5 ? "text-red-700 font-bold" : "text-[#1b1c1c]"}`}>
                          {p.stock} cái
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                          p.status === "Active"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : p.status === "Hidden"
                            ? "bg-amber-50 text-amber-700 border border-[#fed488]/30"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>

                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 text-[#444748] hover:text-[#775a19] hover:bg-[#efeded]/50 rounded-lg transition-colors"
                            title="Sửa sản phẩm"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p)}
                            className="p-1.5 text-[#444748] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center flex-col justify-center text-[#444748]">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-[#c4c7c7]" />
                      <p className="font-display font-semibold text-base italic">Không tìm thấy sản phẩm</p>
                      <button 
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                          setStockFilter("all");
                        }}
                        className="px-4 py-1.5 border border-[#775a19] text-[#775a19] rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-[#775a19] hover:text-white transition-all"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION INTERACTIVE PANELS FOOTER */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#fbf9f9]/50 border-t border-[#c4c7c7]/20 flex justify-between items-center text-xs">
            <span className="text-[#444748] font-medium">
              Hiển thị <span className="font-bold text-[#1b1c1c]">{(currentPage - 1) * itemsPerPage + 1}</span> đến{" "}
              <span className="font-bold text-[#1b1c1c]">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              trong <span className="font-bold text-[#1b1c1c]">{totalItems}</span> sản phẩm
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 border border-[#c4c7c7]/60 rounded-xl hover:bg-white text-[#444748] hover:text-[#1b1c1c] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-mono font-bold text-[#1b1c1c] px-2.5">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 border border-[#c4c7c7]/60 rounded-xl hover:bg-white text-[#444748] hover:text-[#1b1c1c] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
