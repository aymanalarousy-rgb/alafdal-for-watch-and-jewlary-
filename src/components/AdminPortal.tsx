import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Package, 
  ShoppingBag, 
  Upload, 
  Trash2, 
  Edit3, 
  Eye, 
  Printer, 
  Phone, 
  MessageSquare, 
  Truck, 
  CheckCircle2, 
  Save, 
  LogOut, 
  Sparkles, 
  FileText,
  ArrowRight,
  Mail,
  RefreshCw,
  ExternalLink,
  Shield,
  HelpCircle,
  MapPin,
  Clock
} from 'lucide-react';
import { Product, Order, ProductCategory, ProductCondition } from '../types';
import { 
  AUTHORIZED_ADMIN_EMAIL,
  getStoredProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getStoredOrders, 
  updateOrderStatus, 
  checkAdminSession, 
  loginAdminSecure,
  sendEmailOTPToOwner,
  logoutAdmin, 
  LIBYAN_COURIERS,
  saveProducts,
  formatPrice,
  checkLockoutStatus
} from '../services/storage';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { WaybillModal } from './WaybillModal';

interface AdminPortalProps {
  onClose: () => void;
  onViewProductInStore: (productId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, onViewProductInStore }) => {
  // Authentication states (NO PASSWORD NEEDED - STRICTLY EMAIL + OTP)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAdminSession());
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'add-product' | 'inventory' | 'help'>('orders');

  // Products & Orders state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderForWaybill, setSelectedOrderForWaybill] = useState<Order | null>(null);

  // Filter / Search in admin
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchOrders, setSearchOrders] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Add / Edit Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Rolex');
  const [formCategory, setFormCategory] = useState<ProductCategory>('watches-men');
  const [formPrice, setFormPrice] = useState<number | ''>(55000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>('');
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formCondition, setFormCondition] = useState<ProductCondition>('like-new');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formMovement, setFormMovement] = useState('أوتوماتيك سويسري معتمد');
  const [formCaseMaterial, setFormCaseMaterial] = useState('فولاذ أويستر ستيل 904L مع ذهب');
  const [formDialColor, setFormDialColor] = useState('أسود كلاسيكي');
  const [formYear, setFormYear] = useState('2024');
  const [formBoxAndPapers, setFormBoxAndPapers] = useState(true);
  const [formWarrantyYears, setFormWarrantyYears] = useState(5);
  const [formDescription, setFormDescription] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load data
  const refreshData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshData();
    const handleProductsUpdate = () => setProducts(getStoredProducts());
    const handleOrdersUpdate = () => setOrders(getStoredOrders());

    window.addEventListener('alafdal_products_updated', handleProductsUpdate);
    window.addEventListener('alafdal_orders_updated', handleOrdersUpdate);

    return () => {
      window.removeEventListener('alafdal_products_updated', handleProductsUpdate);
      window.removeEventListener('alafdal_orders_updated', handleOrdersUpdate);
    };
  }, []);

  // Timer countdown for OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Request Security Code (OTP) sent directly to owner's email
  const handleRequestOTP = async () => {
    setAuthError('');
    if (!authEmail.trim()) {
      setAuthError('يرجى كتابة البريد الإلكتروني للمالك أولاً ليتم إرسال رمز الأمان إليه.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendEmailOTPToOwner(authEmail);
      if (!res.success) {
        setAuthError(res.error || 'فشل إرسال رمز الأمان');
        setIsSendingOtp(false);
        return;
      }

      setOtpSent(true);
      setOtpCountdown(60);
      setAuthOtp('');
    } catch {
      setAuthError('تعذر إرسال الرمز حالياً، يرجى التأكد من اتصال الإنترنت.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Secure Passwordless Login
  const handleSecureLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim()) {
      setAuthError('يرجى إدخال البريد الإلكتروني للمالك.');
      return;
    }
    if (!authOtp.trim()) {
      setAuthError('يرجى إدخال رمز التحقق الأمني الذي وصلك عبر البريد الإلكتروني.');
      return;
    }

    const res = loginAdminSecure({
      email: authEmail,
      otpCode: authOtp,
      remember: rememberMe,
    });

    if (res.success) {
      setIsAuthenticated(true);
      refreshData();
    } else {
      setAuthError(res.error || 'فشل التحقق من الهوية');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setAuthOtp('');
    setOtpSent(false);
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير، يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormImages((prev) => [base64String, ...prev.filter(img => img !== base64String)]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save or Update Product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage('');

    if (!formName.trim()) {
      alert('يرجى كتابة اسم الساعة');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      alert('يرجى إدخال سعر صحيح بالدينار الليبي');
      return;
    }
    if (formImages.length === 0) {
      alert('يرجى إضافة صورة واحدة على الأقل');
      return;
    }

    const productPayload = {
      name: formName.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      quantity: Number(formQuantity),
      condition: formCondition,
      images: formImages,
      movement: formMovement.trim(),
      caseMaterial: formCaseMaterial.trim(),
      dialColor: formDialColor.trim(),
      year: formYear.trim(),
      boxAndPapers: formBoxAndPapers,
      warrantyYears: Number(formWarrantyYears),
      description: formDescription.trim() || `${formBrand} - ${formName} ساعة فاخرة بحالة ممتازة جاهزة للتسليم.`,
      featured: true,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
      setFormSuccessMessage('تم تحديث بيانات الساعة بنجاح وتحديث المتجر!');
      setEditingProductId(null);
    } else {
      addProduct(productPayload);
      setFormSuccessMessage('تم إضافة الساعة بنجاح وعرضها فوراً في المتجر للزبائن!');
    }

    refreshData();

    // Reset Form
    setFormName('');
    setFormPrice(50000);
    setFormOriginalPrice('');
    setFormQuantity(1);
    setFormDescription('');

    setTimeout(() => {
      setFormSuccessMessage('');
    }, 4000);
  };

  // Edit Product
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || '');
    setFormQuantity(p.quantity);
    setFormCondition(p.condition);
    setFormImages(p.images);
    setFormMovement(p.movement || '');
    setFormCaseMaterial(p.caseMaterial || '');
    setFormDialColor(p.dialColor || '');
    setFormYear(p.year || '');
    setFormBoxAndPapers(p.boxAndPapers);
    setFormWarrantyYears(p.warrantyYears);
    setFormDescription(p.description);
    setActiveTab('add-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickQuantityChange = (productId: string, delta: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const newQty = Math.max(0, p.quantity + delta);
    updateProduct(productId, { quantity: newQty });
    refreshData();
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف "${name}" نهائياً من المتجر؟`)) {
      deleteProduct(productId);
      refreshData();
    }
  };

  const handleClearAllProducts = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف جميع الساعات الافتراضية للبدء بساعاتك الخاصة؟')) {
      saveProducts([]);
      refreshData();
    }
  };

  const handleRestoreSampleProducts = () => {
    if (confirm('هل ترغب في استعادة الساعات التجريبية كأمثلة في المتجر؟')) {
      saveProducts(INITIAL_PRODUCTS);
      refreshData();
    }
  };

  // Orders Management
  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], courier?: string, tracking?: string) => {
    updateOrderStatus(orderId, status, courier, tracking);
    refreshData();
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = 
      o.customerName.toLowerCase().includes(searchOrders.toLowerCase()) ||
      o.customerPhone.includes(searchOrders) ||
      o.customerCity.toLowerCase().includes(searchOrders.toLowerCase()) ||
      o.id.toLowerCase().includes(searchOrders.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchOrders.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const totalStockCount = products.reduce((acc, p) => acc + p.quantity, 0);
  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const shippingOrdersCount = orders.filter(o => o.status === 'shipping').length;
  const lockoutStatus = checkLockoutStatus();

  return (
    <div className="min-h-screen bg-[#070A10] text-[#E5E7EB] font-['Cairo',sans-serif]">
      
      {/* Waybill Modal */}
      {selectedOrderForWaybill && (
        <WaybillModal
          order={selectedOrderForWaybill}
          onClose={() => setSelectedOrderForWaybill(null)}
        />
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#141A28] hover:bg-[#1D253A] text-gray-300 hover:text-white flex items-center gap-1.5 text-xs border border-white/10 cursor-pointer"
              title="العودة لواجهة المتجر"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمتجر</span>
            </button>

            <div className="h-4 w-px bg-white/20" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-white font-['Amiri',serif]">
                  لوحة تحكم إدارة متجر الساعات
                </h1>
                <p className="text-[10px] text-gray-400">
                  دخول آمن برمز التحقق عبر الإيميل
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-800 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                دخول آمن بالبريد فقط
              </span>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {!isAuthenticated ? (
          /* PASSWORDLESS EMAIL-OTP AUTHENTICATION GATE SCREEN */
          <div className="max-w-md mx-auto my-8 bg-[#0E131F] border border-[#D4AF37]/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E2538] to-[#0A0D15] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-xl">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold font-['Amiri',serif] text-white">
                دخول لوحة الإدارة عبر رمز الإيميل
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                لا حاجة لحفظ كلمة مرور! يتم إرسال رمز أمان سري مكون من 6 أرقام مباشرة إلى بريدك الإلكتروني لتسجيل الدخول بأمان وسرعة.
              </p>
            </div>

            {lockoutStatus.isLocked && (
              <div className="p-3 rounded-xl bg-red-950/90 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <Shield className="w-5 h-5 shrink-0 text-red-400" />
                <span>
                  تم قفل تسجيل الدخول مؤقتاً لحماية المتجر. يرجى الانتظار {lockoutStatus.remainingMinutes} دقيقة.
                </span>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSecureLogin} className="space-y-4">
              
              {/* Step 1: Owner Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-300">
                    البريد الإلكتروني المعتمد للمالك <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthEmail(AUTHORIZED_ADMIN_EMAIL)}
                    className="text-[10px] text-[#D4AF37] hover:underline"
                  >
                    تعبئة بريدي تلقائياً
                  </button>
                </div>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="aymanalarousy@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#111726] text-white placeholder-gray-600 pr-9 pl-3 py-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none font-mono text-left"
                  />
                </div>
              </div>

              {/* Step 2: Request & Enter OTP Code */}
              <div className="p-3.5 bg-[#111724] rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#E5C378]">
                    رمز التحقق السري (OTP)
                  </label>
                  <button
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={otpCountdown > 0 || isSendingOtp}
                    className="text-xs bg-[#D4AF37] hover:bg-[#E5C378] text-black font-bold px-3 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>
                      {isSendingOtp 
                        ? 'جاري الإرسال...' 
                        : otpCountdown > 0 
                          ? `إعادة الإرسال بعد (${otpCountdown}ث)` 
                          : 'إرسال الرمز لبريدي'}
                    </span>
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    maxLength={6}
                    placeholder="أدخل الرمز (6 أرقام من بريدك)"
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value)}
                    className="w-full bg-[#161F33] text-white placeholder-gray-500 py-2.5 px-3 text-center text-base font-mono tracking-widest rounded-lg border-2 border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {otpSent && (
                  <div className="p-3 bg-emerald-950/70 rounded-xl border border-emerald-800 text-[11px] text-emerald-200 space-y-2">
                    <p className="flex items-center gap-1.5 font-bold text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>تم إرسال رمز الأمان بنجاح إلى بريدك الإلكتروني!</span>
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                      وصلت رسالة إلى <span className="font-mono text-emerald-300 font-bold">{AUTHORIZED_ADMIN_EMAIL}</span> تتضمن كود الدخول. يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) وكتابة الرمز في الخانة أعلاه.
                    </p>
                    <div className="pt-0.5">
                      <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/70 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold border border-emerald-600 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-300" />
                        <span>فتح بريد Gmail للتحقق من الرسالة</span>
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#111726] border-[#D4AF37]/30 text-[#D4AF37] focus:ring-0"
                  />
                  <span>حفظ الجلسة الآمنة على جهازي</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={lockoutStatus.isLocked}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#AA7C11] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/25 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل الدخول إلى لوحة المالك</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                ← العودة لمتجر الساعات
              </button>
            </div>

          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="space-y-6">
            
            {/* KPI STATS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div 
                onClick={() => setActiveTab('orders')}
                className="p-4 rounded-xl bg-[#0E131F] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition cursor-pointer flex items-center justify-between shadow-lg"
              >
                <div>
                  <span className="text-xs text-gray-400 block font-bold">طلبات الشراء الواردة</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#D4AF37]">{orders.length} طلب</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5 font-bold">
                    {newOrdersCount} طلب بانتظار التوصيل
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('inventory')}
                className="p-4 rounded-xl bg-[#0E131F] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs text-gray-400 block">الساعات المعروضة</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white">{products.length} ساعات</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">المخزون: {totalStockCount} قطعة</span>
                </div>
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E131F] border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">شحنات مع المندوب</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-blue-400">{shippingOrdersCount} شحنة</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">في طريقها للزبائن</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0E131F] border border-[#D4AF37]/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">إجمالي قيمة الساعات</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-white">
                    {totalInventoryValue.toLocaleString('en-US')} د.ل
                  </span>
                  <span className="text-[11px] text-[#D4AF37] block mt-0.5">دينار ليبي</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-[#E5C378] border border-amber-500/20">
                  <span className="font-bold text-xs">د.ل</span>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('orders')}
                className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#111726] text-gray-300 hover:text-white hover:bg-[#182136] border border-white/5'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>طلبات الشراء والزبائن</span>
                {newOrdersCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                    {newOrdersCount} جديد
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('add-product')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'add-product'
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#111726] text-gray-300 hover:text-white hover:bg-[#182136] border border-white/5'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingProductId ? 'تعديل بيانات الساعة' : 'إدخال ساعة جديدة'}</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#111726] text-gray-300 hover:text-white hover:bg-[#182136] border border-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>المخزون الحالي ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'help'
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#111726] text-gray-300 hover:text-white hover:bg-[#182136] border border-white/5'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>دليل إدارة الطلبات والشحن</span>
              </button>
            </div>

            {/* TAB: INCOMING ORDERS (WHERE THE USER FINDS ALL CUSTOMER PURCHASES) */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Banner Explaining Where Orders Go */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#141A28] to-[#121622] border border-[#D4AF37]/30 flex items-start gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shrink-0 mt-0.5">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">
                      أين تجد بيانات طلبات الشراء؟
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-xs">
                      عندما يقوم أي زبون بالضغط على زر الشراء وإدخال اسمه ورقمه ومدينته:
                      <br />
                      <strong>1. تظهر بياناته فوراً هنا في هذه القائمة</strong> (الاسم، رقم الهاتف، المدينة، العنوان بالتفصيل، الساعة المطلوبة، والقيمة الإجمالية).
                      <br />
                      <strong>2. تصلك رسالة تنبيه فورية على بريدك الإلكتروني</strong> ({AUTHORIZED_ADMIN_EMAIL}) بتفاصيل الطلب.
                      <br />
                      <strong>3. يمكنك بضغطة زر</strong> التواصل مع الزبون عبر الواتساب أو الاتصال به، أو طباعة بوليصة التوصيل وتسليمها للمندوب.
                    </p>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-[#0E131F] p-4 rounded-xl border border-[#D4AF37]/25 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400">تصفية الطلبات:</span>
                    {[
                      { id: 'all', label: 'الكل' },
                      { id: 'new', label: 'جديد (بانتظار التوصيل)' },
                      { id: 'confirmed', label: 'قيد التجهيز والتغليف' },
                      { id: 'shipping', label: 'مع شركة التوصيل' },
                      { id: 'delivered', label: 'تم التسليم بنجاح' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderStatusFilter(tab.id)}
                        className={`text-xs px-3 py-1 rounded-lg border transition cursor-pointer ${
                          orderStatusFilter === tab.id
                            ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                            : 'bg-[#141A28] text-gray-300 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="ابحث بالاسم، المدينة، الهاتف، رقم الطلب..."
                    value={searchOrders}
                    onChange={(e) => setSearchOrders(e.target.value)}
                    className="bg-[#111726] text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none w-full sm:w-64"
                  />
                </div>

                {/* Orders Cards */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-[#0E131F] rounded-2xl border border-white/5 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                    <h3 className="text-sm font-bold text-gray-300">لا توجد طلبات في هذا القسم حالياً</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      بمجرد أن يضغط أي زبون في المتجر على زر الشراء، ستظهر بياناته في هذه الصفحة فوراً مع إشعار إلى بريدك.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#0E131F] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 transition space-y-4 shadow-lg"
                      >
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-[#D4AF37]">
                              رقم الطلب: #{order.id}
                            </span>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full border bg-emerald-950 text-emerald-300 border-emerald-800 font-bold">
                              {order.status === 'new' && 'طلب جديد يحتاج تجهيز'}
                              {order.status === 'confirmed' && 'قيد التجهيز والتغليف'}
                              {order.status === 'shipping' && 'مع شركة التوصيل'}
                              {order.status === 'delivered' && 'تم التسليم واستلام المبلغ'}
                              {order.status === 'cancelled' && 'ملغي'}
                            </span>
                          </div>

                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleString('ar-LY')}
                          </span>
                        </div>

                        {/* Customer & Product Information */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                          
                          {/* Customer Coordinates */}
                          <div className="md:col-span-4 p-3.5 rounded-xl bg-[#121726] border border-white/5 space-y-1.5">
                            <span className="text-[11px] font-bold text-[#D4AF37] block">
                              بيانات الزبون وعنوان التوصيل:
                            </span>
                            <div className="font-bold text-white text-sm">{order.customerName}</div>
                            <div className="text-emerald-400 font-mono text-xs font-bold dir-ltr text-right">
                              {order.customerPhone}
                            </div>
                            <div className="text-gray-200 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              <span><strong>المدينة:</strong> {order.customerCity}</span>
                            </div>
                            <div className="text-gray-300">
                              <strong>العنوان:</strong> {order.customerAddress}
                            </div>
                            {order.notes && (
                              <div className="text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-800/40 mt-1">
                                ملاحظة الزبون: {order.notes}
                              </div>
                            )}
                          </div>

                          {/* Product Item */}
                          <div className="md:col-span-4 p-3.5 rounded-xl bg-[#121726] border border-white/5 flex gap-3">
                            {order.productImage && (
                              <img
                                src={order.productImage}
                                alt=""
                                className="w-16 h-16 rounded-lg object-cover border border-[#D4AF37]/30 shrink-0"
                              />
                            )}
                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] text-[#D4AF37] font-bold uppercase font-mono">{order.productBrand}</span>
                              <h4 className="font-bold text-white truncate text-xs">{order.productName}</h4>
                              <div className="text-gray-400">الكمية: {order.quantity} قطعة</div>
                              <div className="text-sm font-bold text-[#E5C378] font-mono">
                                المبلغ المطلوب: {order.totalAmount.toLocaleString('en-US')} د.ل
                              </div>
                            </div>
                          </div>

                          {/* Courier Dispatch */}
                          <div className="md:col-span-4 p-3.5 rounded-xl bg-[#121726] border border-white/5 space-y-2">
                            <span className="text-[11px] font-bold text-[#D4AF37] block">شركة التوصيل / المندوب:</span>
                            
                            <select
                              value={order.courierCompany || ''}
                              onChange={(e) => handleUpdateOrderStatus(order.id, order.status, e.target.value)}
                              className="w-full bg-[#182136] text-white p-1.5 text-xs rounded border border-white/10"
                            >
                              {LIBYAN_COURIERS.map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="text-[11px] text-gray-400">حالة الشحنة:</span>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className="flex-1 bg-[#1A253E] text-[#D4AF37] font-bold p-1 text-xs rounded border border-[#D4AF37]/30"
                              >
                                <option value="new">طلب جديد</option>
                                <option value="confirmed">قيد التجهيز</option>
                                <option value="shipping">مع المندوب للتوصيل</option>
                                <option value="delivered">تم التسليم بنجاح</option>
                                <option value="cancelled">ملغي</option>
                              </select>
                            </div>
                          </div>

                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                          <div className="flex flex-wrap items-center gap-2">
                            
                            {/* PRINT WAYBILL FOR COURIER */}
                            <button
                              onClick={() => setSelectedOrderForWaybill(order)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C378] text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة بوليصة التوصيل للمندوب</span>
                            </button>

                            {/* WhatsApp Customer */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً أستاذ ${order.customerName}، معك متجر الأفضل للساعات الثمينة بخصوص طلبك رقم (${order.id}) لساعة: ${order.productName}. نود تأكيد موعد التوصيل معك.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>واتساب الزبون</span>
                            </a>

                            {/* Phone Call */}
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>اتصال هاتفي</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB: ADD PRODUCT FORM */}
            {activeTab === 'add-product' && (
              <div className="bg-[#0E131F] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-7 shadow-xl">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-['Amiri',serif] text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                      <span>{editingProductId ? 'تعديل بيانات الساعة' : 'إدخال ساعة جديدة وعرضها في المتجر'}</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      أدخل كمية الساعة، صورتها، مواصفاتها وسعرها بالدينار الليبي لتظهر فوراً في المتجر للزبائن.
                    </p>
                  </div>

                  {editingProductId && (
                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setFormName('');
                        setFormPrice(50000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>

                {formSuccessMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-pulse">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span>{formSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleProductSubmit} className="space-y-5">
                  
                  {/* Row 1: Title & Brand */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        اسم الساعة والموديل <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: رولكس دايتونا 40 مم - ذهب أصفر عيار 18 قيراط"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-[#111726] text-white placeholder-gray-500 p-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        الماركة <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rolex, Patek Philippe, Cartier..."
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        className="w-full bg-[#111726] text-white placeholder-gray-500 p-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category, Price, Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        القسم (رجالية / نسائية) <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="watches-men">ساعات رجالية</option>
                        <option value="watches-women">ساعات نسائية</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        السعر بالدينار الليبي (د.ل) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="50000"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        السعر السابق قبل التخفيض (اختياري)
                      </label>
                      <input
                        type="number"
                        placeholder="55000"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                        الكمية المتاحة بالمخزون <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formQuantity}
                        onChange={(e) => setFormQuantity(Number(e.target.value))}
                        className="w-full bg-[#161F33] text-white p-2.5 text-xs sm:text-sm rounded-lg border-2 border-[#D4AF37] focus:outline-none font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="p-4 rounded-xl bg-[#121827] border border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>صور الساعة (رفع صورة من جهازك أو وضع رابط)</span>
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {formImages.length} صور
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-3 rounded-lg bg-[#1B2338] hover:bg-[#25304C] text-[#E5C378] border border-[#D4AF37]/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                        >
                          <Upload className="w-4 h-4" />
                          <span>رفع صورة من جهازك</span>
                        </button>
                      </div>

                      <div className="sm:col-span-7 flex gap-2">
                        <input
                          type="url"
                          placeholder="أو الصق رابط صورة خارجية..."
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="flex-1 bg-[#111726] text-white placeholder-gray-500 px-3 py-2 text-xs rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/40 cursor-pointer"
                        >
                          إضافة
                        </button>
                      </div>
                    </div>

                    {/* Previews */}
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-black">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[#D4AF37] text-[8px] px-1 rounded font-bold">
                              الرئيسية
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 left-1 p-1 bg-red-900/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition, Material, Movement */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        الحالة
                      </label>
                      <select
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value as ProductCondition)}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="brand-new">جديد بالعلبة والضمان</option>
                        <option value="like-new">بحالة الوكالة (كالجديد)</option>
                        <option value="collector-grade">ساعة نادرة للمقتنين</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        المادة وخامة الهيكل
                      </label>
                      <input
                        type="text"
                        placeholder="ذهب 18K / بلاتين / ستيل 904L"
                        value={formCaseMaterial}
                        onChange={(e) => setFormCaseMaterial(e.target.value)}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        نوع المحرك والحركة
                      </label>
                      <input
                        type="text"
                        placeholder="أوتوماتيك سويسري معتمد"
                        value={formMovement}
                        onChange={(e) => setFormMovement(e.target.value)}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Year, Box & Papers, Warranty */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        سنة الصنع / الموديل
                      </label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        سنوات الضمان
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formWarrantyYears}
                        onChange={(e) => setFormWarrantyYears(Number(e.target.value))}
                        className="w-full bg-[#111726] text-white p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                        <input
                          type="checkbox"
                          checked={formBoxAndPapers}
                          onChange={(e) => setFormBoxAndPapers(e.target.checked)}
                          className="rounded bg-[#111726] border-[#D4AF37]/40 text-[#D4AF37]"
                        />
                        <span>متوفر العلبة والشهادة الأصلية</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      الوصف ومميزات الساعة
                    </label>
                    <textarea
                      rows={3}
                      placeholder="اكتب تفاصيل إضافية عن الساعة وحالتها الدقيقة..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-[#111726] text-white placeholder-gray-500 p-2.5 text-xs sm:text-sm rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#AA7C11] text-black font-bold text-sm shadow-xl shadow-[#D4AF37]/20 hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProductId ? 'حفظ التعديلات وعرضها في المتجر' : 'نشر الساعة وعرضها في المتجر فوراً'}</span>
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* TAB: INVENTORY */}
            {activeTab === 'inventory' && (
              <div className="bg-[#0E131F] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#D4AF37]" />
                      <span>قائمة الساعات الحالية بالمخزون</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      يمكنك زيادة أو إنقاص كمية أي ساعة فوراً، أو حذف الساعات الافتراضية والبدء بساعاتك الخاصة.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleClearAllProducts}
                      className="px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="حذف جميع الساعات الافتراضية للبدء بإضافة ساعاتك الشخصية فقط"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف كل الساعات الافتراضية</span>
                    </button>

                    <button
                      onClick={handleRestoreSampleProducts}
                      className="px-3 py-1.5 rounded-lg bg-[#141A28] hover:bg-[#1D253A] text-gray-300 border border-white/10 text-xs transition cursor-pointer"
                      title="استعادة الساعات كأمثلة"
                    >
                      <span>استعادة الساعات كأمثلة</span>
                    </button>

                    <input
                      type="text"
                      placeholder="ابحث بالاسم أو الماركة..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-[#111726] text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none w-48"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#121827] text-gray-400 border-b border-white/10">
                      <tr>
                        <th className="p-3">الصورة</th>
                        <th className="p-3">الساعة والموديل</th>
                        <th className="p-3">القسم</th>
                        <th className="p-3">السعر (د.ل)</th>
                        <th className="p-3 text-center">الكمية بالمخزون</th>
                        <th className="p-3 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products
                        .filter(p => 
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.brand.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-[#131A2B] transition">
                            <td className="p-3">
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/30"
                              />
                            </td>
                            <td className="p-3 font-bold text-white max-w-xs truncate">
                              {product.name}
                            </td>
                            <td className="p-3">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                {product.category === 'watches-men' ? 'رجالية' : 'نسائية'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-white font-bold">
                              {formatPrice(product.price)}
                            </td>
                            
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleQuickQuantityChange(product.id, -1)}
                                  disabled={product.quantity <= 0}
                                  className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                                  title="إنقاص الكمية"
                                >
                                  -
                                </button>
                                <span className={`font-mono font-bold text-sm px-2 ${
                                  product.quantity === 0 ? 'text-red-400' : 'text-emerald-400'
                                }`}>
                                  {product.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuickQuantityChange(product.id, 1)}
                                  className="w-6 h-6 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-sm cursor-pointer"
                                  title="زيادة الكمية"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => startEditProduct(product)}
                                  className="p-1.5 rounded bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800 cursor-pointer"
                                  title="تعديل التفاصيل"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onViewProductInStore(product.id)}
                                  className="p-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 cursor-pointer"
                                  title="معاينة في المتجر"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-1.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 cursor-pointer"
                                  title="حذف الساعة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB: HELP & ORDER DISPATCH GUIDE */}
            {activeTab === 'help' && (
              <div className="max-w-2xl bg-[#0E131F] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
                  <span>دليل استلام الطلبات والتوصيل لزبائن ليبيا</span>
                </h3>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="p-3 rounded-xl bg-[#111726] border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-white text-sm">1. أين أجد بيانات الزبون؟</h4>
                    <p className="leading-relaxed text-gray-300">
                      بمجرد أن يضغط الزبون على طلب شراء ساعة، يتم حفظ طلبه وتجد بياناته في تبويب <strong>«طلبات الشراء والزبائن»</strong>. يظهر اسمه الكامل، رقم هاتفه، مدينته (طرابلس، بنغازي، مصراتة...)، وعنوانه التفصيلي، والمبلغ الإجمالي بالدينار الليبي.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-white text-sm">2. إشعار البريد الإلكتروني:</h4>
                    <p className="leading-relaxed text-gray-300">
                      يقوم المتجر تلقائياً بإرسال رسالة تنبيه إلى بريدك ({AUTHORIZED_ADMIN_EMAIL}) بعنوان الطلب وتفاصيل الزبون لكي تكون على علم بكل طلب حتى وأنت خارج لوحة التحكم.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-white/5 space-y-1.5">
                    <h4 className="font-bold text-white text-sm">3. نقل الساعة للزبون عبر شركة التوصيل:</h4>
                    <p className="leading-relaxed text-gray-300">
                      اضغط على زر <strong>«طباعة بوليصة التوصيل للمندوب»</strong> الموجود أمام كل طلب، وسيطبع لك بوليصة رسمية فيها عنوان الزبون والمبلغ المطلوب تحصيله. قم بتسليم البوليصة مع علبة الساعة لشركة التوصيل أو المندوب.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
};
