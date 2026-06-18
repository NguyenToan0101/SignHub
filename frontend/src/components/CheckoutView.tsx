/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Product } from "../data";
import { api } from "../api";
import { formatVnd } from "../format";
import { Plus, Minus, Trash, CreditCard, Lock, CheckCircle, Percent } from "lucide-react";

export interface CartItem {
  cartItemId?: string;
  product: Product;
  quantity: number;
  selectedFinish: string;
  selectedSize: string;
  variantId?: string;
  unitPrice?: number;
}

interface CheckoutViewProps {
  cart: CartItem[];
  sessionId: string;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export function CheckoutView({ cart, sessionId, onUpdateQuantity, onRemoveItem, onClearCart }: CheckoutViewProps) {
  const [firstName, setFirstName] = React.useState("Lê");
  const [lastName, setLastName] = React.useState("Nguyễn");
  const [address, setAddress] = React.useState("123 Nguyễn Huệ");
  const [city, setCity] = React.useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = React.useState("Quận 1");
  const [ward, setWard] = React.useState("Phường Bến Nghé");
  const [postalCode, setPostalCode] = React.useState("700000");
  const [email, setEmail] = React.useState("khachhang@signhub.vn");
  const [phone, setPhone] = React.useState("0900000000");

  // Discount code mechanics
  const [discountCode, setDiscountCode] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState(0);
  const [discountApplied, setDiscountApplied] = React.useState(false);
  const [discountMessage, setDiscountMessage] = React.useState("");

  // Order submission modal
  const [isOrdering, setIsOrdering] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [orderRef, setOrderRef] = React.useState("");

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.unitPrice ?? item.product.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountPercent;
  const taxableAmount = subtotal - discountAmount;
  const taxEstimate = 0;
  const shippingCost = subtotal > 0 ? 30000 : 0;
  const absoluteTotal = taxableAmount + taxEstimate + shippingCost;

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = discountCode.trim().toUpperCase();
    api.applyCoupon({ code: normalized, subtotal, shippingFee: shippingCost })
      .then((result) => {
        setDiscountPercent(subtotal > 0 ? Number(result.discountAmount) / subtotal : 0);
        setDiscountApplied(true);
        setDiscountMessage(`Đã áp dụng mã ${result.code}.`);
      })
      .catch(() => {
        setDiscountPercent(0);
        setDiscountApplied(false);
        setDiscountMessage("Mã giảm giá không hợp lệ.");
      });
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const order = await api.createOrder({
        sessionId,
        billingAddress: {
          fullName: `${firstName} ${lastName}`.trim(),
          phone,
          email,
          province: city,
          district,
          ward,
          detailAddress: address,
        },
        shipToDifferentAddress: false,
        note: "",
        couponCode: discountApplied ? discountCode.trim().toUpperCase() : undefined,
        paymentMethod: "COD",
      });
      setOrderRef(order.orderCode);
      setIsOrdering(false);
      setOrderComplete(true);
      onClearCart();
    } catch {
      setIsOrdering(false);
      setDiscountMessage("Không thể tạo đơn hàng. Vui lòng kiểm tra backend và thử lại.");
    }
  };

  return (
    <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
      <main className="max-w-[1440px] mx-auto px-6 md:px-20 animate-fade-in">
        
        <h1 className="font-display text-4xl lg:text-6xl mb-12 text-center text-[#1b1c1c]">
          Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Large Column: Cart items & Logistics Form */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Step 01: Cart Items */}
            <section>
              <h2 className="font-sans text-xs tracking-[0.2em] font-bold text-[#444748] mb-6 uppercase">
                01. Sản phẩm trong giỏ
              </h2>

              {cart.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {cart.map((item, index) => {
                    const price = item.unitPrice ?? item.product.price;
                    return (
                      <div 
                        key={`${item.product.id}-${index}`}
                        className="glass p-6 gap-6 rounded-[24px] flex flex-col md:flex-row items-center justify-between"
                      >
                        <div className="w-24 h-32 overflow-hidden rounded-xl bg-[#efeded] flex-shrink-0 border border-[#c4c7c7]/25">
                          <img 
                            className="w-full h-full object-cover" 
                            src={item.product.image} 
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        
                        <div className="flex-grow text-center md:text-left md:pl-2">
                          <h3 className="font-display text-xl text-[#1b1c1c] font-medium">
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] tracking-widest font-sans font-bold text-[#775a19] uppercase mt-1">
                            Hoàn thiện: {item.selectedFinish} | Kích thước: {item.selectedSize}
                          </p>

                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
                            <div className="flex items-center border border-[#c4c7c7]/30 rounded-full px-3 py-1 bg-white">
                              <button 
                                onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                                className="text-[#444748] hover:text-[#1b1c1c] p-1"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="mx-4 font-sans text-xs font-semibold text-[#1b1c1c] w-6 text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="text-[#444748] hover:text-[#1b1c1c] p-1"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button 
                              onClick={() => onRemoveItem(index)}
                              className="font-sans text-[10px] tracking-widest uppercase font-bold text-[#444748] hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash size={12} />
                              XÓA
                            </button>
                          </div>
                        </div>

                        <div className="text-right md:pr-4">
                          <span className="font-display text-xl text-[#1b1c1c] font-semibold">
                            {formatVnd(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12 bg-white rounded-[24px] border border-[#c4c7c7]/30">
                  <p className="font-display text-lg text-[#444748] italic">
                    Giỏ hàng của bạn đang trống.
                  </p>
                </div>
              )}
            </section>

            {/* Step 02: Shipping Form */}
            <section>
              <h2 className="font-sans text-xs tracking-[0.2em] font-bold text-[#444748] mb-6 uppercase">
                02. Thông tin nhận hàng
              </h2>

              <div className="glass p-8 rounded-[24px] flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                      TÊN
                    </label>
                    <input 
                      className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane" 
                      type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                      HỌ
                    </label>
                    <input 
                      className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe" 
                      type="text" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                    ĐỊA CHỈ
                  </label>
                  <input 
                    className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Serenity Way, Dist. 1" 
                    type="text" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                      TỈNH/THÀNH
                    </label>
                    <input 
                      className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="TP. Hồ Chí Minh" 
                      type="text" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                      QUẬN/HUYỆN
                    </label>
                    <input
                      className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Quận 1"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                      PHƯỜNG/XÃ
                    </label>
                    <input 
                      className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="Phường Bến Nghé" 
                      type="text" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                    EMAIL
                  </label>
                  <input 
                    className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@lartdecor.vn" 
                    type="email" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                    SỐ ĐIỆN THOẠI
                  </label>
                  <input
                    className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0900000000"
                    type="tel"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Calculations & Summary */}
          <div className="lg:col-span-4 sticky top-32">
            <h2 className="font-sans text-xs tracking-[0.2em] font-bold text-[#444748] mb-6 uppercase">
              03. Tóm tắt đơn hàng
            </h2>

            <div className="glass p-8 rounded-[24px] flex flex-col gap-6">
              
              <div className="flex flex-col gap-4 border-b border-[#c4c7c7]/30 pb-6">
                
                <div className="flex justify-between text-sm">
                  <span className="font-sans text-[10px] tracking-wider text-[#444748] font-bold uppercase">TẠM TÍNH</span>
                  <span className="font-sans font-semibold">{formatVnd(subtotal)}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-700 font-medium">
                    <span className="font-sans text-[10px] tracking-wider uppercase font-bold">GIẢM GIÁ</span>
                    <span>-{formatVnd(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="font-sans text-[10px] tracking-wider text-[#444748] font-bold uppercase">PHÍ GIAO HÀNG</span>
                  <span className="font-sans font-semibold">
                    {formatVnd(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-sans text-[10px] tracking-wider text-[#444748] font-bold uppercase">THUẾ</span>
                  <span className="font-sans font-semibold">{formatVnd(taxEstimate)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-[#c4c7c7]/20">
                  <span className="font-sans text-xs tracking-widest font-bold uppercase">TỔNG CỘNG</span>
                  <span className="font-display text-3xl font-bold text-[#775a19]">
                    {formatVnd(absoluteTotal)}
                  </span>
                </div>
              </div>

              {/* Discount Code Input Box */}
              <form onSubmit={handleApplyDiscount} className="flex flex-col gap-2 border-b border-[#c4c7c7]/30 pb-6">
                <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">
                  MÃ GIẢM GIÁ
                </label>
                <div className="flex gap-2">
                  <input 
                    className="border border-[#c4c7c7] bg-white rounded-l-full px-4 py-2 text-xs flex-1 outline-none font-sans tracking-widest uppercase font-semibold"
                    placeholder="Ví dụ: PMV10"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    type="text" 
                  />
                  <button 
                    type="submit" 
                    className="bg-[#1b1c1c] text-white px-5 rounded-r-full font-sans text-[10px] tracking-widest uppercase font-bold hover:bg-[#775a19] transition-all flex items-center gap-1.5"
                  >
                    <Percent size={10} />
                    ÁP DỤNG
                  </button>
                </div>
                {discountMessage && (
                  <p className={`text-[11px] font-sans ${discountApplied ? "text-green-700 font-medium" : "text-red-600"}`}>
                    {discountMessage}
                  </p>
                )}
              </form>

              {/* Place Order CTA */}
              <button 
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || isOrdering}
                className={`w-full py-5 text-white font-sans text-xs tracking-[0.25em] font-bold rounded-full transition-all duration-300 shadow-xl ${
                  cart.length === 0 
                    ? "bg-[#c4c7c7] cursor-not-allowed opacity-50" 
                    : isOrdering 
                      ? "bg-[#775a19]/80 cursor-wait animate-pulse" 
                      : "bg-[#775a19] hover:bg-[#775a19]/90 hover:scale-[1.01] active:scale-95"
                }`}
              >
                {isOrdering ? "ĐANG TẠO ĐƠN..." : "ĐẶT HÀNG"}
              </button>

              <div className="flex flex-col items-center gap-3 pt-4 text-center">
                <span className="font-sans text-[9px] tracking-widest text-[#444748] uppercase font-bold flex items-center gap-1">
                  <Lock size={10} />
                  THANH TOÁN AN TOÀN
                </span>
                <div className="flex gap-4 opacity-40 text-gray-500 scale-90">
                  <CreditCard size={18} />
                  <Lock size={18} />
                  <CheckCircle size={18} />
                </div>
              </div>

              <p className="font-sans text-[11px] text-center text-[#444748] leading-relaxed pt-2">
                Sau khi đặt hàng, SignHub sẽ liên hệ xác nhận nội dung, mockup và thời gian giao hàng.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Complete Success Overlay Dialog */}
      {orderComplete && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#fbf9f9] rounded-[32px] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500 relative border border-white/40">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-200 shadow-sm text-[#775a19]">
              <CheckCircle size={40} className="stroke-[#775a19]" />
            </div>
            
            <div>
              <span className="font-sans text-[10px] tracking-[0.2em] font-bold text-[#775a19] block mb-2 uppercase">
                ĐẶT HÀNG THÀNH CÔNG
              </span>
              <h3 className="font-display text-3xl text-[#1b1c1c] mb-4">
                Đơn hàng đã được ghi nhận
              </h3>
              <p className="font-sans text-xs text-[#444748] leading-relaxed max-w-sm mx-auto">
                SignHub đã lưu đơn hàng với mã: <strong className="text-[#1b1c1c] tracking-wider">{orderRef}</strong>. Nhân viên tư vấn sẽ liên hệ qua email <span className="text-[#775a19] hover:underline font-semibold">{email}</span> để xác nhận chi tiết.
              </p>
            </div>

            <button 
              onClick={() => setOrderComplete(false)}
              className="px-8 py-3.5 bg-[#1b1c1c] text-white font-sans text-xs tracking-wider uppercase font-bold rounded-full hover:bg-[#775a19] transition-all hover:scale-105 active:scale-95"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
