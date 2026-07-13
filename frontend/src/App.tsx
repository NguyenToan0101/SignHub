/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Navbar, Footer, MobileBottomNavigation, FloatingContact } from "./components/NavFooter";
import { HomeView } from "./components/HomeView";
import { CollectionsView } from "./components/CollectionsView";
import { ProductDetailView } from "./components/ProductDetailView";
import { CheckoutView, CartItem } from "./components/CheckoutView";
import { EditorialView } from "./components/EditorialView";
import { OurStoryView } from "./components/OurStoryView";
import { CartSidebar } from "./components/CartSidebar";
import { PRODUCTS, Product } from "./data";
import { API_BASE_URL, api, ApiAuthResponse, ApiCart } from "./api";
import { CheckCircle, Sparkles, X } from "lucide-react";
import { AdminDashboard } from "./components/admin/AdminDashboard";

type CustomerProfile = { name: string; email: string };

const createSessionId = () => {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }

  if (cryptoApi?.getRandomValues) {
    const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
  }

  return `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionId] = React.useState(() => {
    const saved = localStorage.getItem("signhub_session_id");
    if (saved) return saved;
    const next = createSessionId();
    localStorage.setItem("signhub_session_id", next);
    return next;
  });

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<CustomerProfile | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("signhub_customer") || "null");
    } catch {
      return null;
    }
  });
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = React.useState(false);
  const [pendingCartAction, setPendingCartAction] = React.useState<{
    product: Product;
    quantity: number;
    finish: string;
    size: string;
  } | null>(null);

  // Elegant minimalist customized Toast Notify banner
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [toastType, setToastType] = React.useState<"success" | "neutral">("success");

  const activePage = React.useMemo(() => getActivePage(location.pathname), [location.pathname]);

  const navigateToPage = React.useCallback((page: string) => {
    navigate(pageToPath(page));
  }, [navigate]);

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
    const signedInCustomer = customer || (() => {
      try {
        return JSON.parse(localStorage.getItem("signhub_customer") || "null");
      } catch {
        return null;
      }
    })();
    if (!signedInCustomer) {
      setPendingCartAction({ product, quantity, finish, size });
      setIsCustomerAuthOpen(true);
      return;
    }
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
        return [...prevCart, { product, quantity, selectedFinish: finish, selectedSize: size, variantId: variant?.id, unitPrice: variant ? variant.extraPrice : product.price }];
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

  const handleCustomerAuth = (auth: ApiAuthResponse) => {
    const nextCustomer: CustomerProfile = {
      name: auth.fullName || auth.email.split("@")[0],
      email: auth.email,
    };
    sessionStorage.setItem("signhub_customer_token", auth.token);
    localStorage.setItem("signhub_customer", JSON.stringify(nextCustomer));
    setCustomer(nextCustomer);
    setIsCustomerAuthOpen(false);
    navigateToPage("home");
    showToast(`Xin chào ${nextCustomer.name}. Bạn có thể thêm sản phẩm vào giỏ.`, "success");
    if (pendingCartAction) {
      const action = pendingCartAction;
      setPendingCartAction(null);
      setTimeout(() => handleAddToCart(action.product, action.quantity, action.finish, action.size), 0);
    }
  };

  const handleCustomerLogout = () => {
    sessionStorage.removeItem("signhub_customer_token");
    localStorage.removeItem("signhub_customer");
    setCustomer(null);
    showToast("Bạn đã đăng xuất.", "neutral");
    navigateToPage("home");
  };

  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.pathname !== "/oauth2/success") return;

    const oauthError = url.searchParams.get("error");
    if (oauthError) {
      showToast(oauthError, "neutral");
      navigate("/", { replace: true });
      return;
    }

    const token = url.searchParams.get("token");
    const userId = url.searchParams.get("userId");
    const fullName = url.searchParams.get("fullName");
    const email = url.searchParams.get("email");
    const role = url.searchParams.get("role");

    if (!token || !userId || !email || role !== "CUSTOMER") {
      showToast("Google login response was invalid. Please try again.", "neutral");
      navigate("/", { replace: true });
      return;
    }

    handleCustomerAuth({
      token,
      tokenType: url.searchParams.get("tokenType") || "Bearer",
      userId,
      fullName: fullName || email.split("@")[0],
      email,
      role,
    });
    showToast("Đăng nhập google thành công.", "success");
    navigate("/", { replace: true });
  }, [navigate]);

  const handleAdminAuth = (auth: ApiAuthResponse) => {
    localStorage.setItem("signhub_admin_token", auth.token);
    localStorage.setItem("signhub_admin_profile", JSON.stringify(auth));
    setIsCustomerAuthOpen(false);
    setPendingCartAction(null);
    showToast("Đăng nhập quản trị thành công.", "success");
    navigateToPage("admin");
  };

  if (activePage === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard onExitPortal={() => navigateToPage("home")} />} />
        <Route path="/admin/:tab" element={<AdminDashboard onExitPortal={() => navigateToPage("home")} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col justify-between overflow-x-hidden pt-20 pb-20 md:pb-0 font-sans selection:bg-[#775a19]/25 selection:text-[#1b1c1c]">
      
      {/* 1. Glassmorphic Navigation Menu */}
      <Navbar 
        activePage={activePage} 
        setActivePage={navigateToPage} 
        cartCount={totalCartCount} 
        openCart={() => setIsCartOpen(true)}
        openLogin={() => setIsCustomerAuthOpen(true)}
        customer={customer}
        onLogout={handleCustomerLogout}
      />

      {/* 2. Primary Page view container wrapper */}
      <div className="flex-grow transition-opacity duration-300">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                onExplore={() => navigateToPage("collections")}
                onSelectProduct={(id) => navigate(`/products/${id}`)}
                onSelectJournal={(id) => navigate(`/editorial/${id}`)}
              />
            }
          />
          <Route path="/collections" element={<CollectionsView onSelectProduct={(id) => navigate(`/products/${id}`)} />} />
          <Route path="/products/:productId" element={<ProductRoute onAddToCart={handleAddToCart} />} />
          <Route
            path="/checkout"
            element={
              <CheckoutView
                cart={cart}
                sessionId={sessionId}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />
            }
          />
          <Route path="/editorial" element={<EditorialRoute />} />
          <Route path="/editorial/:postId" element={<EditorialRoute />} />
          <Route path="/story" element={<OurStoryView />} />
          <Route
            path="/oauth2/success"
            element={
              <HomeView
                onExplore={() => navigateToPage("collections")}
                onSelectProduct={(id) => navigate(`/products/${id}`)}
                onSelectJournal={(id) => navigate(`/editorial/${id}`)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* 3. Global footer */}
      <Footer setActivePage={navigateToPage} />

      {/* 4. Sliding Cart panel */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onGoToCheckout={() => {
          setIsCartOpen(false);
          navigateToPage("checkout");
        }}
      />

      {/* 5. Custom persistent floating speed dial FAB triggers */}
      <FloatingContact />

      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => {
          setIsCustomerAuthOpen(false);
          setPendingCartAction(null);
        }}
        onAuthenticated={handleCustomerAuth}
        onAdminAuthenticated={handleAdminAuth}
      />

      {/* 6. Mobile specific bottom overlay bar navigation */}
      <MobileBottomNavigation activePage={activePage} setActivePage={navigateToPage} />

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

function ProductRoute({
  onAddToCart,
}: {
  onAddToCart: (product: Product, quantity: number, finish: string, size: string) => void;
}) {
  const navigate = useNavigate();
  const { productId } = useParams();

  return (
    <ProductDetailView
      productId={productId || PRODUCTS[0].id}
      onAddToCart={onAddToCart}
      onSelectProduct={(id) => navigate(`/products/${id}`)}
    />
  );
}

function EditorialRoute() {
  const navigate = useNavigate();
  const { postId } = useParams();

  return (
    <EditorialView
      selectedPostId={postId || null}
      onSelectPost={(id) => navigate(id ? `/editorial/${id}` : "/editorial")}
    />
  );
}

function getActivePage(pathname: string) {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/collections")) return "collections";
  if (pathname.startsWith("/products")) return "product-detail";
  if (pathname.startsWith("/checkout")) return "checkout";
  if (pathname.startsWith("/editorial")) return "editorial";
  if (pathname.startsWith("/story")) return "story";
  return "home";
}

function pageToPath(page: string) {
  switch (page) {
    case "collections":
      return "/collections";
    case "product-detail":
      return `/products/${PRODUCTS[0].id}`;
    case "checkout":
      return "/checkout";
    case "editorial":
      return "/editorial";
    case "story":
      return "/story";
    case "admin":
      return "/admin";
    case "home":
    default:
      return "/";
  }
}

function CustomerAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  onAdminAuthenticated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (auth: ApiAuthResponse) => void;
  onAdminAuthenticated: (auth: ApiAuthResponse) => void;
}) {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [form, setForm] = React.useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = React.useState("");
  const googleButtonRef = React.useRef<HTMLDivElement | null>(null);
  const googleClientId: string = "spring-security-oauth2";
  const googleRedirectUri = "";

  React.useEffect(() => {
    if (!isOpen || googleClientId !== "__legacy_google_identity_services__") return;
    if (!googleClientId) {
      if (googleButtonRef.current) googleButtonRef.current.innerHTML = "";
      return;
    }
    const initializeGoogle = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = "";
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) {
            setError("Không nhận được thông tin đăng nhập Google.");
            return;
          }
          try {
            const auth = await api.customerGoogleLogin({ credential: response.credential });
            onAuthenticated(auth);
          } catch (error) {
            setError(error instanceof Error ? error.message : "Không đăng nhập được bằng Google.");
          }
        },
      });
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: Math.min(360, window.innerWidth - 80),
        text: "signin_with",
      });
    };

    if ((window as any).google?.accounts?.id) {
      initializeGoogle();
      return;
    }
    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => setError("Không tải được Google Login. Kiểm tra cấu hình domain OAuth trong Google Cloud.");
    document.head.appendChild(script);
  }, [googleClientId, isOpen, onAuthenticated]);

  if (!isOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const email = form.email.trim();
    const fullName = form.name.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    if (!email || !password.trim() || (mode === "register" && !fullName)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      if (mode === "register") {
        if (!confirmPassword.trim()) {
          setError("Vui long nhap lai mat khau.");
          return;
        }
        if (password.length < 3) {
          setError("Mat khau can toi thieu 3 ky tu.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Mat khau xac nhan khong trung khop.");
          return;
        }
      }
      const payload = { email, password };
      const auth: ApiAuthResponse = mode === "register"
        ? await api.customerRegister({
            fullName,
            email: payload.email,
            password: payload.password,
            confirmPassword,
          })
        : await api.customerLogin(payload).catch(async (customerError) => {
            const adminAuth = await api.adminLogin(payload);
            if (adminAuth.role !== "ADMIN") throw customerError;
            return adminAuth;
          });
      if (auth.role === "ADMIN") {
        onAdminAuthenticated(auth);
        return;
      }
      onAuthenticated(auth);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đăng nhập thất bại.");
    }
  };

  const startGoogleLogin = () => {
    setError("");
    window.location.assign(`${API_BASE_URL}/oauth2/authorization/google`);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6 font-sans">
      <div className="absolute inset-0 bg-[#1b1c1c]/45 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-md bg-white border border-[#c4c7c7]/30 rounded-2xl p-7 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-[#efeded]" aria-label="Đóng">
          <X size={16} />
        </button>
        <div>
          <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase">SignHub Account</span>
          <h2 className="font-display text-3xl text-[#1b1c1c] mt-2">
            {mode === "login" ? "Đăng nhập để thêm giỏ hàng" : "Tạo tài khoản SignHub"}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-[#fbf9f9] border border-[#c4c7c7]/30 rounded-full p-1">
          <button type="button" onClick={() => setMode("login")} className={`py-2 rounded-full text-xs font-bold ${mode === "login" ? "bg-white text-[#775a19] shadow-sm" : "text-[#444748]"}`}>Đăng nhập</button>
          <button type="button" onClick={() => setMode("register")} className={`py-2 rounded-full text-xs font-bold ${mode === "register" ? "bg-white text-[#775a19] shadow-sm" : "text-[#444748]"}`}>Đăng ký</button>
        </div>
        {mode === "register" && (
          <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="admin-input text-sm" placeholder="Họ tên" />
        )}
        <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="admin-input text-sm" placeholder="Email" />
        <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="admin-input text-sm" placeholder="Mật khẩu" />
        {mode === "register" && (
          <input type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} className="admin-input text-sm" placeholder="Nhap lai mat khau" />
        )}
        {error && <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>}
        <button type="submit" className="w-full py-3.5 bg-[#1b1c1c] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#775a19]">
          Tiếp tục
        </button>
        <div className="space-y-2">
          {googleClientId ? (
            <button
  type="button"
  onClick={startGoogleLogin}
  className="w-full flex items-center justify-center gap-3 py-3 border border-[#c4c7c7] rounded-full text-xs font-bold tracking-widest uppercase text-[#1b1c1c] bg-white hover:border-[#775a19] hover:text-[#775a19]"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.28 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.318 4.337-17.694 10.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.169 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.163 35.091 26.715 36 24 36c-5.259 0-9.617-3.326-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.002-3.173 5.411-6.084 6.57l.003-.002 6.19 5.238C35.003 40.091 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>

  <span>Đăng nhập với Google</span>
</button>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="w-full py-3 border border-[#c4c7c7] rounded-full text-xs font-bold tracking-widest uppercase text-[#444748] bg-[#fbf9f9]"
              >
                Đăng nhập với Google
              </button>
              <p className="text-[11px] leading-relaxed text-[#444748]">
                Them VITE_GOOGLE_CLIENT_ID vao frontend/.env de bat Google Login.
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
