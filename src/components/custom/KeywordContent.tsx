import { CURRENT_YEAR } from "@/lib/constants";

export default function KeywordContent() {
  return (
    <section className="hidden md:block text-xs text-gray-600 font-extralight mt-6 leading-relaxed">
      <h2 className="font-medium text-sm mb-2">
        Tra cứu lịch âm dương Việt Nam {CURRENT_YEAR}
      </h2>

      <p>
        Website cung cấp công cụ tra cứu lịch vạn niên Việt Nam, giúp bạn xem
        lịch âm dương, lịch âm, lịch dương và thông tin can chi theo từng ngày
        trong năm {CURRENT_YEAR}. Người dùng có thể xem lịch hôm nay, kiểm tra
        ngày tốt xấu, giờ hoàng đạo và các sự kiện quan trọng trong năm.
      </p>

      <p>
        Ngoài ra, bạn có thể tra cứu lịch âm dương online, xem lịch âm dương
        chính xác, kiểm tra hôm nay là ngày bao nhiêu, ngày tốt hay xấu, cũng
        như tra cứu thiên can địa chi, ngũ hành và tuổi âm lịch. Nhiều người
        dùng tìm kiếm với các từ khóa như lịch pat, lịch 1501, xem lịch pat hoặc
        xem lịch online.
      </p>

      <p>
        Hệ thống hỗ trợ tra cứu lịch theo năm và theo tháng, bao gồm lịch năm{" "}
        {CURRENT_YEAR}, lịch âm {CURRENT_YEAR}, lịch dương {CURRENT_YEAR}, lịch
        âm dương {CURRENT_YEAR}, lịch tháng 1 đến tháng 12 {CURRENT_YEAR} và
        lịch âm theo từng tháng trong năm.
      </p>

      <p>
        Bên cạnh đó, website còn cung cấp thông tin về các ngày lễ và sự kiện
        truyền thống như tết âm lịch, tết dương lịch, rằm, mùng 1, rằm tháng
        giêng {CURRENT_YEAR}, mùng 1 tết {CURRENT_YEAR} và nhiều ngày lễ quan
        trọng khác của Việt Nam.
      </p>
    </section>
  );
}
