import React from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export function OurStoryView() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [service, setService] = React.useState("Biển số nhà");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 5000);
    }
  };

  const timeline = [
    {
      year: "2018",
      title: "Bắt đầu từ xưởng gia công nhỏ",
      text: "SignHub khởi đầu với các đơn biển số nhà và bảng phòng ban theo yêu cầu, tập trung vào độ rõ nét và độ bền khi sử dụng ngoài trời.",
    },
    {
      year: "2021",
      title: "Chuẩn hóa quy trình duyệt mẫu",
      text: "Mỗi đơn hàng đều có bản mockup để khách kiểm tra nội dung, bố cục, màu sắc và kích thước trước khi đưa vào sản xuất.",
    },
    {
      year: "2026",
      title: "Kết nối đặt hàng trực tuyến",
      text: "Website SignHub giúp khách xem mẫu, chọn kích thước, thêm vào giỏ hàng và gửi đơn trực tiếp đến hệ thống backend.",
    },
  ];

  return (
    <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
      <main className="max-w-[1440px] mx-auto px-6 md:px-20 animate-fade-in flex flex-col gap-28">
        <section className="text-center max-w-3xl mx-auto">
          <p className="font-sans text-xs font-bold tracking-[0.25em] text-[#775a19] mb-4 uppercase">
            CÂU CHUYỆN SIGNHUB
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1b1c1c] mb-6 leading-tight select-none">
            Làm biển số rõ, đẹp và đúng mẫu
          </h1>
          <p className="font-sans text-sm text-[#444748] max-w-xl mx-auto font-light leading-relaxed text-justify md:text-center">
            Chúng tôi tập trung vào biển số nhà, biển công ty và bảng thông tin theo yêu cầu. Mỗi sản phẩm được tư vấn chất liệu, thiết kế mockup và xác nhận kỹ trước khi sản xuất.
          </p>
        </section>

        <section className="flex flex-col gap-16 relative">
          <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-[#c4c7c7]/30 hidden lg:block" />
          {timeline.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={item.year} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="absolute left-[50%] transform -translate-x-1/2 w-16 h-16 bg-[#fbf9f9] border border-[#775a19] text-[#775a19] rounded-full hidden lg:flex items-center justify-center font-display text-lg font-bold">
                  {item.year}
                </div>
                <div className={`flex flex-col gap-4 max-w-md ${isEven ? "lg:text-right lg:ml-auto lg:pr-16" : "lg:order-2 lg:text-left lg:pl-16"}`}>
                  <span className="font-sans text-xs font-bold tracking-widest text-[#775a19] block lg:hidden uppercase">
                    NĂM {item.year}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-[#1b1c1c]">{item.title}</h3>
                  <p className="font-sans text-sm text-[#444748] font-light leading-relaxed text-justify">{item.text}</p>
                </div>
                <div className={`rounded-[24px] bg-[#efeded] shadow-md border border-[#c4c7c7]/20 p-10 ${isEven ? "lg:pl-16" : "lg:order-1 lg:pr-16"}`}>
                  <div className="aspect-[4/3] rounded-2xl bg-white/70 border border-[#c4c7c7]/30 flex items-center justify-center text-center px-8">
                    <p className="font-display text-3xl text-[#775a19]">{item.year}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-[#c4c7c7]/20 pt-24 bg-[#efeded]/30 rounded-[32px] p-6 lg:p-12">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-[#775a19] block uppercase">
              LIÊN HỆ XƯỞNG
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#1b1c1c] leading-tight">
              Tư vấn mẫu và nhận đơn tại TP. Đà Nẵng
            </h2>
            <p className="font-sans text-sm text-[#444748] leading-relaxed font-light">
              Bạn có thể gửi ảnh vị trí lắp đặt, số nhà hoặc logo công ty để SignHub tư vấn kích thước và chất liệu phù hợp.
            </p>

            <div className="flex flex-col gap-4 mt-4 text-[#1b1c1c] font-sans text-sm font-light">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#775a19] mt-1 flex-shrink-0" size={16} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">ĐỊA CHỈ</h4>
                  <p className="text-xs text-[#444748] mt-1">TP. Đà Nẵng, Việt Nam</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-[#775a19] mt-1 flex-shrink-0" size={16} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">HOTLINE</h4>
                  <p className="text-xs text-[#444748] mt-1">0900 000 000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-[#775a19] mt-1 flex-shrink-0" size={16} />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">EMAIL</h4>
                  <p className="text-xs text-[#444748] mt-1">contact@signhub.vn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#dfdbda] h-[340px] rounded-2xl relative overflow-hidden silk-border flex items-center justify-center shadow-inner">
            <div className="glass px-6 py-4 rounded-xl border border-white/60 text-center">
              <CheckCircle className="text-[#775a19] mx-auto mb-3" size={28} />
              <p className="font-sans text-[10px] tracking-[0.25em] font-extrabold text-[#1b1c1c] uppercase">
                NHẬN THIẾT KẾ MOCKUP TRƯỚC SẢN XUẤT
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto w-full border-t border-[#c4c7c7]/20 pt-16">
          <div className="glass p-8 md:p-16 rounded-[32px] silk-border shadow-xl">
            <div className="text-center mb-10 max-w-md mx-auto">
              <h2 className="font-display text-3xl text-[#1b1c1c] mb-2">
                Gửi yêu cầu tư vấn
              </h2>
              <p className="font-sans text-xs text-[#444748] font-light leading-relaxed">
                Mô tả mẫu biển bạn cần, SignHub sẽ liên hệ để xác nhận nội dung và báo giá.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">HỌ TÊN</label>
                  <input className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" type="text" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">EMAIL</label>
                  <input className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="khachhang@email.com" type="email" required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">NHU CẦU</label>
                <select className="border border-[#c4c7c7] bg-white rounded-full px-5 py-3 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none" value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="Biển số nhà">Biển số nhà</option>
                  <option value="Biển công ty">Biển công ty</option>
                  <option value="Bảng phòng ban">Bảng phòng ban</option>
                  <option value="Thiết kế riêng">Thiết kế riêng</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[10px] tracking-widest font-bold text-[#444748] uppercase">NỘI DUNG</label>
                <textarea rows={4} className="border border-[#c4c7c7] bg-white rounded-2xl p-5 text-sm focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] outline-none font-sans" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ví dụ: tôi cần biển số nhà 25x17.5cm, nền đen, số vàng..." required />
              </div>

              <button type="submit" className="bg-[#1b1c1c] text-white py-4 rounded-full font-sans text-xs tracking-widest uppercase font-bold hover:bg-[#775a19] transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2">
                <Send size={12} />
                GỬI YÊU CẦU
              </button>

              {submitted && (
                <div className="flex items-center justify-center gap-2 mt-2 text-green-700 animate-pulse font-sans text-xs font-bold uppercase tracking-wider">
                  <CheckCircle size={14} />
                  Đã gửi yêu cầu. SignHub sẽ liên hệ sớm.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
