/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Menu, ShoppingBag, Search, Mail, MessageSquare, Phone, X, ShoppingCart, Info, Globe, ShieldCheck, Heart, User, Home, BookOpen } from "lucide-react";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  cartCount: number;
  openCart: () => void;
}

export function Navbar({ activePage, setActivePage, cartCount, openCart }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f9]/80 backdrop-blur-xl border-b border-[#c4c7c7]/30 h-20 transition-all duration-300">
        <nav className="flex justify-between items-center px-6 md:px-20 h-full max-w-[1440px] mx-auto relative">
          
          {/* Left Menu Icon */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1b1c1c] p-2 hover:opacity-70 transition-opacity"
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8">
              <button 
                onClick={() => setActivePage("collections")}
                className={`font-sans text-xs tracking-widest uppercase font-semibold transition-colors relative pb-1 group ${
                  activePage === "collections" ? "text-brand-gold" : "text-[#444748] hover:text-[#1b1c1c]"
                }`}
              >
                Sản phẩm
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#775a19] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activePage === "collections" ? "scale-x-100" : ""}`} />
              </button>
              <button 
                onClick={() => setActivePage("editorial")}
                className={`font-sans text-xs tracking-widest uppercase font-semibold transition-colors relative pb-1 group ${
                  activePage === "editorial" ? "text-brand-gold" : "text-[#444748] hover:text-[#1b1c1c]"
                }`}
              >
                Tư vấn
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#775a19] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activePage === "editorial" ? "scale-x-100" : ""}`} />
              </button>
              <button 
                onClick={() => setActivePage("story")}
                className={`font-sans text-xs tracking-widest uppercase font-semibold transition-colors relative pb-1 group ${
                  activePage === "story" ? "text-brand-gold" : "text-[#444748] hover:text-[#1b1c1c]"
                }`}
              >
                Câu chuyện
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#775a19] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activePage === "story" ? "scale-x-100" : ""}`} />
              </button>
            </div>
          </div>

          {/* Brand Logo - Absolute Center */}
          <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => setActivePage("home")}>
            <h1 className="font-display text-2xl md:text-3xl tracking-[0.25em] text-[#1b1c1c] select-none hover:opacity-80 transition-opacity">
              SIGNHUB
            </h1>
          </div>

          {/* Trailing Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActivePage("admin")}
              className={`p-1.5 hover:text-brand-gold transition-colors flex items-center gap-1.5 ${activePage === "admin" ? "text-brand-gold" : "text-[#1b1c1c]"}`}
              title="Vào trang quản trị SignHub"
              id="topbar-admin-portal-trigger"
            >
              <ShieldCheck size={19} className="stroke-[1.75]" />
              <span className="hidden lg:inline text-[8px] font-bold tracking-widest uppercase text-[#444748] hover:text-[#1b1c1c]">Quản trị</span>
            </button>
            <button 
              onClick={() => setActivePage("collections")}
              className="text-[#1b1c1c] p-2 hover:opacity-70 transition-opacity"
              aria-label="Tìm kiếm"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={openCart}
              className="text-[#1b1c1c] p-2 hover:opacity-70 transition-opacity relative"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-gold text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Curtain Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-[#fbf9f9] flex flex-col justify-between p-10 animate-in fade-in duration-300">
          <div className="flex flex-col gap-8 mt-10">
            <button 
              onClick={() => { setActivePage("home"); setIsMobileMenuOpen(false); }}
              className={`font-display text-3xl text-left tracking-wide ${activePage === "home" ? "text-brand-gold" : ""}`}
            >
              TRANG CHỦ
            </button>
            <button 
              onClick={() => { setActivePage("collections"); setIsMobileMenuOpen(false); }}
              className={`font-display text-3xl text-left tracking-wide ${activePage === "collections" ? "text-brand-gold" : ""}`}
            >
              SẢN PHẨM
            </button>
            <button 
              onClick={() => { setActivePage("editorial"); setIsMobileMenuOpen(false); }}
              className={`font-display text-3xl text-left tracking-wide ${activePage === "editorial" ? "text-brand-gold" : ""}`}
            >
              GÓC TƯ VẤN
            </button>
            <button 
              onClick={() => { setActivePage("story"); setIsMobileMenuOpen(false); }}
              className={`font-display text-3xl text-left tracking-wide ${activePage === "story" ? "text-brand-gold" : ""}`}
            >
              CÂU CHUYỆN
            </button>
            <button 
              onClick={() => { setActivePage("checkout"); setIsMobileMenuOpen(false); }}
              className={`font-display text-3xl text-left tracking-wide ${activePage === "checkout" ? "text-brand-gold" : ""}`}
            >
              THANH TOÁN
            </button>
          </div>

          <div className="border-t border-[#c4c7c7]/30 pt-8 text-xs text-[#444748] tracking-widest">
            <p className="mb-2">THIẾT KẾ VÀ GIA CÔNG BIỂN SỐ</p>
            <p>TP. HỒ CHÍ MINH, VIỆT NAM</p>
          </div>
        </div>
      )}
    </>
  );
}

interface FooterProps {
  setActivePage: (page: string) => void;
}

export function Footer({ setActivePage }: FooterProps) {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white border-t border-[#c4c7c7] py-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-[1440px] mx-auto text-[#1b1c1c]">
      <div className="md:col-span-1 flex flex-col justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-[0.2em] text-[#1b1c1c] mb-6">SIGNHUB</h1>
          <p className="font-sans text-sm text-[#444748] leading-relaxed max-w-xs">
            Thiết kế và gia công biển số nhà, biển công ty, bảng phòng ban theo yêu cầu với bản duyệt rõ ràng trước khi sản xuất.
          </p>
        </div>
        <p className="font-sans text-[10px] tracking-widest text-[#444748]/60 mt-12 hidden md:block">
          © 2026 SIGNHUB. THIẾT KẾ VÀ GIA CÔNG BIỂN SỐ.
        </p>
      </div>

      <div>
        <h6 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-brand-gold mb-6">SẢN PHẨM</h6>
        <ul className="space-y-4 text-sm text-[#444748]">
          <li>
            <button onClick={() => setActivePage("collections")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Mẫu mới
            </button>
          </li>
          <li>
            <button onClick={() => setActivePage("collections")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Biển số nhà
            </button>
          </li>
          <li>
            <button onClick={() => setActivePage("collections")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Biển công ty
            </button>
          </li>
          <li>
            <button onClick={() => setActivePage("story")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Thiết kế theo yêu cầu
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h6 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-brand-gold mb-6">THÔNG TIN</h6>
        <ul className="space-y-4 text-sm text-[#444748]">
          <li>
            <button onClick={() => setActivePage("story")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Xưởng gia công
            </button>
          </li>
          <li>
            <button onClick={() => setActivePage("editorial")} className="hover:text-brand-gold transition-colors text-left uppercase text-xs tracking-wider">
              Góc tư vấn
            </button>
          </li>
          <li>
            <a href="#" className="hover:text-brand-gold transition-colors uppercase text-xs tracking-wider">
              Điều khoản và giao hàng
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-brand-gold transition-colors uppercase text-xs tracking-wider">
              Chính sách chất lượng
            </a>
          </li>
          <li className="pt-2 border-t border-[#c4c7c7]/30">
            <button 
              onClick={() => setActivePage("admin")} 
              className="text-[#775a19] hover:text-[#1b1c1c] transition-colors font-sans font-bold text-[10px] tracking-widest uppercase text-left block"
              id="footer-admin-portal-trigger"
            >
              Trang quản trị
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h6 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-brand-gold mb-6">NHẬN TƯ VẤN</h6>
        <p className="font-sans text-sm text-[#444748] mb-6 leading-relaxed">
          Nhập email để nhận tư vấn mẫu biển số, ưu đãi và gợi ý chất liệu phù hợp.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <div className="flex border-b border-[#1b1c1c] pb-2">
            <input 
              type="email" 
              placeholder="Địa chỉ email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-sans w-full placeholder-[#444748]/50"
              required
            />
            <button type="submit" className="text-brand-gold font-sans text-xs font-bold tracking-widest hover:opacity-75">
              GỬI
            </button>
          </div>
          {subscribed && (
            <p className="text-xs text-brand-gold animate-pulse font-sans">
              Cảm ơn bạn. SignHub sẽ liên hệ trong thời gian sớm nhất.
            </p>
          )}
        </form>
      </div>

      <div className="md:hidden border-t border-[#c4c7c7]/30 mt-12 pt-8 flex flex-col gap-4 text-center">
        <p className="font-sans text-[10px] tracking-widest text-[#444748]/60">
          © 2026 SIGNHUB. THIẾT KẾ VÀ GIA CÔNG BIỂN SỐ.
        </p>
      </div>
    </footer>
  );
}

// Mobile persistent bottom menu mimicking custom screenshots for mobile viewports
interface MobileMenuProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function MobileBottomNavigation({ activePage, setActivePage }: MobileMenuProps) {
  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full px-6 py-3 w-max z-50 bg-[#fbf9f9]/90 backdrop-blur-xl border border-white/20 shadow-[0px_20px_40px_rgba(0,0,0,0.08)] flex gap-8 items-center justify-center">
      <button 
        onClick={() => setActivePage("home")}
        className={`hover:scale-110 active:scale-95 transition-all p-1 ${activePage === "home" ? "text-brand-gold" : "text-[#444748]"}`}
        aria-label="Trang chủ"
      >
        <Home size={20} />
      </button>
      <button 
        onClick={() => setActivePage("collections")}
        className={`hover:scale-110 active:scale-95 transition-all p-1 ${activePage === "collections" || activePage === "product-detail" ? "text-brand-gold" : "text-[#444748]"}`}
        aria-label="Sản phẩm"
      >
        <Search size={20} />
      </button>
      <button 
        onClick={() => setActivePage("editorial")}
        className={`hover:scale-110 active:scale-95 transition-all p-1 ${activePage === "editorial" ? "text-brand-gold" : "text-[#444748]"}`}
        aria-label="Tư vấn"
      >
        <BookOpen size={20} />
      </button>
      <button 
        onClick={() => setActivePage("story")}
        className={`hover:scale-110 active:scale-95 transition-all p-1 ${activePage === "story" ? "text-brand-gold" : "text-[#444748]"}`}
        aria-label="Câu chuyện"
      >
        <User size={20} />
      </button>
    </nav>
  );
}

// Styled Float Contact Trigger Stack (FAB Group)
export function FloatingContact() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-3 scale-100 transition-all duration-300 origin-bottom animate-in slide-in-from-bottom-5">
          <a 
            href="https://m.me/signhub" 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#1b1c1c] shadow-lg hover:bg-white hover:text-brand-gold transition-all duration-300 border border-white/50"
            title="Messenger"
          >
            <MessageSquare size={18} />
          </a>
          <a 
            href="tel:+84901234567" 
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#1b1c1c] shadow-lg hover:bg-white hover:text-brand-gold transition-all duration-300 border border-white/50"
            title="Gọi điện"
          >
            <Phone size={18} />
          </a>
          <a 
            href="mailto:contact@signhub.vn" 
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#1b1c1c] shadow-lg hover:bg-white hover:text-brand-gold transition-all duration-300 border border-white/50"
            title="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-[0px_20px_40px_rgba(119,90,25,0.3)] hover:scale-110 transition-transform duration-300 border border-white/20 relative"
        aria-label="Liên hệ"
      >
        <span className={`text-2xl transition-transform duration-500 font-sans font-light ${isOpen ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
    </div>
  );
}
