/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Navbar, Footer, MobileBottomNavigation, FloatingContact } from "./components/NavFooter";
import { HomeView } from "./components/HomeView";
import { CollectionsView } from "./components/CollectionsView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CheckoutView, CartItem } from "./components/CheckoutView";
import { EditorialView } from "./components/EditorialView";
import { OurStoryView } from "./components/OurStoryView";
import { CartSidebar } from "./components/CartSidebar";
import { PRODUCTS, Product } from "./data";
import { api, ApiCart } from "./api";
import { CheckCircle, Sparkles } from "lucide-react";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export default function App() {
  const [activePage, setActivePage] = React.useState<string>("home");
  const [selectedProductId, setSelectedProductId] = React.useState<string>("bien-so-nha-mica-den-vien-vang");
  const [selectedJournalId, setSelectedJournalId] = React.useState<string | null>(null);
  const [sessionId] = React.useState(() => {
    const saved = localStorage.getItem("signhub_session_id");
    if (saved) return saved;
    const next = crypto.randomUUID();
    localStorage.setItem("signhub_session_id", next);
    return next;
  });

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Elegant minimalist customized Toast Notify banner
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [toastType, setToastType] = React.useState<"success" | "neutral">("success");

  const showToast = (message: string, type: "success" | "neutral" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const apiImage = (url?: string) => {
    if (!url) return PRODUCTS[0].image;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${url}`;
  };

  const mapCart = (apiCart: ApiCart): CartItem[] => apiCart.items.map((item) => ({
    cartItemId: item.id,
    product: {
      id: item.productSlug,
      backendId: item.productId,
      name: item.productName,
      subName: item.productCode,
      category: "bien-so",
      categoryName: "Biển số",
      price: Number(item.unitPrice || 0),
      image: apiImage(item.thumbnailUrl),
      desc: "",
    },
    quantity: item.quantity,
    selectedFinish: "Theo mẫu",
    selectedSize: item.variantSize || "Theo yêu cầu",
    variantId: item.variantId,
    unitPrice: Number(item.unitPrice || 0),
  }));

  React.useEffect(() => {
    api.getCart(sessionId)
      .then((apiCart) => setCart(mapCart(apiCart)))
      .catch(() => {});
  }, [sessionId]);

  const handleAddToCart = async (product: Product, quantity: number, finish: string, size: string) => {
    const variant = product.variants?.find((item) => item.size === size);
    if (product.backendId) {
      try {
        const apiCart = await api.addCartItem({
          productId: product.backendId,
          variantId: variant?.id,
          quantity,
          sessionId,
        });
        setCart(mapCart(apiCart));
        showToast(`Đã thêm ${quantity} ${product.name} vào giỏ hàng.`, "success");
        setIsCartOpen(true);
        return;
      } catch {
        showToast("Chưa kết nối được backend, tạm lưu giỏ hàng trên trình duyệt.", "neutral");
      }
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.selectedFinish === finish && 
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      } else {
        return [...prevCart, { product, quantity, selectedFinish: finish, selectedSize: size, variantId: variant?.id, unitPrice: product.price + (variant?.extraPrice || 0) }];
      }
    });

    showToast(`Đã thêm ${quantity} ${product.name} vào giỏ hàng.`, "success");
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = async (index: number, nextQuantity: number) => {
    const item = cart[index];
    if (item?.cartItemId) {
      try {
        const apiCart = await api.updateCartItem(item.cartItemId, nextQuantity, sessionId);
        setCart(mapCart(apiCart));
        return;
      } catch {
        showToast("Không thể cập nhật backend, đã cập nhật tạm trên giao diện.", "neutral");
      }
    }
    setCart((prevCart) => {
      const nextCart = [...prevCart];
      if (nextQuantity > 0) {
        nextCart[index].quantity = nextQuantity;
      }
      return nextCart;
    });
  };

  const handleRemoveItem = async (index: number) => {
    const item = cart[index];
    if (item?.cartItemId) {
      try {
        await api.removeCartItem(item.cartItemId, sessionId);
      } catch {
        showToast("Không thể xóa trên backend, đã xóa tạm trên giao diện.", "neutral");
      }
    }
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    showToast(`Đã xóa ${item.product.name} khỏi giỏ hàng.`, "neutral");
  };

  const handleClearCart = async () => {
    try {
      await api.clearCart(sessionId);
    } catch {}
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Render correct active page container view
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <HomeView
            onExplore={() => setActivePage("collections")}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActivePage("product-detail");
            }}
            onSelectJournal={(id) => {
              setSelectedJournalId(id);
              setActivePage("editorial");
            }}
          />
        );
      case "collections":
        return (
          <CollectionsView
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActivePage("product-detail");
            }}
          />
        );
      case "product-detail":
        return (
          <ProductDetailView
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
            }}
          />
        );
      case "checkout":
        return (
          <CheckoutView
            cart={cart}
            sessionId={sessionId}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        );
      case "editorial":
        return (
          <EditorialView
            selectedPostId={selectedJournalId}
            onSelectPost={(id) => {
              setSelectedJournalId(id);
            }}
          />
        );
      case "story":
        return <OurStoryView />;
      default:
        return (
          <HomeView
            onExplore={() => setActivePage("collections")}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setActivePage("product-detail");
            }}
            onSelectJournal={(id) => {
              setSelectedJournalId(id);
              setActivePage("editorial");
            }}
          />
        );
    }
  };

  if (activePage === "admin") {
    return <AdminDashboard onExitPortal={() => setActivePage("home")} />;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col justify-between overflow-x-hidden pt-20 pb-20 md:pb-0 font-sans selection:bg-[#775a19]/25 selection:text-[#1b1c1c]">
      
      {/* 1. Glassmorphic Navigation Menu */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={totalCartCount} 
        openCart={() => setIsCartOpen(true)}
      />

      {/* 2. Primary Page view container wrapper */}
      <div className="flex-grow transition-opacity duration-300">
        {renderPage()}
      </div>

      {/* 3. Global footer */}
      <Footer setActivePage={setActivePage} />

      {/* 4. Sliding Cart panel */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onGoToCheckout={() => {
          setIsCartOpen(false);
          setActivePage("checkout");
        }}
      />

      {/* 5. Custom persistent floating speed dial FAB triggers */}
      <FloatingContact />

      {/* 6. Mobile specific bottom overlay bar navigation */}
      <MobileBottomNavigation activePage={activePage} setActivePage={setActivePage} />

      {/* 7. Minimalist floating custom styled high-contrast Toast alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-[99] max-w-sm w-max glass border border-[#775a19]/40 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          {toastType === "success" ? (
            <CheckCircle className="text-[#775a19] flex-shrink-0" size={18} />
          ) : (
            <Sparkles className="text-brand-gray flex-shrink-0" size={18} />
          )}
          <span className="font-sans text-xs font-semibold text-[#1b1c1c] tracking-wide">
            {toastMessage}
          </span>
        </div>
      )}

    </div>
  );
}
