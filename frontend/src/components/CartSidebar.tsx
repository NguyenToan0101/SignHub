/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Trash, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { CartItem } from "./CheckoutView";
import { formatVnd } from "../format";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onGoToCheckout: () => void;
}

export function CartSidebar({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onGoToCheckout }: CartSidebarProps) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => {
    const price = item.unitPrice ?? item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-[#fbf9f9] shadow-2xl flex flex-col justify-between border-l border-[#c4c7c7]/30 h-full animate-in slide-in-from-right duration-300">
          
          {/* Sidebar Header */}
          <header className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} className="text-[#1b1c1c]" />
              <h2 className="font-sans text-xs tracking-[0.25em] font-bold text-[#1b1c1c] uppercase">
                GIỎ HÀNG ({cart.length})
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#444748] hover:text-[#1b1c1c] p-2 transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X size={20} />
            </button>
          </header>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const itemPrice = item.unitPrice ?? item.product.price;
                return (
                  <div 
                    key={`${item.product.id}-${index}`}
                    className="flex gap-4 border-b border-[#c4c7c7]/10 pb-5 items-start justify-between"
                  >
                    <div className="w-16 h-20 bg-[#efeded] rounded-xl overflow-hidden flex-shrink-0 border border-[#c4c7c7]/20">
                      <img className="w-full h-full object-cover" src={item.product.image} alt={item.product.name} />
                    </div>

                    <div className="flex-grow flex flex-col gap-1.5">
                      <h3 className="font-display text-base text-[#1b1c1c] leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-[9px] tracking-widest uppercase font-bold text-[#775a19] font-sans">
                        {item.selectedFinish} | {item.selectedSize}
                      </p>

                      <div className="flex items-center gap-4 mt-1.5">
                        <div className="flex items-center border border-[#c4c7c7]/30 rounded-full px-2 py-0.5 bg-white">
                          <button 
                            onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="text-[#444748] hover:text-[#1b1c1c] p-1"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="mx-2 text-xs font-semibold font-sans w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="text-[#444748] hover:text-[#1b1c1c] p-1"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(index)}
                          className="text-[#444748] hover:text-red-600 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-sm font-semibold text-[#1b1c1c]">
                        {formatVnd(itemPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-4">
                <ShoppingBag className="text-[#c4c7c7] opacity-60" size={64} strokeWidth={1} />
                <p className="font-display text-lg text-[#444748] italic">
                  Giỏ hàng của bạn đang trống.
                </p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 border border-[#775a19] text-[#775a19] font-sans text-[10px] tracking-wider uppercase font-semibold rounded-full hover:bg-[#775a19] hover:text-white transition-all"
                >
                  XEM SẢN PHẨM
                </button>
              </div>
            )}
          </div>

          {/* Cart Sidebar footer summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex flex-col gap-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-sans text-[10px] tracking-widest text-[#444748] font-bold uppercase">TẠM TÍNH</span>
                <span className="font-display text-2xl font-bold text-[#775a19]">
                  {formatVnd(total)}
                </span>
              </div>
              
              <p className="font-sans text-[11px] text-[#444748] text-center leading-relaxed">
                Phí giao hàng và ưu đãi sẽ được tính ở bước thanh toán.
              </p>

              <button 
                onClick={onGoToCheckout}
                className="w-full bg-[#1b1c1c] text-white py-4 rounded-full font-sans text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#775a19] hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
              >
                THANH TOÁN
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
