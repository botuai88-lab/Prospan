import { ProspanDocument, DocumentType } from "./types";

// Full OCR content from the provided PDF pages
export const SAMPLE_OCR_CONTENT = `
PROSPAN® ĐÁNH GIÁ & PHÂN TÍCH SẢN PHẨM
NỘI DUNG: 01 – Thông tin sản phẩm, 02 – Phân tích thị trường, 03 – Kết luận

01 - THÔNG TIN SẢN PHẨM
PROSPAN® - Thương hiệu nổi tiếng toàn cầu. No. 1 Thuốc ho thảo dược trên thế giới.
> 70 Năm kinh nghiệm. > 102 quốc gia trên thế giới. > 40 triệu lượt dùng mỗi năm.
Sản phẩm DUY NHẤT chứa chiết xuất độc quyền EA 575TM được cấp bằng sáng chế.

DỮ LIỆU LÂM SÀNG PHONG PHÚ:
Hơn 18 nghiên cứu lâm sàng và nghiên cứu không can thiệp được thực hiện.
Hơn 35 ấn phẩm về dữ liệu phi lâm sàng và lâm sàng của Prospan được công bố.
Trên 65.000 bệnh nhân ở mọi lứa tuổi. Thuốc ho thảo dược duy nhất lưu hành tại Việt Nam có NCLS về hiệu quả, an toàn!

TÓM TẮT CÁC NGHIÊN CỨU LÂM SÀNG (NCLS) TIÊU BIỂU:
1. Ho cấp tính (Schaefer 2016): Người lớn (18-75 tuổi), 181 BN. Kết quả: Có hiệu quả chỉ trong vòng 48 giờ.
2. Viêm phế quản cấp (Lang 2015): Trẻ em (6-12 tuổi), 1.066 BN. Kết quả: Sử dụng EA 575TM điều trị viêm phế quản cấp ở trẻ đi học được khuyến cáo.
3. Hen phế quản (Zeil 2014): Trẻ em (6-11 tuổi), 30 BN. Kết quả: Cải thiện rõ rệt chức năng phổi khi dùng bổ sung.
4. Viêm phế quản cấp tính & mãn tính (Fazio 2009): Mọi độ tuổi (0-98), 9.657 BN. Kết quả: Hiệu quả trên mọi đối tượng.
5. Độ dung nạp và an toàn (Kraft 2004, Maidannik 2003): Nghiên cứu trên 52.478 trẻ em (0-12 tuổi). Tỷ lệ xuất hiện tác dụng không mong muốn (TDKMM) chỉ chiếm 0,22% (chủ yếu tiêu hóa do sorbitol).

QUY TRÌNH CHIẾT XUẤT CHUẨN HÓA EA 575®:
Dược liệu lá thường xuân đạt tiêu chuẩn GACP. Đạt tiêu chuẩn EU-GMP.
Quy trình: Lá thường xuân -> Nghiền -> Hấp bột -> Chiết xuất (Ethanol 30%) -> Loại bỏ Ethanol -> Phun sương -> Dịch chiết sấy khô EA 575.
=> Prospan là thuốc phát minh (thuốc gốc) được cấp phép lưu hành trên cơ sở có đầy đủ dữ liệu.

CƠ CHẾ TÁC DỤNG - 4 TÁC ĐỘNG:
1. Tiêu đờm
2. Chống viêm
3. Giảm ho
4. Giãn phế quản (giúp thông thoáng đường thở)
Đặc điểm: Không tương tác thuốc, ít gặp TDKMM, khả năng dung nạp cao, dùng được cho trẻ sơ sinh.

SO SÁNH VỚI THUỐC KHÁC:
1. Với Acetylcystein (ACC):
- Tác dụng long đờm, giảm ho tương đương.
- Prospan cải thiện chức năng phổi (FVC, FEV1) cao hơn rõ rệt so với ACC (Nghiên cứu Bolbot 2004).
- Cải thiện chất lượng cuộc sống và giấc ngủ tốt hơn.

2. Với Ambroxol:
- Hiệu quả giảm ho tương đương.
- Prospan cải thiện các thông số hô hấp tốt hơn nhờ cơ chế giãn phế quản (Nghiên cứu Maidannik 2003).

3. Với Thuốc ho thảo dược khác (Ích nhi, Astex, Bổ phế...):
- Prospan: Có NCLS chứng minh, cơ chế in-vitro cụ thể. Dùng được cho trẻ sơ sinh.
- Khác: Thường chứa đường, cồn, tinh dầu (không dùng cho trẻ sơ sinh), mật ong (không dùng trẻ <1 tuổi).

4. Với Hàng xách tay / Hàng Copy:
- Hàng xách tay (Đức, Úc, Pháp): Giá đắt (220k-240k), không rõ nguồn gốc/bảo quản.
- Hàng Copy (Ivy Syrup, Pectoval, Selituss...): Hàm lượng hoạt chất hoặc công nghệ chiết xuất không đồng nhất (thường dùng ethanol nồng độ khác hoặc có cồn).
- Prospan chính hãng SOHACO: Giá hợp lý (80.000 VNĐ), nhập khẩu nguyên chai, đảm bảo chất lượng.

KẾT LUẬN:
Prospan là thuốc ho thảo dược số 1 thế giới, chứa dịch chiết độc quyền EA 575 (thuốc gốc).
Hiệu quả 4 tác động: Tiêu đờm - Chống viêm - Giảm ho - Giãn phế quản.
An toàn tuyệt đối, đã được chứng minh qua 18 nghiên cứu trên 65.000 bệnh nhân.
`;

