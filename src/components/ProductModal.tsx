import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Package, 
  Layers,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../services/storage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyClick: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyClick,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0D121E] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top bar with close button */}
        <div className="flex items-center justify-between p-4 bg-[#111726] border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
              {product.brand}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-xs text-gray-300">
              {product.category === 'watches-men' ? 'ساعة رجالية' : 'ساعة نسائية'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          
          {/* Images Section */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#070A10] border border-[#D4AF37]/20">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] text-gray-200 border border-white/10">
                {product.condition === 'brand-new' && 'جديد بالعلبة والضمان'}
                {product.condition === 'like-new' && 'بحالة الوكالة'}
                {product.condition === 'collector-grade' && 'قطعة مقتنين نادرة'}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                      activeImageIndex === idx ? 'border-[#D4AF37]' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee */}
            <div className="p-3.5 rounded-xl bg-[#111726] border border-[#D4AF37]/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>أصالة وفحص ميكانيكي معتمد 100%</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                كل ساعة معروضة تخضع لفحص شامل للأجزاء والمحرك والأصالة لضمان الجودة، وتأتي مع شهادة ضمان معتمدة.
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider font-mono">
                {product.brand}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Amiri',serif] mt-1 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price display in LYD */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#141A28] to-[#121622] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">السعر:</span>
                <span className="text-2xl font-extrabold text-white font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through mr-2 font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="text-left">
                <span className="text-xs text-gray-400 block">التوفر:</span>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-400">نفدت الكمية</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400">
                    متوفر ({product.quantity} قطعة)
                  </span>
                )}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                مواصفات الساعة:
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.movement && (
                  <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                    <span className="text-gray-400 block text-[10px]">نوع الحركة / الميكانيك:</span>
                    <span className="text-white font-medium">{product.movement}</span>
                  </div>
                )}

                {product.caseMaterial && (
                  <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                    <span className="text-gray-400 block text-[10px]">المادة والخامة:</span>
                    <span className="text-white font-medium">{product.caseMaterial}</span>
                  </div>
                )}

                {product.dialColor && (
                  <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                    <span className="text-gray-400 block text-[10px]">الميناء:</span>
                    <span className="text-white font-medium">{product.dialColor}</span>
                  </div>
                )}

                {product.year && (
                  <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                    <span className="text-gray-400 block text-[10px]">سنة الصنع:</span>
                    <span className="text-white font-medium">{product.year}</span>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">المرفقات:</span>
                  <span className="text-white font-medium">
                    {product.boxAndPapers ? 'العلبة والشهادة الأصلية' : 'مع علبة فاخرة'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#111726] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">الضمان:</span>
                  <span className="text-emerald-400 font-medium">{product.warrantyYears} سنوات ضمان</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-300">تفاصيل إضافية:</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-[#111726]/60 p-3 rounded-lg border border-white/5 max-h-28 overflow-y-auto">
                {product.description}
              </p>
            </div>

            {/* Delivery note */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#121622] p-2 rounded-lg">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>توصيل لكافة المدن في ليبيا مع المعاينة قبل الدفع عند الاستلام</span>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-3">
              <button
                onClick={() => {
                  onClose();
                  onBuyClick(product);
                }}
                disabled={isOutOfStock}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                  isOutOfStock
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#AA7C11] text-black shadow-[#D4AF37]/25 hover:opacity-95 cursor-pointer transform active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'نفدت الكمية' : 'طلب شراء وتحديد عنوان التوصيل'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
