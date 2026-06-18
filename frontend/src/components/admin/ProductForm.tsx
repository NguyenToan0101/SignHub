/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Image as ImageIcon, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { api } from "../../api";
import { AdminProduct } from "./mockAdminData";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: AdminProduct | null;
  onSave: (productData: Partial<AdminProduct>) => void | Promise<void>;
}

type GalleryDraft = {
  id: string;
  url: string;
  file?: File;
};

const STATUS_LABELS: Record<AdminProduct["status"], string> = {
  Active: "Đang bán",
  Hidden: "Đang ẩn",
  "Out of Stock": "Hết hàng",
};

export function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const [formData, setFormData] = React.useState<Partial<AdminProduct>>({});
  const [finishInput, setFinishInput] = React.useState("");
  const [mainImageFile, setMainImageFile] = React.useState<File | null>(null);
  const [galleryDrafts, setGalleryDrafts] = React.useState<GalleryDraft[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");
  const latestImageUrl = React.useRef<string | undefined>();
  const latestGalleryDrafts = React.useRef<GalleryDraft[]>([]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (product) {
      setFormData({ ...product, finishOptions: product.finishOptions || [], gallery: product.gallery || [] });
      setGalleryDrafts((product.gallery || []).map((url) => ({ id: url, url })));
    } else {
      setFormData({
        name: "",
        subName: "",
        category: "decor",
        price: 0,
        stock: 10,
        desc: "",
        materials: "",
        origin: "Xưởng SignHub Việt Nam",
        dimensions: "",
        image: "",
        status: "Active",
        finishOptions: [],
        gallery: [],
      });
      setGalleryDrafts([]);
    }
    setMainImageFile(null);
    setFinishInput("");
    setUploadError("");
  }, [product, isOpen]);

  React.useEffect(() => {
    latestImageUrl.current = formData.image;
    latestGalleryDrafts.current = galleryDrafts;
  }, [formData.image, galleryDrafts]);

  React.useEffect(() => {
    return () => {
      if (latestImageUrl.current?.startsWith("blob:")) URL.revokeObjectURL(latestImageUrl.current);
      latestGalleryDrafts.current.forEach((item) => {
        if (item.file && item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "gallery") => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUploadError("");

    if (target === "main") {
      if (formData.image?.startsWith("blob:")) URL.revokeObjectURL(formData.image);
      setMainImageFile(file);
      setFormData((prev) => ({ ...prev, image: previewUrl }));
      return;
    }

    setGalleryDrafts((prev) => [...prev, { id: `${file.name}-${Date.now()}`, url: previewUrl, file }]);
  };

  const handleAddFinish = () => {
    const value = finishInput.trim();
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      finishOptions: (prev.finishOptions || []).includes(value) ? prev.finishOptions : [...(prev.finishOptions || []), value],
    }));
    setFinishInput("");
  };

  const handleRemoveFinish = (index: number) => {
    setFormData((prev) => ({ ...prev, finishOptions: prev.finishOptions?.filter((_, i) => i !== index) }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryDrafts((prev) => {
      const item = prev[index];
      if (item?.file && item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.image || uploading) return;

    setSaving(true);
    setUploading(true);
    setUploadError("");
    try {
      const mainImageUrl = mainImageFile
        ? (await api.uploadAdminProductImage(mainImageFile)).url
        : formData.image;
      const galleryUrls = await Promise.all(
        galleryDrafts.map(async (item) => {
          if (!item.file) return item.url;
          return (await api.uploadAdminProductImage(item.file)).url;
        })
      );
      const finalizedFormData = { ...formData, image: mainImageUrl, gallery: galleryUrls };
      if (finalizedFormData.stock === 0) finalizedFormData.status = "Out of Stock";
      await onSave(finalizedFormData);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Không thể tải ảnh lên .");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="product-form-drawer">
      <div onClick={onClose} className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm" id="product-form-overlay" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#fbf9f9] shadow-2xl flex flex-col justify-between h-full border-l border-[#c4c7c7]/30">
          <div className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white">
            <div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-[#775a19]">Quản lý sản phẩm</span>
              <h2 className="font-display text-2xl font-bold text-[#1b1c1c] leading-tight">
                {product ? `Cập nhật ${product.name}` : "Tạo sản phẩm mới"}
              </h2>
            </div>
            <button onClick={onClose} className="text-[#444748] hover:text-[#1b1c1c] p-2 rounded-full hover:bg-[#efeded]/30" aria-label="Đóng biểu mẫu">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6" id="product-curation-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Tên sản phẩm *">
                <input type="text" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Ví dụ: Biển số nhà mica đen" required className="admin-input" />
              </Field>
              <Field label="Mã hoặc mô tả ngắn">
                <input type="text" name="subName" value={formData.subName || ""} onChange={handleChange} placeholder="Ví dụ: MICA-DEN-01" className="admin-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Danh mục *">
                <select name="category" value={formData.category || "decor"} onChange={handleChange} className="admin-input cursor-pointer">
                  <option value="decor">Trang trí</option>
                  <option value="tables">Biển số nhà</option>
                  <option value="lighting">Biển hiệu đèn</option>
                  <option value="seating">Khác</option>
                </select>
              </Field>
              <Field label="Giá bán *">
                <input type="number" name="price" min="0" value={formData.price ?? ""} onChange={handleChange} required className="admin-input" />
              </Field>
              <Field label="Tồn kho *">
                <input type="number" name="stock" min="0" value={formData.stock ?? ""} onChange={handleChange} required className="admin-input" />
              </Field>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">Trạng thái</label>
              <div className="flex flex-wrap gap-4">
                {(["Active", "Hidden", "Out of Stock"] as AdminProduct["status"][]).map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#444748]">
                    <input type="radio" name="status" value={status} checked={formData.status === status} onChange={handleChange} disabled={status === "Out of Stock" && !!formData.stock && formData.stock > 0} />
                    <span>{STATUS_LABELS[status]}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Mô tả sản phẩm *">
              <textarea name="desc" value={formData.desc || ""} onChange={handleChange} rows={3} placeholder="Nhập nội dung mô tả hiển thị cho khách hàng..." required className="admin-input resize-none" />
            </Field>

            <div className="space-y-4 bg-white p-4 rounded-xl border border-[#c4c7c7]/20">
              <span className="text-[11px] font-bold tracking-widest text-[#775a19] uppercase block mb-1">Thông số</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Chất liệu">
                  <input type="text" name="materials" value={formData.materials || ""} onChange={handleChange} placeholder="Ví dụ: mica, inox, đèn LED" className="admin-input bg-[#fbf9f9]" />
                </Field>
                <Field label="Kích thước">
                  <input type="text" name="dimensions" value={formData.dimensions || ""} onChange={handleChange} placeholder="Ví dụ: 30cm x 20cm" className="admin-input bg-[#fbf9f9]" />
                </Field>
              </div>
              <Field label="Nguồn gốc / xưởng sản xuất">
                <input type="text" name="origin" value={formData.origin || ""} onChange={handleChange} placeholder="Ví dụ: Xưởng SignHub Việt Nam" className="admin-input bg-[#fbf9f9]" />
              </Field>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">Tùy chọn / phiên bản</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={finishInput} onChange={(e) => setFinishInput(e.target.value)} placeholder="Thêm tùy chọn, ví dụ: nền đen viền vàng" className="flex-grow admin-input" />
                <button type="button" onClick={handleAddFinish} className="bg-[#1b1c1c] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#775a19]">
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.finishOptions?.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-2 px-3 py-1 bg-[#efeded] text-[#1b1c1c] text-xs font-medium rounded-full">
                    {item}
                    <button type="button" onClick={() => handleRemoveFinish(index)} className="text-[#444748] hover:text-red-600 font-bold" aria-label="Xóa tùy chọn">
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">Ảnh đại diện sản phẩm *</label>
              <label className="flex items-center justify-center gap-3 w-full bg-white border border-dashed border-[#775a19]/50 rounded-xl px-4 py-5 text-sm font-semibold text-[#775a19] hover:bg-[#775a19]/5 cursor-pointer">
                <UploadCloud size={18} />
                Chọn ảnh từ máy
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "main")} />
              </label>
              {uploading && <p className="text-xs text-[#775a19] font-semibold mt-2">Đang tải ảnh lên...</p>}
              {uploadError && <p className="text-xs text-red-700 font-semibold mt-2">{uploadError}</p>}
              {formData.image && (
                <div className="flex gap-4 items-center p-3 bg-white border border-[#c4c7c7]/20 rounded-xl mt-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#efeded] border border-[#c4c7c7]/10">
                    <img referrerPolicy="no-referrer" src={formData.image} alt="Xem trước ảnh đại diện" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#775a19]">
                      {mainImageFile ? "Đã chọn ảnh, sẽ tải lên khi lưu" : "Đã có ảnh đại diện"}
                    </span>
                    <span className="text-[11px] text-[#444748] font-semibold truncate block max-w-[360px]">
                      {mainImageFile ? mainImageFile.name : formData.image}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">Thư viện ảnh ({galleryDrafts.length})</label>
              <label className="inline-flex items-center gap-2 bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2 text-xs font-semibold text-[#444748] hover:border-[#775a19] hover:text-[#775a19] cursor-pointer">
                <ImageIcon size={14} />
                Thêm ảnh phụ
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "gallery")} />
              </label>

              {!!galleryDrafts.length && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-[#c4c7c7]/20 rounded-xl mt-3">
                  {galleryDrafts.map((item, index) => (
                    <div key={item.id} className="relative group/gal h-16 bg-[#efeded] rounded-lg overflow-hidden border border-[#c4c7c7]/10">
                      <img referrerPolicy="no-referrer" src={item.url} alt="Ảnh thư viện" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveGalleryImage(index)} className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 flex items-center justify-center text-white" title="Xóa ảnh">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 border border-[#c4c7c7] py-3.5 rounded-full text-xs font-bold tracking-[0.2em] text-[#444748] uppercase hover:bg-[#efeded]/50">
              Hủy
            </button>
            <button type="button" onClick={handleSubmit} disabled={uploading || saving || !formData.image} className="flex-grow bg-[#1b1c1c] py-3.5 rounded-full text-xs font-bold tracking-[0.2em] text-white uppercase hover:bg-[#775a19] disabled:opacity-50">
              {saving ? "Đang lưu..." : product ? "Cập nhật" : "Tạo sản phẩm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}
