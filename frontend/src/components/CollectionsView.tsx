/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PRODUCTS, Product } from "../data";
import { api, mapApiProduct } from "../api";
import { formatVnd } from "../format";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollectionsViewProps {
  onSelectProduct: (id: string) => void;
}

type CategoryType = string;

export function CollectionsView({ onSelectProduct }: CollectionsViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [products, setProducts] = React.useState<Product[]>(PRODUCTS);

  React.useEffect(() => {
    api.getProducts("?sort=newest&page=0&size=24")
      .then((page) => setProducts(page.content.map(mapApiProduct)))
      .catch(() => {});
  }, []);

  const filteredProducts = products.filter(p => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const categoriesOrder: { value: CategoryType; label: string }[] = [
    { value: "all", label: "TẤT CẢ" },
    ...Array.from(new Map<string, string>(products.map((product) => [product.category, product.categoryName || product.category])).entries())
      .map(([value, label]) => ({ value, label: label.toUpperCase() }))
  ];

  return (
    <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
      <main className="max-w-[1440px] mx-auto px-6 md:px-20 animate-fade-in">
        
        {/* Editorial Title Header layout */}
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <p className="font-sans text-xs font-bold tracking-[0.25em] text-[#775a19] mb-4 uppercase">
            BỘ SƯU TẬP
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1b1c1c] mb-6 leading-tight select-none">
            Biển số nhà và biển công ty
          </h2>
          <p className="font-sans text-sm text-[#444748] max-w-xl mx-auto font-light leading-relaxed">
            Mỗi sản phẩm có thể tùy chỉnh kích thước, chất liệu và nội dung để phù hợp mặt tiền, văn phòng hoặc căn hộ của bạn.
          </p>

          {/* Luxury Category Filter buttons */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mt-12 border-b border-[#c4c7c7]/20 pb-8">
            {categoriesOrder.map((cat) => (
              <button 
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setCurrentPage(1);
                }}
                className={`font-sans text-xs tracking-widest font-bold pb-2 transition-all duration-300 relative uppercase ${
                  selectedCategory === cat.value 
                    ? "text-[#775a19]" 
                    : "text-[#444748] hover:text-[#1b1c1c]"
                }`}
              >
                {cat.label}
                {selectedCategory === cat.value && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#775a19] animate-in slide-in-from-left duration-300" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* 2-Column Asymmetric Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-y-24 items-start">
          {filteredProducts.map((p, index) => {
            // Give even index cards a slightly staggered margin-top on desktop (asymmetrical editorial rhythm)
            const staggerClass = index % 2 === 1 ? "md:mt-20 lg:mt-32" : "";

            return (
              <div 
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className={`group cursor-pointer flex flex-col justify-between ${staggerClass}`}
              >
                <div className="relative overflow-hidden rounded-[24px] bg-white aspect-[4/5] shadow-sm hover:shadow-2xl transition-all duration-700 hover:scale-[1.01] hover:-translate-y-2">
                  
                  {/* High Resolution Image from Provided Assets */}
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges to match Screenshots exactly */}
                  {p.isNew && (
                    <div className="absolute top-6 right-6 bg-[#775a19] text-white px-4 py-1.5 rounded-full font-sans text-[9px] font-bold tracking-widest border border-white/20 uppercase">
                      MẪU MỚI
                    </div>
                  )}

                  {p.isLimited && (
                    <div className="absolute top-6 right-6 bg-[#1b1c1c] text-white px-4 py-1.5 rounded-full font-sans text-[9px] font-bold tracking-widest border border-white/20 uppercase">
                      GIỚI HẠN
                    </div>
                  )}

                  {/* Hover Overlay containing custom Price Tag Info */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500" />
                  
                  {/* Glass Price details overlay sliding-up beautifully */}
                  <div className="absolute bottom-6 left-6 right-6 glass silk-border rounded-xl p-6 flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 shadow-xl">
                    <div>
                      <h3 className="font-display text-xl text-[#1b1c1c] font-medium">
                        {p.name}
                      </h3>
                      <p className="font-sans text-[9px] tracking-widest text-[#444748] mt-1 uppercase font-bold">
                        {p.subName || p.categoryName || p.category}
                      </p>
                    </div>
                    <p className="font-display text-lg text-[#775a19] font-semibold">
                      {formatVnd(p.price)}
                    </p>
                  </div>
                </div>

                {/* Text underneath fallback for smaller viewports */}
                <div className="mt-4 flex justify-between items-start md:hidden">
                  <div>
                    <h3 className="font-display text-lg text-[#1b1c1c]">{p.name}</h3>
                    <p className="font-sans text-xs text-[#444748]">{p.subName || p.categoryName}</p>
                  </div>
                  <p className="font-sans text-sm font-semibold text-[#775a19]">{formatVnd(p.price)}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Dynamic Pagination based on design specification */}
        {filteredProducts.length > 0 ? (
          <nav className="flex justify-center items-center gap-8 mt-32 border-t border-[#c4c7c7]/20 pt-12">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="text-[#444748] hover:text-[#1b1c1c] transition-colors p-2"
              aria-label="Trang trước"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-8 items-baseline">
              <span className={`font-sans text-xs font-bold border-b-2 border-[#1b1c1c] pb-1 cursor-pointer`}>01</span>
              <span className="font-sans text-xs text-[#444748]/50 hover:text-[#1b1c1c] cursor-pointer transition-colors">02</span>
              <span className="font-sans text-xs text-[#444748]/50 hover:text-[#1b1c1c] cursor-pointer transition-colors">03</span>
              <span className="font-sans text-xs text-[#444748]/30 select-none">...</span>
              <span className="font-sans text-xs text-[#444748]/50 hover:text-[#1b1c1c] cursor-pointer transition-colors">08</span>
            </div>
            <button 
              onClick={() => setCurrentPage(1)}
              className="text-[#444748] hover:text-[#1b1c1c] transition-colors p-2"
              aria-label="Trang sau"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        ) : (
          <div className="text-center py-20 bg-[#f5f3f3] rounded-3xl mt-12 border border-[#c4c7c7]/35">
            <p className="font-display text-xl text-[#444748] italic">Hiện chưa có sản phẩm trong danh mục này.</p>
            <button onClick={() => setSelectedCategory("all")} className="mt-4 px-6 py-2 bg-[#775a19] text-white text-xs tracking-widest uppercase font-bold rounded-full">
              XEM TẤT CẢ
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
