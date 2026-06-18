/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { api, ApiOrder, ApiProduct, mapApiProduct } from "../../api";
import { AdminLayout } from "./AdminLayout";
import { DashboardView } from "./DashboardView";
import { AnalyticsView } from "./AnalyticsView";
import { ProductsAdminView } from "./ProductsAdminView";
import { OrdersAdminView } from "./OrdersAdminView";
import { CustomersAdminView } from "./CustomersAdminView";
import { ProfileSettingsView } from "./ProfileSettingsView";
import { ConfirmModal } from "./ConfirmModal";
import { ProductForm } from "./ProductForm";
import { 
  INITIAL_ADMIN_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, 
  AdminProduct, AdminOrder, AdminCustomer 
} from "./mockAdminData";
import { CheckCircle, Sparkles, X } from "lucide-react";

interface AdminDashboardProps {
  onExitPortal: () => void;
}

export function AdminDashboard({ onExitPortal }: AdminDashboardProps) {
  // 1. Primary memory store state arrays (CRUD operations act on these in-session)
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [customers, setCustomers] = React.useState<AdminCustomer[]>([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => Boolean(localStorage.getItem("signhub_admin_token")));
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [loginForm, setLoginForm] = React.useState({ email: "admin@gmail.com", password: "" });
  const [loginError, setLoginError] = React.useState("");
  const [lowStockThreshold, setLowStockThreshold] = React.useState(() => Number(localStorage.getItem("signhub_low_stock_threshold") || "5"));

  // Layout navigation
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");

  // Visual custom toast states
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "neutral" } | null>(null);

  const showLocalToast = (message: string, type: "success" | "neutral" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadAdminData = React.useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [productsPage, ordersPage] = await Promise.all([
        api.getAdminProducts(),
        api.getAdminOrders(),
        api.getAdminDashboard().catch(() => null),
      ]);
      const mappedProducts = productsPage.content.map(mapAdminProduct);
      const mappedOrders = ordersPage.content.map(mapAdminOrder);
      setProducts(mappedProducts);
      setOrders(mappedOrders);
      setCustomers(buildCustomersFromOrders(mappedOrders));
    } catch (error) {
      setProducts([]);
      setOrders([]);
      setCustomers([]);
      showLocalToast(error instanceof Error ? `Không tải được dữ liệu admin: ${error.message}` : "Không tải được dữ liệu admin", "neutral");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, loadAdminData]);

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    try {
      const auth = await api.adminLogin(loginForm);
      if (auth.email !== "admin@gmail.com" || auth.role !== "ADMIN") {
        throw new Error("Tài khoản này không có quyền quản trị.");
      }
      localStorage.setItem("signhub_admin_token", auth.token);
      localStorage.setItem("signhub_admin_profile", JSON.stringify(auth));
      setIsAuthenticated(true);
      showLocalToast("Đăng nhập quản trị thành công", "success");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Đăng nhập thất bại");
    }
  };

  // 2. Product Management Curation Drawer States
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [selectedProductForCuration, setSelectedProductForCuration] = React.useState<AdminProduct | null>(null);

  // 3. Destructive confirmation modals
  const [deletingProduct, setDeletingProduct] = React.useState<AdminProduct | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = React.useState<string[] | null>(null);

  // 4. Order Details Modal selections
  const [activeSelectedOrder, setActiveSelectedOrder] = React.useState<AdminOrder | null>(null);

  // 5. CRUD IMPLEMENTATION: Save curated product (Creates or updates product state)
  const buildProductPayload = (productData: Partial<AdminProduct>) => ({
    name: productData.name || "Sản phẩm chưa đặt tên",
    code: productData.subName || productData.name || `SP-${Date.now()}`,
    shortDescription: productData.subName || "",
    description: productData.desc || "",
    material: productData.materials || "",
    thickness: productData.dimensions || "",
    weight: productData.origin || "",
    basePrice: Number(productData.price || 0),
    status: productData.status === "Active" ? "ACTIVE" as const : "INACTIVE" as const,
    featured: false,
    images: [
      productData.image ? { imageUrl: productData.image, mainImage: true, sortOrder: 0 } : null,
      ...(productData.gallery || []).map((imageUrl, index) => ({ imageUrl, mainImage: false, sortOrder: index + 1 })),
    ].filter(Boolean) as { imageUrl: string; mainImage?: boolean; sortOrder?: number }[],
    variants: (productData.finishOptions || ["Tiêu chuẩn"]).map((size) => ({
      size,
      extraPrice: 0,
      stockQuantity: productData.stock || 0,
      active: true,
    })),
  });

  const applyBackendId = (productData: Partial<AdminProduct>, savedProduct?: ApiProduct) => ({
    ...productData,
    backendId: savedProduct?.id || productData.backendId,
  });

  const handleSaveProduct = async (productData: Partial<AdminProduct>) => {
    let savedProduct: ApiProduct | undefined;
    try {
      const payload = buildProductPayload(productData);
      if (selectedProductForCuration?.backendId) {
        savedProduct = await api.updateAdminProduct(selectedProductForCuration.backendId, payload);
      } else {
        savedProduct = await api.createAdminProduct(payload);
      }
    } catch (error) {
      showLocalToast(error instanceof Error ? `Chưa lưu được vào database: ${error.message}` : "Chưa lưu được vào database", "neutral");
    }

    const productWithBackendId = applyBackendId(productData, savedProduct);
    if (selectedProductForCuration) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductForCuration.id ? ({ ...p, ...productWithBackendId } as AdminProduct) : p))
      );
      showLocalToast(savedProduct ? `Đã cập nhật sản phẩm "${productData.name}" và lưu vào database` : `Đã cập nhật tạm sản phẩm "${productData.name}"`, savedProduct ? "success" : "neutral");
    } else {
      // Create new
      const newId = `piece-${Date.now()}`;
      const newPiece: AdminProduct = {
        id: newId,
        backendId: savedProduct?.id,
        name: productWithBackendId.name || "Sản phẩm chưa đặt tên",
        subName: productWithBackendId.subName || "MÃ SẢN PHẨM",
        category: productWithBackendId.category || "decor",
        price: productWithBackendId.price || 1200,
        stock: productWithBackendId.stock !== undefined ? productWithBackendId.stock : 10,
        desc: productWithBackendId.desc || "Mô tả sản phẩm sẽ được cập nhật sau.",
        materials: productWithBackendId.materials || "Chất liệu tùy chỉnh",
        origin: productWithBackendId.origin || "Xưởng SignHub Việt Nam",
        dimensions: productWithBackendId.dimensions || "60cm x 60cm",
        image: productWithBackendId.image || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=120",
        status: productWithBackendId.status || "Active",
        finishOptions: productWithBackendId.finishOptions || ["Tiêu chuẩn"],
        gallery: productWithBackendId.gallery || []
      };
      setProducts((prev) => [newPiece, ...prev]);
      showLocalToast(savedProduct ? `Đã tạo sản phẩm "${newPiece.name}" và lưu vào database` : `Đã tạo tạm sản phẩm "${newPiece.name}"`, savedProduct ? "success" : "neutral");
    }
    setIsProductFormOpen(false);
    setSelectedProductForCuration(null);
  };

  // Single Delete Product Safe handling
  const handleConfirmDeleteProduct = async () => {
    if (deletingProduct) {
      if (deletingProduct.backendId) {
        try {
          await api.deleteAdminProduct(deletingProduct.backendId);
        } catch (error) {
          showLocalToast(error instanceof Error ? `Chưa xóa được trong database: ${error.message}` : "Chưa xóa được trong database", "neutral");
          return;
        }
      }
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showLocalToast(`Đã xóa sản phẩm "${deletingProduct.name}"`, "neutral");
      setDeletingProduct(null);
    }
  };

  // Bulk Delete implementation
  const handleConfirmBulkDelete = () => {
    if (bulkDeletingIds) {
      setProducts((prev) => prev.filter((p) => !bulkDeletingIds.includes(p.id)));
      showLocalToast(`Đã xóa ${bulkDeletingIds.length} sản phẩm đã chọn`, "neutral");
      setBulkDeletingIds(null);
    }
  };

  // Bulk Status Modification
  const handleBulkStatusUpdate = (productIds: string[], status: "Active" | "Hidden") => {
    setProducts((prev) =>
      prev.map((p) => (productIds.includes(p.id) ? { ...p, status } : p))
    );
    showLocalToast(`Đã cập nhật trạng thái cho ${productIds.length} sản phẩm`, "success");
  };

  // 6. ORDER PROGRESS LOGISTICS
  const handleUpdateOrderStatus = async (orderId: string, status: "Processing" | "Shipped" | "Delivered" | "Cancelled") => {
    const backendStatus = mapDeliveryStatusToApi(status);
    try {
      await api.updateAdminOrderStatus(orderId, backendStatus);
    } catch (error) {
      showLocalToast(error instanceof Error ? `Chưa cập nhật được database: ${error.message}` : "Chưa cập nhật được database", "neutral");
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: status } : o))
    );
    showLocalToast(`Đã cập nhật trạng thái đơn hàng: ${status}`, "success");
    // Update active selections references Reactively
    if (activeSelectedOrder && activeSelectedOrder.id === orderId) {
      setActiveSelectedOrder((prev) => prev ? { ...prev, deliveryStatus: status } : null);
    }
  };

  // 7. CUSTOMER SECURITY - Lock or unlock client accounts
  const handleToggleCustomerLock = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const nextStatus = c.status === "Active" ? "Locked" : "Active";
          showLocalToast(
            nextStatus === "Locked" 
              ? `Đã khóa tài khoản khách hàng` 
              : `Đã mở khóa tài khoản khách hàng`, 
            "success"
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] flex items-center justify-center px-6 font-sans">
        <form onSubmit={handleAdminLogin} className="w-full max-w-md bg-white border border-[#c4c7c7]/30 rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <span className="text-[10px] tracking-widest font-bold text-[#775a19] uppercase">SignHub Admin</span>
            <h1 className="font-display text-3xl font-bold text-[#1b1c1c] mt-2">Đăng nhập quản trị</h1>
            <p className="text-xs text-[#444748] mt-2">Chỉ tài khoản admin@gmail.com mới được vào trang quản trị.</p>
          </div>
          <div className="space-y-4">
            <input type="email" value={loginForm.email} onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))} className="admin-input text-sm" placeholder="Email" required />
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} className="admin-input text-sm" placeholder="Mật khẩu" required />
          </div>
          {loginError && <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-xl p-3">{loginError}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onExitPortal} className="flex-1 py-3 border border-[#c4c7c7] rounded-full text-xs font-bold tracking-widest uppercase">Quay lại</button>
            <button type="submit" className="flex-1 py-3 bg-[#1b1c1c] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#775a19]">Đăng nhập</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div id="portal-root-element" className="font-sans">
      
      {/* Dynamic Shell Layout Wrapper */}
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          localStorage.removeItem("signhub_admin_token");
          localStorage.removeItem("signhub_admin_profile");
          setIsAuthenticated(false);
          onExitPortal();
        }}
      >
        {isLoadingData && (
          <div className="mb-6 rounded-xl border border-[#c4c7c7]/30 bg-white px-4 py-3 text-xs font-semibold text-[#444748]">
            Đang tải dữ liệu thật từ database...
          </div>
        )}
        {/* Dynamic content tab renderer */}
        {activeTab === "dashboard" && (
          <DashboardView 
            products={products}
            orders={orders}
            customers={customers}
            lowStockThreshold={lowStockThreshold}
            onNavigateToTab={setActiveTab}
            onSelectOrder={(ord) => {
              setActiveSelectedOrder(ord);
              setActiveTab("orders");
            }}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView 
            products={products}
            orders={orders}
          />
        )}

        {activeTab === "products" && (
          <ProductsAdminView 
            products={products}
            onAddProduct={() => {
              setSelectedProductForCuration(null);
              setIsProductFormOpen(true);
            }}
            onEditProduct={(p) => {
              setSelectedProductForCuration(p);
              setIsProductFormOpen(true);
            }}
            onDeleteProduct={setDeletingProduct}
            onBulkDelete={setBulkDeletingIds}
            onBulkStatusUpdate={handleBulkStatusUpdate}
          />
        )}

        {activeTab === "orders" && (
          <OrdersAdminView 
            orders={orders}
            selectedOrder={activeSelectedOrder}
            onSelectOrder={setActiveSelectedOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === "customers" && (
          <CustomersAdminView 
            customers={customers}
            orders={orders}
            onToggleCustomerLock={handleToggleCustomerLock}
          />
        )}

        {activeTab === "profile" && (
          <ProfileSettingsView 
            onShowToast={showLocalToast}
            lowStockThreshold={lowStockThreshold}
            onLowStockThresholdChange={setLowStockThreshold}
          />
        )}
      </AdminLayout>

      {/* product-form.tsx slide drawer drawer panel wrapper */}
      <ProductForm 
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setSelectedProductForCuration(null);
        }}
        product={selectedProductForCuration}
        onSave={handleSaveProduct}
      />

      {/* SINGLE ITEM DELETE CONFIRMER MODAL */}
      <ConfirmModal 
        isOpen={deletingProduct !== null}
        title="Xóa sản phẩm?"
        message={`Bạn có chắc muốn xóa "${deletingProduct?.name}" khỏi danh sách sản phẩm?`}
        confirmLabel="Xóa"
        cancelLabel="Giữ lại"
        type="danger"
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setDeletingProduct(null)}
      />

      {/* BULK SELECTION DELETION SAFEGUARD CONFIRMER MODAL */}
      <ConfirmModal 
        isOpen={bulkDeletingIds !== null}
        title="Xóa các sản phẩm đã chọn?"
        message={`Thao tác này sẽ xóa ${bulkDeletingIds?.length || 0} sản phẩm đã chọn khỏi danh sách quản trị.`}
        confirmLabel="Xóa đã chọn"
        cancelLabel="Hủy"
        type="danger"
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setBulkDeletingIds(null)}
      />

      {/* PORTAL SPECIFIC GOLDEN TOAST NOTIFICATION STACK */}
      {toast && (
        <div className="fixed top-24 right-10 z-[120] max-w-sm w-max glass border border-[#775a19]/50 rounded-2xl p-4.5 shadow-2xl animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          {toast.type === "success" ? (
            <CheckCircle className="text-[#775a19] flex-shrink-0" size={18} />
          ) : (
            <Sparkles className="text-brand-gray flex-shrink-0" size={18} />
          )}
          <span className="font-sans text-xs font-semibold text-[#1b1c1c] tracking-wide">
            {toast.message}
          </span>
        </div>
      )}

    </div>
  );
}

