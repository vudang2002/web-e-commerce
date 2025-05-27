import FooterColumn from "./FooterColumn";

const Footer = () => {
  const customerService = [
    { label: "Trung Tâm Trợ Giúp Shopee", link: "#" },
    { label: "Shopee Blog", link: "#" },
    { label: "Shopee Mall", link: "#" },
    { label: "Hướng Dẫn Mua Hàng/Đặt Hàng", link: "#" },
    { label: "Hướng Dẫn Bán Hàng", link: "#" },
    { label: "Ví ShopeePay", link: "#" },
    { label: "Shopee Xu", link: "#" },
    { label: "Đơn Hàng", link: "#" },
    { label: "Trả Hàng/Hoàn Tiền", link: "#" },
    { label: "Liên Hệ Shopee", link: "#" },
    { label: "Chính Sách Bảo Hành", link: "#" },
  ];

  const aboutShopee = [
    { label: "Về Shopee", link: "#" },
    { label: "Tuyển Dụng", link: "#" },
    { label: "Điều Khoản Shopee", link: "#" },
    { label: "Chính Sách Bảo Mật", link: "#" },
    { label: "Shopee Mall", link: "#" },
    { label: "Kênh Người Bán", link: "#" },
    { label: "Flash Sale", link: "#" },
    { label: "Tiếp Thị Liên Kết", link: "#" },
    { label: "Liên Hệ Truyền Thông", link: "#" },
  ];

  const socialMedia = [
    { label: "Facebook", link: "#", icon: "📘" },
    { label: "Instagram", link: "#", icon: "📷" },
    { label: "LinkedIn", link: "#", icon: "🔗" },
  ];

  return (
    <footer className="bg-gray-100 pt-10 pb-6 text-sm text-gray-700 border-t-8 border-primary">
      <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[66%] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <FooterColumn title="Dịch Vụ Khách Hàng" items={customerService} />
        <FooterColumn title="Shopee Việt Nam" items={aboutShopee} />
        <FooterColumn title="Theo Dõi Shopee" items={socialMedia} />
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase">
            Tải Ứng Dụng Shopee
          </h4>
          <img src="/images/qr.png" alt="QR" className="w-20 mb-2" />
          <div className="flex gap-2">
            <img src="/images/appstore.png" alt="App Store" className="w-20" />
            <img
              src="/images/googleplay.png"
              alt="Google Play"
              className="w-20"
            />
          </div>
        </div>
      </div>

      <div className="text-center mt-8 pt-4 border-t text-xs text-gray-500">
        © 2025 Shopee. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
