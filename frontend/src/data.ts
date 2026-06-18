export interface Product {
  id: string;
  backendId?: string;
  name: string;
  subName?: string;
  category: string;
  categoryName?: string;
  price: number;
  image: string;
  desc: string;
  details?: string[];
  specs?: { label: string; value: string }[];
  isNew?: boolean;
  isLimited?: boolean;
  gallery?: string[];
  variants?: { id: string; size: string; extraPrice: number; stockQuantity: number; active: boolean }[];
}

export interface JournalPost {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  image: string;
  summary: string;
  content: string;
}

const fallbackImage = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop";

export const PRODUCTS: Product[] = [
  {
    id: "bien-so-nha-mica-den-vien-vang",
    name: "Biển số nhà mica đen viền vàng",
    subName: "BSN-PMV421",
    category: "bien-so-nha",
    categoryName: "Biển số nhà",
    price: 280000,
    image: fallbackImage,
    desc: "Biển số nhà mica thiết kế theo yêu cầu, nổi bật trên nền tường sáng và phù hợp nhà phố hiện đại.",
    isNew: true,
    specs: [
      { label: "Chất liệu", value: "Mica/Inox/Alu" },
      { label: "Độ dày", value: "3mm - 5mm" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variants: [
      { id: "", size: "25x17.5cm", extraPrice: 0, stockQuantity: 50, active: true },
      { id: "", size: "30x21cm", extraPrice: 50000, stockQuantity: 50, active: true },
      { id: "", size: "35x24.5cm", extraPrice: 90000, stockQuantity: 50, active: true },
    ],
  },
  {
    id: "bien-so-nha-inox-guong-cao-cap",
    name: "Biển số nhà inox gương cao cấp",
    subName: "BSN-PMV422",
    category: "bien-so-nha",
    categoryName: "Biển số nhà",
    price: 420000,
    image: fallbackImage,
    desc: "Mẫu inox gương sắc nét, bền màu, dễ vệ sinh và phù hợp mặt tiền sang trọng.",
    isLimited: true,
    specs: [
      { label: "Chất liệu", value: "Inox gương" },
      { label: "Độ dày", value: "3mm - 5mm" },
      { label: "Hoàn thiện", value: "Cắt CNC, phủ bảo vệ" },
    ],
  },
  {
    id: "bien-ten-cong-ty-alu-phu-uv",
    name: "Biển tên công ty alu phủ UV",
    subName: "BCY-PMV101",
    category: "bien-cong-ty",
    categoryName: "Biển công ty",
    price: 650000,
    image: fallbackImage,
    desc: "Biển công ty dùng nền alu, in UV rõ nét, phù hợp văn phòng, showroom và bảng phòng ban.",
    specs: [
      { label: "Chất liệu", value: "Alu/Inox/Mica" },
      { label: "Kỹ thuật", value: "In UV hoặc chữ nổi" },
      { label: "Thiết kế", value: "Duyệt mockup trước sản xuất" },
    ],
  },
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: "cach-chon-kich-thuoc-bien-so-nha",
    title: "Cách chọn kích thước biển số nhà phù hợp",
    category: "TƯ VẤN",
    publishedAt: "18/06/2026",
    image: fallbackImage,
    summary: "Gợi ý nhanh để biển số nhà dễ nhìn, cân đối với mặt tiền và không gian xung quanh.",
    content: "Nên chọn kích thước dựa trên khoảng cách quan sát, màu nền tường và phong cách mặt tiền. Với nhà phố, các kích thước 25x17.5cm, 30x21cm và 35x24.5cm thường dễ cân đối.",
  },
  {
    id: "nen-chon-mica-hay-inox",
    title: "Nên chọn mica, inox hay alu?",
    category: "CHẤT LIỆU",
    publishedAt: "12/06/2026",
    image: fallbackImage,
    summary: "Mỗi chất liệu có ưu điểm riêng về độ bền, độ nổi bật và ngân sách.",
    content: "Mica phù hợp thiết kế hiện đại và nhiều màu. Inox phù hợp mặt tiền sang trọng. Alu nhẹ, bền và tối ưu cho biển công ty.",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    author: "NGUYỄN MINH HOÀNG",
    role: "Khách hàng tại TP. Hồ Chí Minh",
    text: "\"Biển số nhà lên đúng mẫu đã duyệt, màu sắc rõ và tư vấn rất nhanh.\"",
  },
  {
    id: "t2",
    author: "TRẦN THỊ BẢO ANH",
    role: "Chủ cửa hàng",
    text: "\"Biển công ty gọn, sáng và nhìn chuyên nghiệp hơn hẳn bảng cũ.\"",
  },
  {
    id: "t3",
    author: "LÊ QUANG HUY",
    role: "Khách hàng căn hộ",
    text: "\"Tôi chỉ gửi số nhà và màu tường, SignHub gợi ý kích thước rất hợp.\"",
  },
];
