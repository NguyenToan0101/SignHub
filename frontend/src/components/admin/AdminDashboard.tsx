/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
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
  const [products, setProducts] = React.useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [orders, setOrders] = React.useState<AdminOrder[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = React.useState<AdminCustomer[]>(INITIAL_CUSTOMERS);

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

  // 2. Product Management Curation Drawer States
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [selectedProductForCuration, setSelectedProductForCuration] = React.useState<AdminProduct | null>(null);

  // 3. Destructive confirmation modals
  const [deletingProduct, setDeletingProduct] = React.useState<AdminProduct | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = React.useState<string[] | null>(null);

  // 4. Order Details Modal selections
  const [activeSelectedOrder, setActiveSelectedOrder] = React.useState<AdminOrder | null>(null);

  // 5. CRUD IMPLEMENTATION: Save curated product (Creates or updates product state)
  const handleSaveProduct = (productData: Partial<AdminProduct>) => {
    if (selectedProductForCuration) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductForCuration.id ? ({ ...p, ...productData } as AdminProduct) : p))
      );
      showLocalToast(`Curated piece "${productData.name}" has been updated`, "success");
    } else {
      // Create new
      const newId = `piece-${Date.now()}`;
      const newPiece: AdminProduct = {
        id: newId,
        name: productData.name || "Unnamed Masterpiece",
        subName: productData.subName || "SOLID RAW STONE",
        category: productData.category || "decor",
        price: productData.price || 1200,
        stock: productData.stock !== undefined ? productData.stock : 10,
        desc: productData.desc || "Poppins space statement of organic silhouette",
        materials: productData.materials || "Natural Silicates",
        origin: productData.origin || "L'Art Décor Local Vietnam Workshop",
        dimensions: productData.dimensions || "60cm x 60cm",
        image: productData.image || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=120",
        status: productData.status || "Active",
        finishOptions: productData.finishOptions || ["Standard Smooth"],
        gallery: productData.gallery || []
      };
      setProducts((prev) => [newPiece, ...prev]);
      showLocalToast(`Piece "${newPiece.name}" curated into Lookbook`, "success");
    }
    setIsProductFormOpen(false);
    setSelectedProductForCuration(null);
  };

  // Single Delete Product Safe handling
  const handleConfirmDeleteProduct = () => {
    if (deletingProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showLocalToast(`Piece "${deletingProduct.name}" removed from collection`, "neutral");
      setDeletingProduct(null);
    }
  };

  // Bulk Delete implementation
  const handleConfirmBulkDelete = () => {
    if (bulkDeletingIds) {
      setProducts((prev) => prev.filter((p) => !bulkDeletingIds.includes(p.id)));
      showLocalToast(`Selected ${bulkDeletingIds.length} pieces removed from collection`, "neutral");
      setBulkDeletingIds(null);
    }
  };

  // Bulk Status Modification
  const handleBulkStatusUpdate = (productIds: string[], status: "Active" | "Hidden") => {
    setProducts((prev) =>
      prev.map((p) => (productIds.includes(p.id) ? { ...p, status } : p))
    );
    showLocalToast(`Updated status of ${productIds.length} pieces to ${status}`, "success");
  };

  // 6. ORDER PROGRESS LOGISTICS
  const handleUpdateOrderStatus = (orderId: string, status: "Processing" | "Shipped" | "Delivered" | "Cancelled") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, deliveryStatus: status } : o))
    );
    showLocalToast(`Invoice registration status updated to: ${status}`, "success");
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
              ? `Client account barred for security reasons` 
              : `Security constraints suspended. Profile access granted`, 
            "success"
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  return (
    <div id="portal-root-element" className="font-sans">
      
      {/* Dynamic Shell Layout Wrapper */}
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onExitPortal}
      >
        {/* Dynamic content tab renderer */}
        {activeTab === "dashboard" && (
          <DashboardView 
            products={products}
            orders={orders}
            customers={customers}
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
        title="Remove piece from lookup?"
        message={`Are you fully certain you desire to de-curate "${deletingProduct?.name}"? Doing so resolves its active indices and removes it from user-facing boutique lookbooks.`}
        confirmLabel="REMOVE PIECE"
        cancelLabel="KEEP PIECE"
        type="danger"
        onConfirm={handleConfirmDeleteProduct}
        onCancel={() => setDeletingProduct(null)}
      />

      {/* BULK SELECTION DELETION SAFEGUARD CONFIRMER MODAL */}
      <ConfirmModal 
        isOpen={bulkDeletingIds !== null}
        title="Remove Selected Masterpieces?"
        message={`This action will permanently purge ${bulkDeletingIds?.length || 0} selected furniture records from L'Art Décor's lookbooks. This operation is authoritative and irreversible.`}
        confirmLabel="PURGE SELECTION UNITS"
        cancelLabel="SUSPEND DELETION"
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
