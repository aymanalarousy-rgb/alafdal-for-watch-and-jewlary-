import React from 'react';
import { Crown, ShieldCheck, Truck, Clock, Award, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070B] border-t border-[#D4AF37]/20 pt-10 pb-8 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 border-b border-white/5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">ضمان الأصالة 100%</h4>
              <p className="text-[11px] text-gray-400">
                جميع الساعات مفحوصة ومطابقة لأعلى معايير دور الساعات السويسرية والعالمية.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">توصيل لكافة المدن في ليبيا</h4>
              <p className="text-[11px] text-gray-400">
                شحن مؤمن وسريع لطرابلس، بنغازي، مصراتة والزاوية وكافة المناطق.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">شهادات فحص وعلب أصلية</h4>
              <p className="text-[11px] text-gray-400">
                تأتي الساعات مرفقة بعلبها وبطاقات الضمان الرسمية والسيريال نمبر.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">معاينة قبل الاستلام</h4>
              <p className="text-[11px] text-gray-400">
                الدفع عند الاستلام مع إمكانية فحص الساعة مع مندوب التوصيل.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Categories Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#141A28] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold font-['Amiri',serif] gold-text-gradient">
                  بوتيك الأفضل للساعات الثمينة
                </span>
                <p className="text-[11px] text-gray-400">ليبيا - طرابلس، بنغازي وكافة المدن</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
              المتجر الإلكتروني المتخصص في تقديم الساعات السويسرية والماركات العالمية الفاخرة للرجال والنساء في ليبيا. نحرص على تقديم أفضل تجربة اقتناء تليق بذوقكم.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>خدمة التوصيل تغطي كامل المدن والمناطق الليبية</span>
            </div>
          </div>

          <div className="md:col-span-4 text-left md:text-left space-y-1 text-xs">
            <h4 className="font-bold text-white text-xs mb-2">أقسام المتجر</h4>
            <p className="text-gray-400">ساعات رجالية فاخرة</p>
            <p className="text-gray-400">ساعات نسائية راقية</p>
            <p className="text-[#D4AF37] font-semibold mt-2">عملة المتجر: الدينار الليبي (د.ل)</p>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} بوتيك الأفضل للساعات الثمينة. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3">
            <span>توصيل معتمد</span>
            <span>•</span>
            <span>أصالة 100%</span>
            <span>•</span>
            <span>الدفع عند الاستلام</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
