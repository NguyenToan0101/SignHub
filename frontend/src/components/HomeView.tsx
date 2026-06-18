/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PRODUCTS, JOURNAL_POSTS, TESTIMONIALS, Product } from "../data";
import { api, mapApiBlog, mapApiProduct } from "../api";
import { formatVnd } from "../format";
import { ArrowRight, Quote } from "lucide-react";

interface HomeViewProps {
  onExplore: () => void;
  onSelectProduct: (id: string) => void;
  onSelectJournal: (id: string) => void;
}

export function HomeView({ onExplore, onSelectProduct, onSelectJournal }: HomeViewProps) {
  const [bestSellers, setBestSellers] = React.useState<Product[]>(PRODUCTS);
  const [posts, setPosts] = React.useState(JOURNAL_POSTS);

  React.useEffect(() => {
    api.getProducts("?sort=newest&page=0&size=8")
      .then((page) => setBestSellers(page.content.map(mapApiProduct)))
      .catch(() => {});
    api.getBlogs()
      .then((items) => setPosts(items.map(mapApiBlog)))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-[#fbf9f9]">
      
      {/* Editorial Hero Background Section */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover select-none filter brightness-90 animate-fade-in transition-transform duration-10000 hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTQzXKF4808vTQwtHa7Y7EXh1Mh2U_hjY-J9vzb_nBnElQ9wuqd32hjtsxskWkEYK4dfpWgcBYl1YvaKUST--2jaf2rJjHT3k931XMh3l0_NsS2eoyEAnDHPebP6dPFa2YRBzOPRyOX1MqUG51mHVA1VOcuZQOEMrM3_28qtFo-cTRyJCrIK6RUCMQu4cN5o18pQwhNB64tjpMf1ZB-Sqt-JW85dBB-NJ8Ns9DBP31zBaUo_drb_ir-5f4zwgahXbh4t7kXsuUk4iq"
            alt="Không gian trưng bày biển số cao cấp"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#1b1c1c]/15" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <span className="font-sans text-xs font-bold tracking-[0.4em] mb-4 block uppercase opacity-90">
            THIẾT KẾ VÀ GIA CÔNG THEO YÊU CẦU
          </span>
          <h2 className="font-display text-5xl md:text-8xl mb-8 leading-tight tracking-tight italic select-none">
            SignHub
          </h2>
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-[#775a19] text-white font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-[#775a19]/90 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              XEM MẪU BIỂN SỐ
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 md:left-20 max-w-xs hidden sm:block">
          <p className="font-display text-sm italic text-white/80 line-clamp-3 leading-relaxed">
            Biển số nhà, biển công ty và bảng hiệu được thiết kế gọn, rõ, bền và đúng tinh thần không gian của bạn.
          </p>
        </div>
      </section>

      {/* Glassmorphic Archived Categories Grid */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto bg-[#fbf9f9]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#775a19] mb-2 block uppercase">
              DANH MỤC NỔI BẬT
            </span>
            <h3 className="font-display text-3xl md:text-5xl text-[#1b1c1c]">
              Bộ sưu tập biển số
            </h3>
          </div>
          <button 
            onClick={onExplore}
            className="font-sans text-xs tracking-widest text-[#444748] border-b border-[#444748]/30 pb-1 hover:text-[#1b1c1c] hover:border-[#1b1c1c] transition-colors"
          >
            XEM TẤT CẢ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[600px]">
          {/* Large Left Feature Card */}
          <div className="md:col-span-7 relative group overflow-hidden rounded-[24px] silk-border cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col justify-end min-h-[300px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwC7iq-oIM3VKkP5N_8qX0qYZcGL77eFBfj0EOpJqieRDnbTBtQWdjZXhPa4x1rPyXFROp1I56GF-6bsKI_1Aj8iWl-Ga4ncbxfk6SQxj2R-EFUWVoXlh6unACZTO3AqZecNi5H8UtHifgteC9ehfO2shbHkkyjkVQIV7-hJ_Sbcf7496hJdDOnEbrJSKAh0WdCyZDqX6X4cL3LP8GzxYIHWYAPw0GlmGqxzxaIPcw5XFdR43mac4VbBdx219GJ62-1yKp1GiW6QNk"
              alt="Biển số nhà thiết kế riêng"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="relative z-10 p-6 md:p-10 text-white max-w-md m-4 md:m-6 glass rounded-2xl">
              <h4 className="font-display text-2xl md:text-3xl mb-2">Biển số nhà cao cấp</h4>
              <p className="font-sans text-xs text-white/95 leading-relaxed">
                Thiết kế tối giản, dễ nhìn, phù hợp nhà phố, căn hộ và mặt tiền hiện đại.
              </p>
            </div>
          </div>

          {/* Vertical Pair Card Grid on Right */}
          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            
            {/* Sleep Sanctuary Card */}
            <div 
              onClick={onExplore}
              className="relative group overflow-hidden rounded-[24px] silk-border cursor-pointer flex items-center justify-center min-h-[160px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp2lAtnh_yT27_8T6yJKxVko9-nD7AsFAEoArg2httHtT_w2zQuk65S88yK3fgT9AL_okjkEGtePjejrClgKPezmHi7ANeBK7DV8x4ySYi7fOeFT4ou70OJ8KObgBYD9nGzaF0sx41xsyqbDZZUOB4QP46HEsQTkTZ4UewrHf7w5FaWenmr-aqQdzpgVBfC04DbeNRbWyrjYqsw3KriZZYxviPWsFQXJcpnh7T4lk6_KJ6GC9kn3_hNZ937kx3GL6FNEXaxGkbICqW"
                alt="Biển số nhà"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="font-sans text-xs tracking-widest text-white border border-white/40 px-6 py-2.5 rounded-full bg-black/20 backdrop-blur-sm uppercase font-semibold">
                  BIỂN SỐ NHÀ
                </span>
              </div>
            </div>

            {/* Objet d'Art Ceramic shelf */}
            <div 
              onClick={onExplore}
              className="relative group overflow-hidden rounded-[24px] silk-border cursor-pointer flex items-center justify-center min-h-[160px]"
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFzbIGSODo5FwMj4pgR2xnHC7IUkexckGVUscG7lXSu3OV7hvjLRoZx4WTg1hzHEZPB6Rwmeliui-zIyN3Q_0-rzqBkP5QDGtL3An7UF7eepHFyloBsrsoF2NlLmMVm7tut1fuXxyO2zARFVsWANjxB_r28m5onuGhZlInpR6xTzqSlmQKvryIeShFoh9rfr1tWOufxFCEnNhN7UZtDDuSDd4r_Z-gJR3Z3LJj2ntaIby2tNYW-B4cKJB3enTttCrizm-pzoXLDT6v"
                alt="Biển công ty"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="font-sans text-xs tracking-widest text-white border border-white/40 px-6 py-2.5 rounded-full bg-black/20 backdrop-blur-sm uppercase font-semibold">
                  BIỂN CÔNG TY
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Best Sellers Horizontal Slider */}
      <section className="py-24 bg-[#efeded]/60 overflow-hidden relative border-t border-[#c4c7c7]/20">
        <div className="px-6 md:px-20 max-w-[1440px] mx-auto mb-12">
          <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#775a19] mb-2 block uppercase">
            SẢN PHẨM BÁN CHẠY
          </span>
          <h3 className="font-display text-3xl md:text-5xl text-[#1b1c1c]">
            Mẫu được khách chọn nhiều
          </h3>
        </div>

        {/* Horizontal Container scroll */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-12 px-6 md:px-20 max-w-[1440px] mx-auto">
          {bestSellers.map((product) => (
            <div 
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className="min-w-[280px] sm:min-w-[340px] max-w-[340px] group cursor-pointer bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#c4c7c7]/30 flex flex-col justify-between"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#fbf9f9] relative">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 bg-white flex flex-col gap-2">
                <span className="font-sans text-[10px] tracking-widest text-[#775a19] uppercase font-bold">
                  {product.categoryName || product.category}
                </span>
                <h5 className="font-display text-xl text-[#1b1c1c]">
                  {product.name}
                </h5>
                <p className="font-sans text-sm text-[#444748] font-semibold">
                  {formatVnd(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-32 px-6 md:px-20 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-48 h-48 border border-[#c4c7c7]/30 rounded-[24px] z-0 hidden md:block" />
            <img 
              className="relative z-10 w-full rounded-[24px] shadow-2xl saturate-100 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoYZ2Lpm3FgbjBbZzn2z7s7nGWbO9BKD_Mg_7XeXWsy6OoNi-cJQ6coLp3A6Dg4YF5QKo-wEb2-Ob3fuOJit65-I5yNeeJj9DCuRbUu4usOYFguVyP91gvpnbQK2UBvdNe2eSC-T66fwUMdsE3ALREkYuBRc5BDyi8RtPbctBX4D-fe4tFoiSdWU-QfelB1u9eIMvaDVg0f5YIjCD8NDBE7s7zwwtSJRS0zXYVBju-J7uqUVgPRz0QP4xU6HwIQWqtxHY0tURBEjql"
              alt="Xưởng gia công biển số"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#775a19] mb-4 block uppercase">
              XƯỞNG CỦA CHÚNG TÔI
            </span>
            <h3 className="font-display text-4xl md:text-5xl text-[#1b1c1c] mb-8 leading-tight">
              Làm biển số rõ nét, <br />
              <span className="italic">đúng mẫu bạn duyệt.</span>
            </h3>
            <p className="font-sans text-base text-[#444748] mb-12 max-w-lg leading-relaxed font-light">
              SignHub nhận thiết kế và gia công biển số nhà, biển công ty, bảng phòng ban theo kích thước, màu sắc và chất liệu riêng. Trước khi sản xuất, khách hàng được duyệt mockup để đảm bảo đúng nội dung và thẩm mỹ.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-[#c4c7c7]/30 pt-12">
              <div>
                <h4 className="font-display text-3xl md:text-4xl text-[#1b1c1c]">15+</h4>
                <p className="font-sans text-[10px] tracking-widest text-[#444748] mt-2 font-bold uppercase">
                  NĂM KINH NGHIỆM
                </p>
              </div>
              <div>
                <h4 className="font-display text-3xl md:text-4xl text-[#1b1c1c]">200+</h4>
                <p className="font-sans text-[10px] tracking-widest text-[#444748] mt-2 font-bold uppercase">
                  ĐƠN HÀNG HOÀN THÀNH
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refined Perspectives Testimonials section */}
      <section className="py-24 bg-[#e9e8e7]/50 relative border-y border-[#c4c7c7]/30">
        <div className="px-6 md:px-20 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#775a19] mb-2 block uppercase">
              KHÁCH HÀNG NÓI GÌ
            </span>
            <h3 className="font-display text-3xl md:text-5xl text-[#1b1c1c]">
              Phản hồi thực tế
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="glass p-8 md:p-10 rounded-[24px] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  <Quote className="text-[#775a19] mb-6 opacity-40" size={32} />
                  <p className="font-sans text-base italic text-[#1b1c1c] mb-8 leading-relaxed">
                    {t.text}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs font-bold tracking-wider text-[#1b1c1c]">
                    {t.author}
                  </p>
                  <p className="font-sans text-xs text-[#444748] mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Journal Posts */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h3 className="font-display text-3xl md:text-5xl text-[#1b1c1c]">
            Góc tư vấn
          </h3>
          <button 
            onClick={() => onSelectJournal("silent-rhythm-stone-light")}
            className="font-sans text-xs font-bold tracking-widest text-[#1b1c1c] border border-[#1b1c1c] px-8 py-3.5 rounded-full hover:bg-[#1b1c1c] hover:text-white transition-all hover:scale-105"
          >
            ĐỌC BÀI VIẾT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.slice(0, 2).map((post) => (
            <article 
              key={post.id}
              onClick={() => onSelectJournal(post.id)}
              className="group cursor-pointer flex flex-col gap-6"
            >
              <div className="overflow-hidden rounded-[24px] aspect-video border border-[#c4c7c7]/20 relative bg-[#efeded]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-sans text-[10px] tracking-widest text-[#775a19]/90 font-bold block mb-2 uppercase">
                  {post.publishedAt} — {post.category}
                </span>
                <h4 className="font-display text-2xl group-hover:text-[#775a19] transition-colors duration-300">
                  {post.title}
                </h4>
                <p className="font-sans text-xs text-[#444748] mt-2 line-clamp-2">
                  {post.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-28 bg-[#1b1c1c] text-white text-center rounded-[24px] mx-6 mb-12 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[#775a19]/5 mix-blend-color-dodge pointer-events-none" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <h2 className="font-display text-4xl md:text-6xl mb-6 tracking-tight">
            Bắt đầu làm biển số riêng
          </h2>
          <p className="font-sans text-sm md:text-base text-white/70 mb-10 max-w-lg mx-auto leading-relaxed">
            Chọn mẫu có sẵn hoặc gửi yêu cầu riêng để SignHub tư vấn chất liệu, kích thước và bản thiết kế phù hợp.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-[#775a19] text-white font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-[#775a19]/90 hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              NHẬN TƯ VẤN
            </button>
            <button 
              onClick={onExplore}
              className="px-8 py-4 border border-white/20 text-white font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-white hover:text-[#1b1c1c] hover:scale-105 transition-all active:scale-95 text-glow"
            >
              XEM BỘ SƯU TẬP
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
