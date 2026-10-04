import React from 'react';
import { 
  ShoppingBag, 
  Eye, 
  ShieldCheck, 
  Package, 
  Clock
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../services/storage';

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyClick,
  onViewDetails,
}) => {
  const isOutOfStock = product.quantity <= 0;
  const isSingleItem = product.quantity === 1;

  const conditionLabels: Record<Product['condition'], { text: string; bg: string }> = {
    'brand-new': { text: 'جديد بالعلبة والضمان', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
    'like-new': { text: 'بحالة الوكالة (كالجديد)', bg: 'bg-blue-950/80 text-blue-300 border-blue-800' },
    'collector-grade': { text: 'ساعة نادرة للمقتنين', bg: 'bg-amber-950/80 text-[#E5C378] border-[#D4AF37]/50' },
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#0E131F] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10">
      
      {/* Top Badges */}
      <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Condition Badge */}
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${conditionLabels[product.condition].bg}`}>
          {conditionLabels[product.condition].text}
        </span>

        {/* Stock status badge */}
        {isOutOfStock ? (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 border border-red-800">
            نفدت الكمية
          </span>
        ) : isSingleItem ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#D4AF37] border border-[#D4AF37] animate-pulse">
            قطعة واحدة فقط
          </span>
        ) : (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-gray-300 border border-white/10">
            المتوفر: {product.quantity}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0A0D15] cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-transparent to-transparent opacity-80" />

        {/* Quick View overlay button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black text-gray-200 text-xs flex items-center gap-1.5 border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>المواصفات</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 space-y-3">
        {/* Brand & Year */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#D4AF37] tracking-wider uppercase font-mono">
            {product.brand}
          </span>
          <span className="text-[11px] text-gray-400">
            {product.category === 'watches-men' ? 'رجالية' : 'نسائية'}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-xs sm:text-sm font-bold text-white hover:text-[#D4AF37] transition cursor-pointer line-clamp-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Key Specification snippet */}
        <div className="text-[11px] text-gray-400 line-clamp-1 bg-[#131929]/70 px-2.5 py-1 rounded-lg border border-white/5">
          {product.caseMaterial || product.movement || product.description}
        </div>

        {/* Guarantee and Box Papers icons */}
        <div className="flex items-center gap-3 text-[11px] text-gray-300">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            ضمان {product.warrantyYears} سنوات
          </span>
          {product.boxAndPapers && (
            <span className="flex items-center gap-1 text-gray-400">
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
              العلبة والأوراق الأصلية
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-gray-400">السعر:</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={() => onBuyClick(product)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isOutOfStock
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C378] hover:to-[#C9A227] text-black shadow-[#D4AF37]/20 hover:scale-102 cursor-pointer active:scale-98'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'نفدت' : 'طلب شراء'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
