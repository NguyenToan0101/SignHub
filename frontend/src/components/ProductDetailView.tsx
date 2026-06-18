/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PRODUCTS, Product } from "../data";
import { api, mapApiProduct } from "../api";
import { formatVnd } from "../format";
import { Plus, Minus, ArrowRight, Star, AlertCircle, ShoppingCart } from "lucide-react";

interface ProductDetailViewProps {
  productId: string;
  onAddToCart: (product: Product, quantity: number, finish: string, size: string) => void;
  onSelectProduct: (id: string) => void;
}

export function ProductDetailView({ productId, onAddToCart, onSelectProduct }: ProductDetailViewProps) {
  const fallbackProduct = PRODUCTS.find((p) => p.id === productId) || PRODUCTS.find((p) => p.id === "serenity-lounge-chair") || PRODUCTS[0];
  const [product, setProduct] = React.useState<Product>(fallbackProduct);
  const [relatedItems, setRelatedItems] = React.useState<Product[]>(PRODUCTS.filter((p) => p.id !== fallbackProduct.id).slice(0, 3));

  const [activeSlide, setActiveSlide] = React.useState(0);
  const [selectedFinish, setSelectedFinish] = React.useState("Theo mẫu");
  const [selectedSize, setSelectedSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<"desc" | "specs" | "shipping">("desc");

  React.useEffect(() => {
    const localFallback = PRODUCTS.find((p) => p.id === productId) || fallbackProduct;
    setProduct(localFallback);
    setRelatedItems(PRODUCTS.filter((p) => p.id !== localFallback.id).slice(0, 3));
    setActiveSlide(0);

    api.getProduct(productId)
      .then((item) => {
        const mapped = mapApiProduct(item);
        setProduct(mapped);
        setSelectedSize(mapped.variants?.find((variant) => variant.active)?.size || "");
      })
      .catch(() => {});

    api.getRelatedProducts(productId)
      .then((items) => setRelatedItems(items.map(mapApiProduct).slice(0, 3)))
      .catch(() => {});
  }, [productId]);

  // Dynamically change slide image gallery
  const gallery = product.gallery && product.gallery.length > 0 
    ? [product.image, ...product.gallery] 
    : [product.image, product.image, product.image];

  const selectedVariant = product.variants?.find((variant) => variant.size === selectedSize);
  const calculatedPrice = product.price + (selectedVariant?.extraPrice || 0);

  const finishes = [
    { name: "Theo mẫu", color: "bg-[#E5E2E1]" },
    { name: "Nền đen", color: "bg-[#303031]" },
    { name: "Viền vàng", color: "bg-[#775a19]" }
  ];

  return (
    <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
      <main className="max-w-[1440px] mx-auto px-6 md:px-20 animate-fade-in">
        
        {/* Main Grid: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Side: Dynamic Gallery Carousel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] silk-border bg-white shadow-md group">
              <img 
                src={gallery[activeSlide]} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 transition-opacity duration-300 select-none"
                referrerPolicy="no-referrer"
              />
              
              {/* Micro-carousel dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {gallery.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeSlide === i ? "bg-[#775a19] scale-125" : "bg-[#c4c7c7] opacity-60"
                    }`}
                    aria-label={`Chuyển đến ảnh ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail selector grids */}
            <div className="grid grid-cols-4 gap-4">
              {gallery.slice(0, 3).map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`aspect-square rounded-xl overflow-hidden silk-border cursor-pointer transition-all duration-300 ${
                    activeSlide === i ? "ring-2 ring-[#775a19] opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Detail" className="w-full h-full object-contain p-1 bg-white" />
                </div>
              ))}
              <div className="aspect-square rounded-xl overflow-hidden silk-border flex items-center justify-center bg-[#efeded] text-[#444748] font-sans text-xs tracking-widest font-bold">
                +2 ẢNH
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Configuration Options */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <header className="border-b border-[#c4c7c7]/30 pb-6">
              <span className="font-sans text-[10px] tracking-[0.25em] text-[#775a19] uppercase font-bold block mb-3">
                SẢN PHẨM / {product.categoryName || product.category}
              </span>
              <h1 className="font-display text-4xl lg:text-5xl text-[#1b1c1c] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="font-display text-2xl text-[#775a19] font-medium mt-1">
                {formatVnd(calculatedPrice)}
              </p>
            </header>

            {/* Options configuration */}
            <div className="flex flex-col gap-8">
              
              {/* 1. Finish Selection */}
              <div>
                <span className="font-sans text-xs tracking-widest font-bold text-[#1b1c1c] mb-4 block uppercase">
                  MÀU/HOÀN THIỆN: <span className="font-normal text-[#444748] text-xs">({selectedFinish})</span>
                </span>
                <div className="flex gap-4">
                  {finishes.map((f) => (
                    <button 
                      key={f.name}
                      onClick={() => setSelectedFinish(f.name)}
                      className={`w-10 h-10 rounded-full ${f.color} transition-all relative ${
                        selectedFinish === f.name 
                          ? "ring-2 ring-offset-2 ring-[#775a19] scale-110" 
                          : "ring-1 ring-[#c4c7c7]/40 hover:scale-105"
                      }`}
                      title={f.name}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Size Selection */}
              <div>
                <span className="font-sans text-xs tracking-widest font-bold text-[#1b1c1c] mb-4 block uppercase">
                  KÍCH THƯỚC
                </span>
                <div className="flex gap-4">
                  {(product.variants && product.variants.length > 0 ? product.variants : [{ id: "", size: "Theo yêu cầu", extraPrice: 0, stockQuantity: 0, active: true }]).map((variant) => (
                    <button
                      key={variant.id || variant.size}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`flex-1 py-3 px-6 rounded-full font-sans text-xs tracking-widest font-bold border transition-all ${
                        selectedSize === variant.size
                          ? "bg-white border-[#775a19] text-[#775a19] shadow-sm font-bold"
                          : "border-[#c4c7c7]/50 text-[#444748] hover:bg-[#efeded]/30"
                      }`}
                    >
                      {variant.size}{variant.extraPrice > 0 ? ` (+${formatVnd(variant.extraPrice)})` : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Quantity & Add to Cart button */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-4">
                <div className="flex items-center justify-between border border-[#c4c7c7]/40 rounded-full px-5 py-3 w-full sm:w-auto bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#444748] hover:text-[#775a19] transition-colors p-1"
                    aria-label="Giảm số lượng"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-6 font-sans text-sm font-semibold select-none text-[#1b1c1c] min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#444748] hover:text-[#775a19] transition-colors p-1"
                    aria-label="Tăng số lượng"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => {
                    onAddToCart(product, quantity, selectedFinish, selectedSize);
                    setQuantity(1);
                  }}
                  className="flex-1 bg-[#1b1c1c] text-white py-4 px-8 rounded-full font-sans text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#775a19] transition-all duration-500 shadow-xl hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} />
                  THÊM VÀO GIỎ
                </button>
              </div>

              {/* Find in Store action */}
              <button className="w-full py-4 border border-[#747878] rounded-full font-sans text-xs tracking-widest uppercase font-bold hover:bg-[#1b1c1c] hover:text-white transition-all duration-300">
                LIÊN HỆ XƯỞNG TƯ VẤN
              </button>
            </div>

            {/* Editorial tabs specifications */}
            <div className="mt-8 border-t border-[#c4c7c7]/20 pt-8">
              <div className="flex border-b border-[#c4c7c7]/20 mb-6 gap-6">
                <button 
                  onClick={() => setActiveTab("desc")}
                  className={`pb-3 font-sans text-xs tracking-widest font-bold transition-all ${
                    activeTab === "desc" ? "border-b-2 border-[#1b1c1c] text-[#1b1c1c]" : "text-[#444748] hover:text-[#1b1c1c]"
                  }`}
                >
                  MÔ TẢ
                </button>
                <button 
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 font-sans text-xs tracking-widest font-bold transition-all ${
                    activeTab === "specs" ? "border-b-2 border-[#1b1c1c] text-[#1b1c1c]" : "text-[#444748] hover:text-[#1b1c1c]"
                  }`}
                >
                  THÔNG SỐ
                </button>
                <button 
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-3 font-sans text-xs tracking-widest font-bold transition-all ${
                    activeTab === "shipping" ? "border-b-2 border-[#1b1c1c] text-[#1b1c1c]" : "text-[#444748] hover:text-[#1b1c1c]"
                  }`}
                >
                  GIAO HÀNG
                </button>
              </div>

              <div className="text-[#444748] text-sm leading-relaxed font-light min-h-[120px]">
                {activeTab === "desc" && (
                  <p className="animate-fade-in text-justify">
                    {product.desc}
                    <br /><br />
                    Sản phẩm được thiết kế và gia công tại Việt Nam. Bạn có thể duyệt nội dung, màu sắc và kích thước trước khi sản xuất.
                  </p>
                )}

                {activeTab === "specs" && (
                  <ul className="space-y-3 animate-fade-in">
                    {product.specs && product.specs.length > 0 ? (
                      product.specs.map((spec, i) => (
                        <li key={i} className="flex justify-between border-b border-[#c4c7c7]/10 pb-2 text-xs">
                          <span className="font-sans tracking-widest uppercase font-bold text-[10px] text-[#775a19]">
                            {spec.label}
                          </span>
                          <span className="text-[#1b1c1c] font-medium">
                            {spec.value}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs">Có thể tùy chỉnh chất liệu và kích thước theo yêu cầu.</li>
                    )}
                  </ul>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <p>
                      <strong>Giao hàng nội địa:</strong> 3-5 ngày làm việc sau khi duyệt mẫu và hoàn tất sản xuất.
                    </p>
                    <p>
                      <strong>Nhận tại xưởng:</strong> Có thể hẹn lịch nhận trực tiếp hoặc giao nhanh trong nội thành tùy khu vực.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Pairs Elegantly With section */}
        <section className="mt-32 border-t border-[#c4c7c7]/20 pt-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-[#1b1c1c]">
              Sản phẩm liên quan
            </h2>
            <button 
              onClick={() => onSelectProduct(relatedItems[0].id)}
              className="font-sans text-xs tracking-widest text-[#775a19] underline underline-offset-8 font-bold hover:opacity-85"
            >
              XEM MẪU KHÁC
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectProduct(item.id)}
                className="group cursor-pointer flex flex-col gap-4"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-white silk-border relative shadow-sm hover:shadow-lg transition-all duration-500">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-sans text-xs tracking-widest text-[#1b1c1c] font-bold uppercase">
                    {item.name}
                  </h3>
                  <p className="text-[#775a19] text-sm font-semibold mt-1">
                    {formatVnd(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
