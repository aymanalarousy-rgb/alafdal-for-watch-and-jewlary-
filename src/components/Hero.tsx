import React from 'react';
import { ShieldCheck, Truck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#090D15] via-[#0E131F] to-[#080B10] py-10 md:py-14 border-b border-[#D4AF37]/15">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1E293B]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-semibold text-[#E5C378]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ساعات سويسرية وعالمية أصلية 100% في ليبيا</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-['Amiri',serif] leading-tight tracking-normal text-white">
              بوتيك <span className="gold-text-gradient">الأفضل</span> للساعات
              <br />
              <span className="text-gray-200">الرجالية والنسائية الفاخرة</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-light">
              وجهتكم الأولى في ليبيا لاقتناء أرقى الساعات السويسرية والماركات العالمية (رولكس، باتيك فيليب، كارتييه، أوديمار بيغيه، شوبارد). جميع الساعات مفحوصة بدقة مع شهادات الضمان، مع خدمة التوصيل المباشر حتى باب منزلك في كافة المدن الليبية.
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#111726]/80 rounded-xl border border-[#D4AF37]/20 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">أصالة معتمدة 100%</h4>
                  <p className="text-[10px] text-gray-400">فحص وضمان شامل</p>
                </div>
              </div>

              <div className="p-3 bg-[#111726]/80 rounded-xl border border-[#D4AF37]/20 flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">توصيل لكافة مدن ليبيا</h4>
                  <p className="text-[10px] text-gray-400">طرابلس، بنغازي، مصراتة...</p>
                </div>
              </div>

              <div className="p-3 bg-[#111726]/80 rounded-xl border border-[#D4AF37]/20 col-span-2 sm:col-span-1 flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">معاينة قبل الاستلام</h4>
                  <p className="text-[10px] text-gray-400">تأكيد ومتابعة مستمرة</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#DFBD4F] to-[#AA7C11] text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/25 hover:opacity-95 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                تصفح تشكيلة الساعات المتاحة الآن
              </button>
            </div>
          </div>

          {/* Luxury Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md rounded-2xl p-1 bg-gradient-to-b from-[#D4AF37]/40 via-white/10 to-[#D4AF37]/10 shadow-2xl">
              <div className="relative rounded-[15px] overflow-hidden bg-[#0F1422]">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
                  alt="Luxury Watches"
                  className="w-full h-72 sm:h-88 object-cover transform hover:scale-105 transition duration-700"
                />
                
                {/* Floating luxury details tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10] via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5">
                  <div className="bg-[#0B0F19]/90 backdrop-blur-md p-3 rounded-xl border border-[#D4AF37]/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        ساعات أصلية فاخرة
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        جاهزة للشحن الفوري
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white">
                      تشكيلة رولكس، باتيك فيليب، كارتييه، شوبارد
                    </p>
                    <p className="text-[10px] text-gray-300">
                      الدفع عند الاستلام مع إمكانية المعاينة عبر مندوب التوصيل
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
