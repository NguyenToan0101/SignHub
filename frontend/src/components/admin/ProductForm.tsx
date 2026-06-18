/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Image as ImageIcon, Plus, Trash2, HelpCircle } from "lucide-react";
import { AdminProduct } from "./mockAdminData";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: AdminProduct | null; // null means 'Add New'
  onSave: (productData: Partial<AdminProduct>) => void;
}

// Preset luxury curated image suggestions for Vietnam architecture brand
const PRESET_LUXURY_IMAGES = [
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBql6VRNjbDMX9tn8uTIpwRRrwKh85aznDyBA-61oWDovUbQGLw3ICNAiJQCFa6kKZI7bGnEylpInNCKoa4t3NlUmeNxMCLTNH_eLg99lfUwHW8eaGXTA5QpgSAcMJnb6LaT3OB9F3NHzY_6Lff3qYSbiVGM4rrTWO0T1HHpmBqqkk6_4VCaWHl_MLlAI4suktLFx_ohLl6rA4EQd4W_INlQChkTc2gkDErJnMFnPN27q30ijXuy1xb9TSeEwV-wfZUM9w7OEyfKhFi", label: "Chalk Silt Clay" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk52DhQiA6KbTGLfKdm7OfzBQ1xKpR6rSl1Ks1TOBHavaaLtmKZgUjgFFIOm1VbXOuuUFm3WdKW6I0ec1yiAENNYYt_hDtl3jTsxkbc7OsAgC4C7ckQj19Wr5T66b8lsy8Ia8cNInUHpH7bUatYkj5wBjcJXz9UoQNjke8RwtvkWLHHjTpcjcufTwK2bug_3PtSytp99PwI_ZXVyuSgvAPgqH0K6wWLStaMJqGjkj19B9woI7JKr9l10JIhyoEQfOTwh82riz-457x", label: "Dark Weave Oak" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLF5_546_qeYsFofWDd8DJ_bMPC6hjD4nb7YkT0FYUTyPeN1_bTCZQJAZet8x0iQD4v0vGwsC2VXoJjvm3U38OHeJoU8P7Ju1k_qwOKLSyJYIwKo5j26pp6LEPwj6dah2hjgqYggaE3wLTAnAEsFHrAcOJGPHAlcU4dSDEyLmOkTm5gjnPUeguEmUq4SMG8MGS7bVfC0UdRad0DtjqIeO9OdRogNnbWgdGmxz6TLMBXz7wluuW8S0mHpzJnHnzVZM5S92zSxDqu1SA", label: "White Oak Bouclé" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVqIVvubMq3M9a2BIKMMjrVtmeMjeUnbn_PuFAkN8ad-7AZgWnKXgdGbP4VeeL39WMNOSzNFPJ5SFK1K9_NZWpaS2xDTicm0E0EVxaBk48kYiZPS9F5gYIX3v71h3tDirVe2m1oQe2Tqi1OxiGZsmRMDZBkrHrKSSGUKNBnFbeM1eJ-c6-cjsmhpQ4_B6Afe4uj1lrW289bORVI4t7lK4TUYG5xT62PsTVNUHur24EAJdRWf9Mp1gyADJGfogui-UIc-_hP6vd_QQR", label: "Honed Travertine Marble" }
];

