import React from "react";
import { JOURNAL_POSTS, JournalPost } from "../data";
import { api, mapApiBlog } from "../api";
import { ArrowRight, BookOpen, Send } from "lucide-react";

interface EditorialViewProps {
  selectedPostId: string | null;
  onSelectPost: (id: string | null) => void;
}

export function EditorialView({ selectedPostId, onSelectPost }: EditorialViewProps) {
  const [posts, setPosts] = React.useState<JournalPost[]>(JOURNAL_POSTS);
  const [newsEmail, setNewsEmail] = React.useState("");
  const [newsComplete, setNewsComplete] = React.useState(false);

  React.useEffect(() => {
    api.getBlogs()
      .then((items) => setPosts(items.map(mapApiBlog)))
      .catch(() => {});
  }, []);

  const activePost = posts.find((post) => post.id === selectedPostId);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail) {
      setNewsComplete(true);
      setTimeout(() => setNewsComplete(false), 5000);
      setNewsEmail("");
    }
  };

  if (activePost) {
    return (
      <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-6 animate-fade-in flex flex-col gap-10">
          <button
            onClick={() => onSelectPost(null)}
            className="w-max font-sans text-xs tracking-widest text-[#444748] hover:text-[#1b1c1c] border-b border-[#444748]/30 pb-1 flex items-center gap-2 uppercase font-bold"
          >
            ← Quay lại danh sách bài viết
          </button>

          <header className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-4">
            <span className="font-sans text-[10px] tracking-[0.25em] text-[#775a19] uppercase font-bold">
              BÀI TƯ VẤN / {activePost.category}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1b1c1c] leading-tight select-none">
              {activePost.title}
            </h1>
            <p className="font-sans text-xs tracking-widest text-[#444748] uppercase">
              ĐĂNG NGÀY {activePost.publishedAt || "HÔM NAY"} BỞI SIGNHUB
            </p>
          </header>

          <div className="aspect-video w-full overflow-hidden rounded-[24px] bg-[#efeded] shadow-md border border-[#c4c7c7]/20 select-none">
            <img className="w-full h-full object-cover" src={activePost.image} alt={activePost.title} referrerPolicy="no-referrer" />
          </div>

          <div className="font-sans text-base text-[#444748] leading-relaxed flex flex-col gap-6 text-justify">
            <p className="font-display text-2xl text-[#1b1c1c] leading-relaxed italic border-l-4 border-[#775a19] pl-6 pt-2 pb-2">
              {activePost.summary}
            </p>
            <p>{activePost.content}</p>
            <p>
              Khi đặt biển số nhà hoặc biển công ty, bạn nên chuẩn bị kích thước mong muốn, ảnh vị trí lắp đặt và màu nền tường. SignHub sẽ dựa trên các thông tin đó để gợi ý chất liệu, bố cục và bản mockup trước khi sản xuất.
            </p>
          </div>

          <footer className="border-t border-[#c4c7c7]/20 pt-10 mt-6 text-center">
            <button
              onClick={() => onSelectPost(null)}
              className="px-8 py-4 border border-[#1b1c1c] text-[#1b1c1c] font-sans text-xs tracking-widest uppercase font-bold rounded-full hover:bg-[#1b1c1c] hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              Xem các bài viết khác
            </button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fbf9f9] pt-32 pb-24">
      <main className="max-w-[1440px] mx-auto px-6 md:px-20 animate-fade-in">
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <p className="font-sans text-xs font-bold tracking-[0.25em] text-[#775a19] mb-4 uppercase">
            GÓC TƯ VẤN
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1b1c1c] mb-6 leading-tight">
            Kinh nghiệm chọn biển số
          </h1>
          <p className="font-sans text-sm text-[#444748] max-w-lg mx-auto font-light leading-relaxed">
            Các bài viết ngắn giúp bạn chọn kích thước, chất liệu, màu sắc và cách lắp đặt phù hợp.
          </p>
        </section>

        {posts[0] && (
          <section
            onClick={() => onSelectPost(posts[0].id)}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-24 border-b border-[#c4c7c7]/20 pb-16"
          >
            <div className="lg:col-span-7 overflow-hidden rounded-[24px] aspect-video w-full bg-[#efeded] border border-[#c4c7c7]/20 relative">
              <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="font-sans text-[10px] tracking-widest text-[#775a19] font-bold uppercase">
                {posts[0].publishedAt} - BÀI VIẾT NỔI BẬT
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-[#1b1c1c] leading-tight group-hover:text-[#775a19] transition-colors duration-300">
                {posts[0].title}
              </h2>
              <p className="font-sans text-sm text-[#444748] font-light leading-relaxed text-justify">
                {posts[0].summary}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#1b1c1c] uppercase pt-2">
                <span>Đọc bài viết</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
          {posts.slice(1).map((post) => (
            <article key={post.id} onClick={() => onSelectPost(post.id)} className="group cursor-pointer flex flex-col gap-6">
              <div className="aspect-video overflow-hidden rounded-xl bg-[#efeded] border border-[#c4c7c7]/20 relative">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={post.image} alt={post.title} referrerPolicy="no-referrer" />
              </div>
              <div>
                <span className="font-sans text-[9px] tracking-widest text-[#775a19]/90 font-bold block mb-2 uppercase">
                  {post.publishedAt} - {post.category}
                </span>
                <h3 className="font-display text-xl leading-normal text-[#1b1c1c] group-hover:text-[#775a19] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="font-sans text-xs text-[#444748] font-light mt-2 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-32 glass rounded-[32px] p-8 md:p-16 text-center silk-border shadow-xl max-w-4xl mx-auto relative overflow-hidden">
          <BookOpen className="text-[#775a19] mx-auto mb-6 opacity-30" size={32} />
          <h2 className="font-display text-3xl md:text-4xl text-[#1b1c1c] mb-4">
            Nhận tư vấn qua email
          </h2>
          <p className="font-sans text-sm text-[#444748] font-light max-w-md mx-auto mb-10 leading-relaxed">
            Để lại email, SignHub sẽ gửi gợi ý mẫu biển số và chương trình ưu đãi mới.
          </p>

          <form onSubmit={handleNewsSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto justify-center">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-white border border-[#c4c7c7] focus:border-[#775a19] rounded-full px-6 py-3 text-sm flex-1 outline-none font-sans"
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-[#1b1c1c] hover:bg-[#775a19] text-white px-8 py-3.5 rounded-full font-sans text-xs tracking-widest uppercase font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <Send size={12} />
              Gửi
            </button>
          </form>

          {newsComplete && (
            <p className="text-xs text-[#775a19] mt-4 font-sans animate-pulse font-bold tracking-widest uppercase">
              Đăng ký thành công.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
