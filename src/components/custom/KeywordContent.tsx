import { CURRENT_YEAR } from "@/lib/constants";

export default function KeywordContent() {
  return (
    <article className="w-full bg-muted/30 border-t border-border/50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            📅 Lịch Vạn Niên {CURRENT_YEAR} - Tra Cứu Âm Dương Lịch Chính Xác & Hiện Đại
          </h2>
          <p className="text-sm text-muted-foreground">
            ⚡ Giao diện đẹp • 🎯 Chính xác 100% • ✨ Tốc độ nhanh • 🆓 Không quảng cáo spam
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-semibold text-foreground/90 text-base">
              🌟 Website Lịch Vạn Niên Hiện Đại Nhất
            </h3>
            <p className="text-muted-foreground">
              <strong>Lịch Vạn Niên Việt Nam</strong> là website tra cứu lịch âm dương được phát triển 
              bằng công nghệ web hiện đại nhất. Với giao diện <strong>đẹp mắt, tốc độ siêu nhanh</strong> 
              và quan trọng nhất là <strong>không có quảng cáo spam</strong> làm phiền, 
              bạn có thể tra cứu thông tin một cách thoải mái nhất.
            </p>
            <p className="text-muted-foreground">
              Xem lịch hôm nay, tra cứu ngày tốt xấu, giờ hoàng đạo và can chi với 
              <strong> độ chính xác 100%</strong>. Tất cả thông tin được tính toán theo 
              phương pháp truyền thống kết hợp công nghệ hiện đại.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground/90 text-base">
              ⚡ Tra Cứu Nhanh Chóng & Chính Xác
            </h3>
            <p className="text-muted-foreground">
              Bạn muốn biết <strong>"hôm nay là ngày âm lịch bao nhiêu"</strong> hay 
              <strong> "hôm nay ngày tốt hay xấu"</strong>? Lịch Vạn Niên cung cấp kết quả 
              <strong> ngay lập tức</strong> với độ chính xác tuyệt đối. Xem ngày hoàng đạo, 
              giờ hoàng đạo hôm nay, can chi ngày tháng năm một cách dễ dàng.
            </p>
            <p className="text-muted-foreground">
              Tra cứu lịch theo tháng {CURRENT_YEAR}, xem lịch âm từ tháng giêng đến tháng chạp. 
              Thông tin thiên can địa chi, ngũ hành được tính toán chính xác theo 
              <strong> phương pháp âm lịch truyền thống Việt Nam</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground/90 text-base">
              Ngày Lễ Tết Việt Nam
            </h3>
            <p className="text-muted-foreground">
              Tra cứu đầy đủ các ngày lễ tết truyền thống như tết âm lịch {CURRENT_YEAR}, 
              tết dương lịch, rằm tháng giêng, mùng 1 tết, rằm tháng 7, và tết Trung thu. 
              Hệ thống tự động đánh dấu và hiển thị rõ ràng các ngày lễ quan trọng để bạn 
              dễ dàng theo dõi.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-foreground/90 text-base">
              Xem Ngày Tốt Cho Các Việc Quan Trọng
            </h3>
            <p className="text-muted-foreground">
              Lịch vạn sự tích hợp giúp bạn chọn ngày tốt để khai trương, cưới hỏi, động thổ, 
              xuất hành hay các việc quan trọng khác. Thông tin về tuổi âm lịch, ngày tốt xấu 
              được hiển thị chi tiết để bạn tham khảo.
            </p>
          </section>
        </div>

        <footer className="mt-6 pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground/60 text-center">
            Lịch Vạn Niên Việt Nam - Website tra cứu lịch âm dương hiện đại, chính xác 100%, 
            không quảng cáo spam. Được hàng triệu người Việt sử dụng mỗi ngày.
          </p>
        </footer>
      </div>
    </article>
  );
}