function mapAdminProduct(product: ApiProduct): AdminProduct {
  const mapped = mapApiProduct(product);
  const stock = (product.variants || []).reduce((sum, variant) => sum + Number(variant.stockQuantity || 0), 0);
  return {
    ...mapped,
    id: product.id,
    backendId: product.id,
    category: product.category?.slug || "decor",
    categoryName: product.category?.name || "Khác",
    stock,
    materials: product.material || "Chưa cập nhật",
    origin: product.weight || "SignHub",
    dimensions: product.thickness || "Theo yêu cầu",
    status: product.status === "ACTIVE" ? (stock === 0 ? "Out of Stock" : "Active") : "Hidden",
    finishOptions: (product.variants || []).map((variant) => variant.size),
  };
}

function mapAdminOrder(order: ApiOrder): AdminOrder {
  const address = order.shipToDifferentAddress && order.shippingAddress ? order.shippingAddress : order.billingAddress;
  return {
    id: order.id,
    invoiceNo: order.orderCode,
    customerName: order.billingAddress?.fullName || "Khách hàng",
    customerEmail: order.billingAddress?.email || "",
    customerPhone: order.billingAddress?.phone || "",
    customerAddress: [address?.detailAddress, address?.ward, address?.district, address?.province].filter(Boolean).join(", "),
    date: order.createdAt ? order.createdAt.slice(0, 10) : "",
    items: (order.items || []).map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      price: Number(item.unitPrice || 0),
      finish: "Theo mẫu",
      size: item.variantSize || "Theo yêu cầu",
    })),
    totalPrice: Number(order.totalAmount || 0),
    paymentStatus: order.paymentStatus === "PAID" ? "Paid" : "Pending",
    deliveryStatus: mapApiOrderStatus(order.orderStatus),
  };
}

