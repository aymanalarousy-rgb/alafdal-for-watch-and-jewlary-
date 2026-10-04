import React, { useState, useEffect } from 'react';
import { Filter, Sparkles } from 'lucide-react';
import { Product, Order, ProductCategory } from './types';
import { getStoredProducts, getStoredOrders } from './services/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & URL detection for /admin or #admin
  const checkIsAdminUrl = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' || 
      path.endsWith('/admin') || 
      path.endsWith('/admin/') || 
      hash === '#admin' || 
      hash === '#/admin'
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminUrl());

  // Global Store States
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  // Listen to browser URL changes (when user types /admin in address bar)
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminRoute(checkIsAdminUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync products from storage
  const syncStoreData = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    syncStoreData();

    const handleProductsUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('alafdal_products_updated', handleProductsUpdate);

    return () => {
      window.removeEventListener('alafdal_products_updated', handleProductsUpdate);
    };
  }, []);

  // Return to storefront
  const closeAdminPortal = () => {
    if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
      window.location.hash = '';
    } else {
      window.history.pushState({}, '', '/');
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products by category (all, watches-men, watches-women) and search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleOrderCreated = (_order: Order) => {
    // Order saved to storage
  };

  // If URL contains /admin, render the private Admin Portal
  if (isAdminRoute) {
    return (
      <AdminPortal
        onClose={closeAdminPortal}
        onViewProductInStore={(productId) => {
          closeAdminPortal();
          const target = products.find(p => p.id === productId);
          if (target) {
            setDetailsProduct(target);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-[#E5E7EB] flex flex-col font-['Cairo',sans-serif]">
      
      {/* Main Navigation - Pure storefront, no admin buttons or emails */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const gridEl = document.getElementById('catalog-section');
          if (gridEl) {
            gridEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Presentation */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Catalog & Products Showcase */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Amiri',serif] text-white">
                تشكيلة الساعات الفاخرة (ليبيا)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              ساعات أصلية 100% مع ضمان رسمي، تسليم فوري مع مندوب التوصيل في كافة المدن الليبية.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-400">
              عدد الساعات المعروضة: <strong className="text-[#D4AF37] font-mono">{filteredProducts.length}</strong>
            </span>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10 cursor-pointer"
              >
                عرض كل الساعات
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#0D121E] rounded-2xl border border-[#D4AF37]/20 p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold font-['Amiri',serif] text-white">
              جاري تجهيز وتصوير التشكيلة الحصرية الجديدة
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              يقوم فريق بوتيك الأفضل حالياً بإعداد وفحص وتصوير أحدث الساعات السويسرية والماركات العالمية الفاخرة لعرضها في المتجر قريباً.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#0D121E] rounded-2xl border border-white/5 space-y-3">
            <Filter className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-gray-300">لم يتم العثور على ساعات تطابق بحثك</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              جرب البحث بكلمات أخرى أو اختر قسماً آخر.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              عرض كافة الساعات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={(p) => setBuyingProduct(p)}
                onViewDetails={(p) => setDetailsProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Customer Purchase / Order Modal */}
      {buyingProduct && (
        <CheckoutModal
          product={buyingProduct}
          onClose={() => setBuyingProduct(null)}
          onOrderCreated={handleOrderCreated}
        />
      )}

      {/* Full Technical Specifications Modal */}
      {detailsProduct && (
        <ProductModal
          product={detailsProduct}
          onClose={() => setDetailsProduct(null)}
          onBuyClick={(p) => setBuyingProduct(p)}
        />
      )}

      {/* Clean Footer - no admin links, no exposed emails */}
      <Footer />

    </div>
  );
}