export function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const [formData, setFormData] = React.useState<Partial<AdminProduct>>({
    name: "",
    subName: "",
    category: "seating",
    price: 0,
    stock: 0,
    desc: "",
    materials: "",
    origin: "Saigon Artisan Workshop",
    dimensions: "",
    image:PRESET_LUXURY_IMAGES[0].url,
    status: "Active",
    finishOptions: ["Traditional Matte", "Ebony Handglass", "Raw Silt Oak"],
    gallery: []
  });

  const [finishInput, setFinishInput] = React.useState("");
  const [galleryUrlInput, setGalleryUrlInput] = React.useState("");

  // Sync state with product prop on change/load
  React.useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        finishOptions: product.finishOptions || ["Standard Matte", "Ebony Gloss"],
        gallery: product.gallery || []
      });
    } else {
      setFormData({
        name: "",
        subName: "",
        category: "seating",
        price: 1500,
        stock: 10,
        desc: "An exceptional statement piece with organic sculptural dynamics.",
        materials: "Solid White Oak Wood, Hand weaved natural fibres",
        origin: "L'Art Décor Saigon Workshop, Vietnam",
        dimensions: "75cm H x 65cm W x 70cm D",
        image: PRESET_LUXURY_IMAGES[1].url,
        status: "Active",
        finishOptions: ["Ebony Charcoal", "Sand Oak Raw", "Imperial Brass Finish"],
        gallery: []
      });
    }
    setFinishInput("");
    setGalleryUrlInput("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };

  const handleAddFinish = () => {
    if (finishInput.trim() && formData.finishOptions) {
      if (!formData.finishOptions.includes(finishInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          finishOptions: [...(prev.finishOptions || []), finishInput.trim()]
        }));
      }
      setFinishInput("");
    }
  };

  const handleRemoveFinish = (index: number) => {
    if (formData.finishOptions) {
      setFormData((prev) => ({
        ...prev,
        finishOptions: prev.finishOptions?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddGalleryImage = () => {
    if (galleryUrlInput.trim() && formData.gallery) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
      }));
      setGalleryUrlInput("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (formData.gallery) {
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery?.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;
    
    // Auto sync stock to "Out of Stock" status
    const finalizedFormData = { ...formData };
    if (finalizedFormData.stock === 0) {
      finalizedFormData.status = "Out of Stock";
    }

    onSave(finalizedFormData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="product-form-drawer">
      {/* Dim overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm transition-opacity duration-300"
        id="product-form-overlay"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-xl bg-[#fbf9f9] shadow-2xl flex flex-col justify-between h-full border-l border-[#c4c7c7]/30 transform translate-x-0 transition-transform duration-300 animate-in slide-in-from-right"
          id="product-form-drawer-body"
        >
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#c4c7c7]/20 flex justify-between items-center bg-white" id="product-form-header">
            <div>
              <span className="text-[10px] tracking-widest font-bold uppercase text-[#775a19]">
                CURATION STUDIO
              </span>
              <h2 className="font-display text-2xl font-bold text-[#1b1c1c] leading-tight">
                {product ? `Edit ${product.name}` : "Crate New Masterpiece"}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#444748] hover:text-[#1b1c1c] p-2 rounded-full hover:bg-[#efeded]/30 transition-colors"
              aria-label="Close form drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form 
            onSubmit={handleSubmit} 
            className="flex-1 overflow-y-auto p-6 space-y-6"
            id="product-curation-form"
          >
            {/* 1. Name & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Piece Name *
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="e.g. Sông Credenza Table"
                  required
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Subtitle Style Descriptor
                </label>
                <input 
                  type="text" 
                  name="subName"
                  value={formData.subName || ""}
                  onChange={handleChange}
                  placeholder="e.g. MONOLITHIC MAHOGANY & BRONZE"
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                />
              </div>
            </div>

            {/* 2. Category, Price, Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category || "seating"}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] cursor-pointer"
                >
                  <option value="seating">Seating</option>
                  <option value="lighting">Lighting</option>
                  <option value="tables">Tables</option>
                  <option value="decor">Decor Items</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Price ($ USD) *
                </label>
                <input 
                  type="number" 
                  name="price"
                  min="0"
                  value={formData.price !== undefined ? formData.price : ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Stock Units *
                </label>
                <input 
                  type="number" 
                  name="stock"
                  min="0"
                  value={formData.stock !== undefined ? formData.stock : ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                />
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                Curation Status
              </label>
              <div className="flex gap-4">
                {["Active", "Hidden", "Out of Stock"].map((st) => (
                  <label key={st} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#444748]">
                    <input 
                      type="radio" 
                      name="status"
                      value={st}
                      checked={formData.status === st}
                      onChange={handleChange}
                      disabled={st === "Out of Stock" && formData.stock && formData.stock > 0 ? true : false}
                      className="text-[#775a19] focus:ring-[#775a19]"
                    />
                    <span>{st}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Narrative Description */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                Lookbook Description *
              </label>
              <textarea 
                name="desc"
                value={formData.desc || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Write an poetic architectural narrative about this piece..."
                required
                className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] resize-none"
              />
            </div>

            {/* 4. Specifications: Materials, Origin, Dimensions */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-[#c4c7c7]/20">
              <span className="text-[11px] font-bold tracking-widest text-[#775a19] uppercase block mb-1">
                Spatial Specs
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Materials & Fabric composition
                  </label>
                  <input 
                    type="text" 
                    name="materials"
                    value={formData.materials || ""}
                    onChange={handleChange}
                    placeholder="e.g. Belgian Linen, Salvaged Oak wood"
                    className="w-full bg-[#fbf9f9] border border-[#c4c7c7]/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#775a19]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                    Dimensions (H x W x D)
                  </label>
                  <input 
                    type="text" 
                    name="dimensions"
                    value={formData.dimensions || ""}
                    onChange={handleChange}
                    placeholder="e.g. 80cm H x 95cm W x 85cm D"
                    className="w-full bg-[#fbf9f9] border border-[#c4c7c7]/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#775a19]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                  Origin Workshop
                </label>
                <input 
                  type="text" 
                  name="origin"
                  value={formData.origin || ""}
                  onChange={handleChange}
                  placeholder="e.g. L'Art Décor Bát Tràng Atelier, Saigon"
                  className="w-full bg-[#fbf9f9] border border-[#c4c7c7]/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#775a19]"
                />
              </div>
            </div>

            {/* 5. Finishes Management */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                Finishes/Options
              </label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={finishInput}
                  onChange={(e) => setFinishInput(e.target.value)}
                  placeholder="Add a variant finish name..."
                  className="flex-grow bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#775a19]"
                />
                <button 
                  type="button" 
                  onClick={handleAddFinish}
                  className="bg-[#1b1c1c] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#775a19] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.finishOptions?.map((fn, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#efeded] text-[#1b1c1c] text-xs font-medium rounded-full cursor-default"
                  >
                    {fn}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFinish(idx)}
                      className="text-[#444748] hover:text-red-600 font-bold ml-1 text-[10px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Primary Image (Preset or custom link) */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                Primary Curation Image URL *
              </label>
              <input 
                type="text" 
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                placeholder="Provide a spectacular image URL link..."
                required
                className="w-full bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#775a19] mb-3"
              />

              {/* Presets Grid */}
              <div className="space-y-2 mb-3">
                <span className="block text-[9px] text-[#444748] font-bold uppercase tracking-wider">
                  Preset Curated Luxury Textures:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PRESET_LUXURY_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                      className={`relative rounded-lg overflow-hidden border p-1 bg-white hover:border-[#775a19] transition-all text-left ${formData.image === img.url ? "border-[#775a19] ring-1 ring-[#775a19]" : "border-[#c4c7c7]/30"}`}
                    >
                      <div className="h-10 w-full rounded overflow-hidden">
                        <img referrerPolicy="no-referrer" src={img.url} className="h-full w-full object-cover" alt="Preset texture" />
                      </div>
                      <span className="text-[8px] font-bold tracking-wide block truncate text-center mt-1 text-[#444748]">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Render Image Preview */}
              {formData.image && (
                <div className="flex gap-4 items-center p-3 bg-white border border-[#c4c7c7]/20 rounded-xl">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#efeded] border border-[#c4c7c7]/10">
                    <img referrerPolicy="no-referrer" src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e)=>{(e.target as any).src='https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=120'}}/>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#775a19]">LIVE PREVIEW OK</span>
                    <span className="text-[11px] text-[#444748] font-semibold truncate block max-w-[280px]">Primary Display Image Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Gallery Management */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-[#444748] uppercase mb-1.5">
                Support Gallery Showcase Images ({formData.gallery?.length || 0})
              </label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="Paste an extra image link to append to the lookbook carousel..."
                  className="flex-grow bg-white border border-[#c4c7c7]/60 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#775a19]"
                />
                <button 
                  type="button" 
                  onClick={handleAddGalleryImage}
                  className="bg-[#1b1c1c] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#775a19] transition-colors"
                >
                  Append
                </button>
              </div>

              {formData.gallery && formData.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-[#c4c7c7]/20 rounded-xl">
                  {formData.gallery.map((g, index) => (
                    <div key={index} className="relative group/gal h-16 bg-[#efeded] rounded-lg overflow-hidden border border-[#c4c7c7]/10">
                      <img referrerPolicy="no-referrer" src={g} alt="Gallery item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center text-white"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Action Buttons footer background */}
          <div className="p-6 bg-white border-t border-[#c4c7c7]/20 flex gap-4" id="product-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#c4c7c7] py-3.5 rounded-full text-xs font-bold tracking-[0.2em] text-[#444748] uppercase hover:bg-[#efeded]/50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-grow bg-[#1b1c1c] py-3.5 rounded-full text-xs font-bold tracking-[0.2em] text-white uppercase hover:bg-[#775a19] transition-all"
            >
              {product ? "APPLY CURATION" : "CURATE PIECE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