export const INITIAL_DOCUMENTS: ProspanDocument[] = [
  {
    id: 'doc_sohaco_analysis',
    fileName: 'SOHACO_Prospan_Product_Analysis.pdf',
    type: DocumentType.MARKETING,
    uploadDate: new Date().toISOString(),
    content: SAMPLE_OCR_CONTENT,
    status: 'ready',
    metadata: {
      title: "Đánh giá & Phân tích Sản phẩm Prospan® (SOHACO)",
      publicationDate: "2024",
      ingredients: ["Cao khô lá thường xuân", "Dịch chiết độc quyền EA 575®"],
      mechanism: "4 tác động: Tiêu đờm, Chống viêm, Giảm ho, Giãn phế quản",
      indications: ["Ho cấp tính", "Viêm phế quản cấp", "Viêm phế quản mãn tính", "Hen phế quản (điều trị bổ sung)"],
      contraindications: ["Không có chống chỉ định đặc biệt (lưu ý thành phần sorbitol gây nhuận tràng nhẹ)"],
      population: "Mọi lứa tuổi: Trẻ sơ sinh, trẻ em, người lớn, người già",
      dosage: "Tham khảo tờ hướng dẫn sử dụng (Syrup/Forte)",
      results: [
        "Giảm ho hiệu quả trong 48 giờ (Schaefer 2016)",
        "Tỷ lệ tác dụng phụ cực thấp 0,22% trên 52.478 trẻ em",
        "Cải thiện chức năng phổi tốt hơn Acetylcystein và Ambroxol",
        "Là thuốc ho thảo dược duy nhất tại VN có NCLS chứng minh hiệu quả & an toàn"
      ],
      source: "SOHACO Group - Đào tạo nội bộ",
      summary: "Tài liệu phân tích toàn diện khẳng định vị thế số 1 của Prospan. Tổng hợp dữ liệu từ 18 nghiên cứu lâm sàng trên 65.000 bệnh nhân. So sánh chi tiết lợi thế của dịch chiết EA 575 (thuốc gốc, 4 tác động, không cồn/đường) so với các thuốc long đờm hóa dược (ACC, Ambroxol) và các sản phẩm thảo dược/xách tay khác."
    }
  }
];