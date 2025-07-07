import FooterColumn from "./FooterColumn";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const customerService = [
    { label: t('footer.customer_service.help_center'), link: "#" },
    { label: t('footer.customer_service.blog'), link: "#" },
    { label: t('footer.customer_service.mall'), link: "#" },
    { label: t('footer.customer_service.buying_guide'), link: "#" },
    { label: t('footer.customer_service.selling_guide'), link: "#" },
    { label: t('footer.customer_service.wallet'), link: "#" },
    { label: t('footer.customer_service.coins'), link: "#" },
    { label: t('footer.customer_service.orders'), link: "#" },
    { label: t('footer.customer_service.returns'), link: "#" },
    { label: t('footer.customer_service.contact'), link: "#" },
    { label: t('footer.customer_service.warranty_policy'), link: "#" },
  ];

  const aboutSafeBuy = [
    { label: t('footer.about_safebuy.about'), link: "#" },
    { label: t('footer.about_safebuy.careers'), link: "#" },
    { label: t('footer.about_safebuy.terms'), link: "#" },
    { label: t('footer.about_safebuy.privacy_policy'), link: "#" },
    { label: t('footer.about_safebuy.mall'), link: "#" },
    { label: t('footer.about_safebuy.seller_channel'), link: "#" },
    { label: t('footer.about_safebuy.flash_sale'), link: "#" },
    { label: t('footer.about_safebuy.affiliate'), link: "#" },
    { label: t('footer.about_safebuy.media_contact'), link: "#" },
  ];

  const socialMedia = [
    { label: t('footer.social_media.facebook'), link: "#", icon: "📘" },
    { label: t('footer.social_media.instagram'), link: "#", icon: "📷" },
    { label: t('footer.social_media.linkedin'), link: "#", icon: "🔗" },
  ];

  return (
    <footer className="bg-gray-100 pt-10 pb-6 text-sm text-gray-700 border-t-8 border-primary">
      <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[66%] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <FooterColumn title={t('footer.customer_service.title')} items={customerService} />
        <FooterColumn title={t('footer.about_safebuy.title')} items={aboutSafeBuy} />
        <FooterColumn title={t('footer.social_media.title')} items={socialMedia} />
        <div>
          <h4 className="text-sm font-semibold mb-3 uppercase">
            {t('footer.download_app.title')}
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
        {t('footer.copyright')}
      </div>
    </footer>
  );
};

export default Footer;
