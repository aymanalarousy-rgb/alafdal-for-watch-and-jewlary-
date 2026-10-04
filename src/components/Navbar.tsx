import React from 'react';
import { 
  Search, 
  Crown, 
  Sparkles 
} from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (c: ProductCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'جميع الساعات' },
    { id: 'watches-men', label: 'ساعات رجالية' },
    { id: 'watches-women', label: 'ساعات نسائية' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0F141F] via-[#1A1608] to-[#0F141F] border-b border-[#D4AF37]/15 py-1.5 px-4 text-xs text-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>بوتيك الأفضل للساعات الأصلية | فحص وضمان معتمد 100%</span>
          </div>

          <div className="text-[11px] text-gray-400 hidden sm:block">
            توصيل متوفر لكافة المدن والمناطق في ليبيا (طرابلس، بنغازي، مصراتة وكافة المدن)
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E2536] via-[#121622] to-[#0A0D14] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg group-hover:border-[#D4AF37] transition duration-300">
              <Crown className="w-6 h-6 text-[#D4AF37] transform group-hover:scale-110 transition duration-300" />
              <div className="absolute -inset-0.5 bg-[#D4AF37]/10 rounded-xl blur-sm -z-10 group-hover:bg-[#D4AF37]/20 transition" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold font-['Amiri',serif] tracking-wide gold-text-gradient">
                  الأفضل
                </span>
                <span className="text-xs bg-[#D4AF37]/15 text-[#E5C378] px-1.5 py-0.5 rounded border border-[#D4AF37]/30 font-medium">
                  للساعات الثمينة
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-light tracking-wide">
                الساعات السويسرية والماركات العالمية الفاخرة
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن ساعة (رولكس، كارتييه، أوديمار بيغيه، شوبارد...)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#111726]/80 text-white placeholder-gray-500 pr-10 pl-4 py-2 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Desktop Categories Pills */}
          <div className="hidden lg:flex items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                      : 'bg-[#121724] text-gray-300 hover:text-white hover:bg-[#1A2234] border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن ساعة..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#111726] text-white placeholder-gray-500 pr-10 pl-4 py-2 text-xs rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Subcategory bar on tablet/mobile (No hamburger lines needed) */}
      <div className="lg:hidden border-t border-white/5 bg-[#0A0E17]/80 py-2.5 px-4 flex items-center justify-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-sm'
                  : 'bg-[#121724] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
