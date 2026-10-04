import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Copy, 
  AlertCircle
} from 'lucide-react';
import { Product, Order } from '../types';
import { 
  createOrder, 
  formatPrice, 
  getStoreSettings 
} from '../services/storage';

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  onClose,
  onOrderCreated,
}) => {
  if (!product) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const storeSettings = getStoreSettings();

  // Libyan Cities
  const libyanCities = [
    'طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'البيضاء', 
    'طبرق', 'سبها', 'زليتن', 'الخمس', 'سرت', 'غريان', 'درنة', 'إجدابيا'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('يرجى كتابة الاسم الكريم');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      setErrorMessage('يرجى إدخال رقم هاتف ليبي صحيح (مثال: 0912345678) لتأكيد التوصيل');
      return;
    }
    if (!customerCity.trim()) {
      setErrorMessage('يرجى كتابة أو اختيار المدينة في ليبيا');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMessage('يرجى توضيح المنطقة والحي لتوصيل الطلب من قبل المندوب');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = createOrder({
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
        notes,
        product,
        quantity,
      });

      setSubmittedOrder(newOrder);
      onOrderCreated(newOrder);
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const copyOrderId = () => {
    if (!submittedOrder) return;
    navigator.clipboard.writeText(submittedOrder.id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0D121D] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#141A28] to-[#0A0D15] border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Amiri',serif]">
                {submittedOrder ? 'تم تأكيد طلبك بنجاح' : 'طلب شراء وتحديد عنوان التوصيل في ليبيا'}
              </h2>
              <p className="text-xs text-gray-400">
                {submittedOrder ? 'تم استلام بياناتك وجاري تجهيز الساعة' : 'بوتيك الأفضل للساعات الثمينة'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {submittedOrder ? (
            /* SUCCESS VIEW */
            <div className="space-y-6 text-center py-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-['Amiri',serif]">
                  شكراً لك أستاذ {submittedOrder.customerName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  تم استلام طلبك بنجاح! سيتم التواصل معك هاتفياً أو عبر الواتساب لتأكيد موعد التسليم مع مندوب شركة التوصيل في مدينتك.
                </p>
              </div>

              {/* Order Card Badge */}
              <div className="p-4 rounded-xl bg-[#111726] border border-[#D4AF37]/30 text-right space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-gray-400">رقم الطلب:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">{submittedOrder.id}</span>
                    <button 
                      onClick={copyOrderId} 
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                      title="نسخ رقم الطلب"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedOrderId && <span className="text-[10px] text-emerald-400">تم النسخ</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">الساعة المطلوبة:</span>
                  <span className="text-white font-medium">{submittedOrder.productName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">المدينة والتوصيل:</span>
                  <span className="text-gray-200">{submittedOrder.customerCity} - {submittedOrder.customerAddress}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">القيمة الإجمالية:</span>
                  <span className="text-[#D4AF37] font-bold font-mono text-sm">
                    {formatPrice(submittedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Confirmation Action */}
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-xs text-emerald-200 text-center">
                  سيتواصل معك مندوب التوصيل على رقم هاتفك لتسليم الساعة يداً بيد والمعاينة قبل الدفع.
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C378] text-black font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
                >
                  العودة لتصفح الساعات
                </button>
              </div>

            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Snippet */}
              <div className="p-3 bg-[#111726] rounded-xl border border-white/10 flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#D4AF37]/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#D4AF37] uppercase font-mono">{product.brand}</div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{product.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-mono font-bold text-[#E5C378]">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      المتبقي بالمخزون: {product.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              {product.quantity > 1 && (
                <div className="flex items-center justify-between bg-[#131929] px-3.5 py-2 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-300">الكمية المطلوبة:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-white px-2">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="w-7 h-7 rounded bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50 text-white flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3 pt-1">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    اسم المشتري الكريم <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد عبد الله"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#111726] text-white placeholder-gray-500 pr-9 pl-3 py-2 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    رقم الهاتف / الواتساب <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="091 234 5678 / 092 / 094"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#111726] text-white placeholder-gray-500 pr-3 pl-9 py-2 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none text-right"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    سيقوم مندوب التوصيل بالاتصال بك للتنسيق قبل تسليم الشحنة
                  </p>
                </div>

                {/* Libyan City Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    المدينة في ليبيا <span className="text-red-400">*</span>
                  </label>
                  <div className="relative mb-2">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="اكتب مدينتك أو اختر من القائمة أدناه..."
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full bg-[#111726] text-white placeholder-gray-500 pr-9 pl-3 py-2 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  
                  {/* Libyan City Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto no-scrollbar">
                    {libyanCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setCustomerCity(city)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                          customerCity === city
                            ? 'bg-[#D4AF37] text-black font-semibold border-[#D4AF37]'
                            : 'bg-[#151D2E] text-gray-300 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    المنطقة والحي والعنوان المفصل <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="مثال: طرابلس - حي الأندلس، بالقرب من جامع... أو معلم بارز"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-[#111726] text-white placeholder-gray-500 p-2.5 text-xs sm:text-sm rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Delivery info banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#141A28] to-[#171A21] border border-[#D4AF37]/20 flex items-start gap-2.5 text-xs text-gray-300">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">توصيل سريع وآمن لجميع المدن الليبية</p>
                  <p className="text-[11px] text-gray-400">
                    الدفع عند الاستلام مع إمكانية فحص ومعاينة الساعة والتأكد من الضمان والملحقات.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#AA7C11] text-black font-bold text-sm shadow-lg shadow-[#D4AF37]/25 hover:opacity-95 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'جاري تأكيد الطلب...' 
                      : `تأكيد طلب الشراء (${formatPrice(product.price * quantity)})`}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