function mapApiOrderStatus(status: ApiOrder["orderStatus"]): AdminOrder["deliveryStatus"] {
  if (status === "COMPLETED") return "Delivered";
  if (status === "SHIPPING") return "Shipped";
  if (status === "CANCELLED") return "Cancelled";
  return "Processing";
}

function mapDeliveryStatusToApi(status: AdminOrder["deliveryStatus"]): ApiOrder["orderStatus"] {
  if (status === "Delivered") return "COMPLETED";
  if (status === "Shipped") return "SHIPPING";
  if (status === "Cancelled") return "CANCELLED";
  return "CONFIRMED";
}

function buildCustomersFromOrders(orders: AdminOrder[]): AdminCustomer[] {
  const byEmail = new Map<string, AdminCustomer>();
  orders.forEach((order) => {
    const key = order.customerEmail || order.customerPhone || order.customerName;
    const existing = byEmail.get(key);
    if (existing) {
      existing.totalSpent += order.totalPrice;
      existing.orderIds.push(order.id);
      if (order.date < existing.joinedDate) existing.joinedDate = order.date;
      return;
    }
    byEmail.set(key, {
      id: `CUST-${String(byEmail.size + 1).padStart(3, "0")}`,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName)}&background=775a19&color=fff`,
      joinedDate: order.date,
      totalSpent: order.totalPrice,
      status: "Active",
      orderIds: [order.id],
    });
  });
  return Array.from(byEmail.values());
}
