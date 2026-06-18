import { Product, JournalPost } from "./data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface ApiPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface ApiImage {
  id: string;
  imageUrl: string;
  mainImage: boolean;
  sortOrder: number;
}

export interface ApiVariant {
  id: string;
  size: string;
  extraPrice: number;
  stockQuantity: number;
  active: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  code: string;
  shortDescription?: string;
  description?: string;
  material?: string;
  thickness?: string;
  weight?: string;
  basePrice: number;
  status: string;
  featured: boolean;
  soldCount: number;
  category?: ApiCategory;
  images: ApiImage[];
  variants: ApiVariant[];
  createdAt?: string;
}

export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  summary?: string;
  content?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productCode: string;
  thumbnailUrl?: string;
  variantId?: string;
  variantSize?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiCart {
  id: string;
  sessionId: string;
  items: ApiCartItem[];
  subtotal: number;
}

export interface OrderPayload {
  sessionId: string;
  billingAddress: {
    fullName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
  };
  shippingAddress?: OrderPayload["billingAddress"];
  shipToDifferentAddress: boolean;
  note?: string;
  couponCode?: string;
  paymentMethod: "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";
}

function absoluteImageUrl(url?: string) {
  if (!url) return "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

export function mapApiProduct(product: ApiProduct): Product {
  const sortedImages = [...(product.images || [])].sort((a, b) => {
    if (a.mainImage !== b.mainImage) return a.mainImage ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
  const image = absoluteImageUrl(sortedImages[0]?.imageUrl);

  return {
    id: product.slug,
    backendId: product.id,
    name: product.name,
    subName: product.code,
    category: product.category?.slug || "bien-so",
    categoryName: product.category?.name || "Biển số",
    price: Number(product.basePrice || 0),
    image,
    desc: product.description || product.shortDescription || "Sản phẩm được gia công theo yêu cầu.",
    details: product.shortDescription ? [product.shortDescription] : [],
    specs: [
      product.material ? { label: "Chất liệu", value: product.material } : null,
      product.thickness ? { label: "Độ dày", value: product.thickness } : null,
      product.weight ? { label: "Trọng lượng", value: product.weight } : null,
    ].filter(Boolean) as { label: string; value: string }[],
    isNew: product.featured,
    isLimited: false,
    gallery: sortedImages.slice(1).map((item) => absoluteImageUrl(item.imageUrl)),
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      size: variant.size,
      extraPrice: Number(variant.extraPrice || 0),
      stockQuantity: variant.stockQuantity,
      active: variant.active,
    })),
  };
}

export function mapApiBlog(post: ApiBlogPost): JournalPost {
  return {
    id: post.slug,
    title: post.title,
    category: "TƯ VẤN",
    publishedAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString("vi-VN") : "",
    image: absoluteImageUrl(post.thumbnailUrl),
    summary: post.summary || "",
    content: post.content || "",
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  getProducts: (params = "") => request<ApiPage<ApiProduct>>(`/api/public/products${params}`),
  getProduct: (slug: string) => request<ApiProduct>(`/api/public/products/${slug}`),
  getRelatedProducts: (slug: string) => request<ApiProduct[]>(`/api/public/products/${slug}/related`),
  getBlogs: () => request<ApiBlogPost[]>("/api/public/blogs"),
  getCart: (sessionId: string) => request<ApiCart>(`/api/cart?sessionId=${encodeURIComponent(sessionId)}`),
  addCartItem: (payload: { productId: string; variantId?: string; quantity: number; sessionId: string }) =>
    request<ApiCart>("/api/cart/items", { method: "POST", body: JSON.stringify(payload) }),
  updateCartItem: (id: string, quantity: number, sessionId?: string) =>
    request<ApiCart>(`/api/cart/items/${id}`, { method: "PUT", body: JSON.stringify({ quantity, sessionId }) }),
  removeCartItem: (id: string, sessionId: string) =>
    request<void>(`/api/cart/items/${id}?sessionId=${encodeURIComponent(sessionId)}`, { method: "DELETE" }),
  clearCart: (sessionId: string) => request<void>(`/api/cart/clear?sessionId=${encodeURIComponent(sessionId)}`, { method: "DELETE" }),
  applyCoupon: (payload: { code: string; subtotal: number; shippingFee: number }) =>
    request<{ code: string; discountAmount: number; shippingFee: number; totalAmount: number }>("/api/coupons/apply", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createOrder: (payload: OrderPayload) => request<{ orderCode: string; totalAmount: number }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
};
