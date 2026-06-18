/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, PRODUCTS } from "../../data";

export interface AdminProduct extends Product {
  stock: number;
  materials: string;
  origin: string;
  dimensions: string;
  status: "Active" | "Hidden" | "Out of Stock";
  finishOptions: string[];
}

export interface AdminOrder {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
    finish: string;
    size: string;
  }[];
  totalPrice: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  deliveryStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  joinedDate: string;
  totalSpent: number;
  status: "Active" | "Locked";
  orderIds: string[];
}

// Map database PRODUCTS to AdminProducts with realistic luxurious details
export const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = PRODUCTS.map((p) => {
  const materialsSpec = p.specs?.find(s => s.label === "MATERIALS")?.value || "Solid White Oak, Premium Textile";
  const dimSpec = p.specs?.find(s => s.label === "DIMENSIONS" || s.label === "SIZE" || s.label === "HEIGHT")?.value || "85cm H x 80cm W x 90cm D";
  const originSpec = p.specs?.find(s => s.label === "ORIGIN")?.value || "L'Art Décor Saigon Workshop";

  // Low stock cases to trigger low stock alerts in UI
  let stock = 12;
  let status: "Active" | "Hidden" | "Out of Stock" = "Active";
  if (p.id === "nen-lounge-chair") {
    stock = 3; // triggers Low Stock
  } else if (p.id === "tinh-ceramic-set") {
    stock = 0; // triggers Out of Stock
    status = "Out of Stock";
  } else if (p.id === "cura-sculptural-vase") {
    stock = 25;
  } else if (p.id === "latelier-lounge-chair") {
    stock = 4; // triggers Low Stock
  } else if (p.id === "stockholm-trestle") {
    stock = 7;
  }

  return {
    ...p,
    stock,
    materials: materialsSpec,
    origin: originSpec,
    dimensions: dimSpec,
    status,
    finishOptions: ["Standard Matte", "Ebony Gloss", "Silt Textured"]
  };
});

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ORD-2026-001",
    invoiceNo: "LAD-889-2026",
    customerName: "Phạm Minh Hoàng",
    customerEmail: "hoang.pham@primehcmc.vn",
    customerPhone: "+84 90 123 4567",
    customerAddress: "Penthouse B, Serenity Sky Villas, District 3, HCMC",
    date: "2026-06-12",
    items: [
      {
        productName: "Nén Lounge Chair",
        quantity: 1,
        price: 3200,
        finish: "Standard Matte",
        size: "STANDARD"
      },
      {
        productName: "Tĩnh Ceramic Set",
        quantity: 2,
        price: 650,
        finish: "Silt Textured",
        size: "STANDARD"
      }
    ],
    totalPrice: 4500,
    paymentStatus: "Paid",
    deliveryStatus: "Processing"
  },
  {
    id: "ORD-2026-002",
    invoiceNo: "LAD-890-2026",
    customerName: "Trần Nguyễn Phương Chi",
    customerEmail: "chi.nguyen@vinhomes.vn",
    customerPhone: "+84 98 765 4321",
    customerAddress: "Villa 24, Golden River Villas, District 1, HCMC",
    date: "2026-06-10",
    items: [
      {
        productName: "Khối Coffee Table",
        quantity: 1,
        price: 4400,
        finish: "Standard Matte",
        size: "GRAND (+ $450)"
      },
      {
        productName: "Tâm Floor Lamp",
        quantity: 1,
        price: 1850,
        finish: "Brushed Brass",
        size: "STANDARD"
      }
    ],
    totalPrice: 6250,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped"
  },
  {
    id: "ORD-2026-003",
    invoiceNo: "LAD-891-2026",
    customerName: "Alexander Sterling",
    customerEmail: "a.sterling@citygate.sg",
    customerPhone: "+65 9123 4567",
    customerAddress: "High-level Condo, Keppel Bay Marina, Singapore",
    date: "2026-06-05",
    items: [
      {
        productName: "Verdant Lounge Chair",
        quantity: 2,
        price: 2450,
        finish: "Forest Green Velvet",
        size: "STANDARD"
      }
    ],
    totalPrice: 4900,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-2026-004",
    invoiceNo: "LAD-892-2026",
    customerName: "Lê Thị Xuân Hương",
    customerEmail: "huong.le@architects.vn",
    customerPhone: "+84 91 355 8899",
    customerAddress: "Garden Residence, Thảo Điền, Thu Duc City, HCMC",
    date: "2026-05-24",
    items: [
      {
        productName: "Brass Orbit Floor Lamp",
        quantity: 1,
        price: 680,
        finish: "Polished Gold Brass",
        size: "STANDARD"
      },
      {
        productName: "Cura Sculptural Vase",
        quantity: 3,
        price: 420,
        finish: "Ivory Matte",
        size: "STANDARD"
      }
    ],
    totalPrice: 1940,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-2026-005",
    invoiceNo: "LAD-893-2026",
    customerName: "Nguyễn Vũ Bảo Long",
    customerEmail: "baolong.nguyen@vinamilk.com",
    customerPhone: "+84 93 444 8877",
    customerAddress: "Chateau Mansion, Phu My Hung, District 7, HCMC",
    date: "2026-05-15",
    items: [
      {
        productName: "L'Atelier Lounge Chair",
        quantity: 2,
        price: 1850,
        finish: "Standard Matte",
        size: "STANDARD"
      }
    ],
    totalPrice: 3700,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered"
  },
  {
    id: "ORD-2026-006",
    invoiceNo: "LAD-894-2026",
    customerName: "Vũ Hải Đăng",
    customerEmail: "dang.vu@luxuryspaces.vn",
    customerPhone: "+84 97 222 1100",
    customerAddress: "Apartment 1802, Sunwah Pearl, Binh Thanh District, HCMC",
    date: "2026-06-14",
    items: [
      {
        productName: "Lunar Floor Arc",
        quantity: 1,
        price: 1890,
        finish: "Slender Black Metal",
        size: "STANDARD"
      }
    ],
    totalPrice: 1890,
    paymentStatus: "Pending",
    deliveryStatus: "Processing"
  },
  {
    id: "ORD-2026-007",
    invoiceNo: "LAD-895-2026",
    customerName: "Isabella Montoya",
    customerEmail: "i.montoya@themetropolitan.com",
    customerPhone: "+84 90 999 8881",
    customerAddress: "InterContinental Residence, West Lake, Tay Ho, Hanoi",
    date: "2026-06-15",
    items: [
      {
        productName: "Gilded Void Canvas",
        quantity: 1,
        price: 920,
        finish: "Raw Oak Frame",
        size: "STANDARD"
      }
    ],
    totalPrice: 920,
    paymentStatus: "Pending",
    deliveryStatus: "Cancelled"
  }
];

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Phạm Minh Hoàng",
    email: "hoang.pham@primehcmc.vn",
    phone: "+84 90 123 4567",
    address: "Penthouse B, Serenity Sky Villas, District 3, HCMC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2025-01-14",
    totalSpent: 12500,
    status: "Active",
    orderIds: ["ORD-2026-001"]
  },
  {
    id: "CUST-002",
    name: "Trần Nguyễn Phương Chi",
    email: "chi.nguyen@vinhomes.vn",
    phone: "+84 98 765 4321",
    address: "Villa 24, Golden River Villas, District 1, HCMC",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2024-11-05",
    totalSpent: 18400,
    status: "Active",
    orderIds: ["ORD-2026-002"]
  },
  {
    id: "CUST-003",
    name: "Alexander Sterling",
    email: "a.sterling@citygate.sg",
    phone: "+65 9123 4567",
    address: "High-level Condo, Keppel Bay Marina, Singapore",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2025-03-20",
    totalSpent: 4900,
    status: "Active",
    orderIds: ["ORD-2026-003"]
  },
  {
    id: "CUST-004",
    name: "Lê Thị Xuân Hương",
    email: "huong.le@architects.vn",
    phone: "+84 91 355 8899",
    address: "Garden Residence, Thảo Điền, Thu Duc City, HCMC",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2025-02-18",
    totalSpent: 5350,
    status: "Active",
    orderIds: ["ORD-2026-004"]
  },
  {
    id: "CUST-005",
    name: "Nguyễn Vũ Bảo Long",
    email: "baolong.nguyen@vinamilk.com",
    phone: "+84 93 444 8877",
    address: "Chateau Mansion, Phu My Hung, District 7, HCMC",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2024-09-12",
    totalSpent: 22800,
    status: "Active",
    orderIds: ["ORD-2026-005"]
  },
  {
    id: "CUST-006",
    name: "Vũ Hải Đăng",
    email: "dang.vu@luxuryspaces.vn",
    phone: "+84 97 222 1100",
    address: "Apartment 1802, Sunwah Pearl, Binh Thanh District, HCMC",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2025-05-01",
    totalSpent: 1890,
    status: "Active",
    orderIds: ["ORD-2026-006"]
  },
  {
    id: "CUST-007",
    name: "Isabella Montoya",
    email: "i.montoya@themetropolitan.com",
    phone: "+84 90 999 8881",
    address: "InterContinental Residence, West Lake, Tay Ho, Hanoi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    joinedDate: "2025-04-10",
    totalSpent: 920,
    status: "Locked",
    orderIds: ["ORD-2026-007"]
  }
];

// Analytical Month Revenue Points
export const MONTHLY_REVENUE_DATA = [
  { month: "Jan 2026", revenue: 45000, orders: 12 },
  { month: "Feb 2026", revenue: 58000, orders: 16 },
  { month: "Mar 2026", revenue: 72000, orders: 20 },
  { month: "Apr 2026", revenue: 64000, orders: 18 },
  { month: "May 2026", revenue: 89000, orders: 24 },
  { month: "Jun 2026", revenue: 104350, orders: 29 } // highest peak
];

export const CATEGORY_PERFORMANCE = [
  { category: "Seating", sales: 24500 + 3200 + 1250 * 5, count: 14 },
  { category: "Lighting", sales: 1850 * 4 + 1890 + 680 * 2, count: 8 },
  { category: "Tables", sales: 4400 * 2 + 4200 + 450 * 3, count: 7 },
  { category: "Décor", sales: 650 * 6 + 850 * 2 + 920 + 420 * 8, count: 18 }
];

export const ADMIN_PROFILE_DEFAULT = {
  name: "Madame Kim Oanh",
  email: "curator@lartdecor.vn",
  phone: "+84 901 888 999",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  role: "Lead Artistic Director & Principal Curator"
};
