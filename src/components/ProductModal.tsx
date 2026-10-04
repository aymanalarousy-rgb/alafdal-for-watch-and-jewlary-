import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Package, 
  Layers,
  Truck,
  Star,
  MessageSquare,
  User,
  MapPin,
  CheckCircle2,
  Calendar,
  Send
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { 
  formatPrice, 
  getProductReviews, 
  addProductReview, 
  getProductRatingStats 
} from '../services/storage';
import heroWatchImage from '../assets/images/luxury_watch_hero_1791153265521.jpg';

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
  const [modalTab, setModalTab] = useState<'details' | 'reviews'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [ratingStats, setRatingStats] = useState({ average: 5.0, count: 0 });

  // New review form
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('طرابلس');
  const [newNotes, setNewNotes] = useState('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState('');

  const isOutOfStock = product.quantity <= 0;

  const refreshReviews = () => {
    if (!product) return;
    setReviews(getProductReviews(product.id));
    setRatingStats(getProductRatingStats(product.id));
  };

  useEffect(() => {
    refreshReviews();
    setActiveImageIndex(0);
    setModalTab('details');
    setReviewSubmittedMsg('');
  }, [product?.id]);

  useEffect(() => {
    const handleUpdate = () => refreshReviews();
    window.addEventListener('alafdal_reviews_updated', handleUpdate);
    return () => window.removeEventListener('alafdal_reviews_updated', handleUpdate);
  }, [product?.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!newNotes.trim()) {
      alert('يرجى كتابة رأيك أو ملاحظاتك في الساعة.');
      return;
    }

    addProductReview({
      productId: product.id,
      userName: newName.trim() || 'زبون معتمد',
      userCity: newCity.trim() || 'طرابلس',
      rating: newRating,
      notes: newNotes.trim(),
    });

    setNewNotes('');
    setNewName('');
    setReviewSubmittedMsg('شكراً لك! تم إضافة تقييمك وملاحظاتك بنجاح.');
    refreshReviews();

    setTimeout(() => {
      setReviewSubmittedMsg('');
    }, 4000);
  };

  const ratingDescriptions: Record<number, string> = {
    5: 'ممتاز جداً 5 نجوم (أنصح به بشدة)',
    4: 'جيد جداً 4 نجوم (ساعة مميزة ورائعة)',
    3: 'جيد 3 نجوم (مطابق للوصف)',
    2: 'مقبول نجمتان',
    1: 'نجمة واحدة',
  };

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
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
          
          {/* Images Section */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#070A10] border border-[#D4AF37]/20">
              <img
                src={product.images[activeImageIndex] || heroWatchImage}
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
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition shrink-0 cursor-pointer ${
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
                كل ساعة معروضة تخضع لفحص شامل للأجزاء والمحرك لضمان الجودة، وتأتي مع شهادة ضمان معتمدة.
              </p>
            </div>
          </div>

          {/* Details & Reviews Tabs */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider font-mono">
                {product.brand}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Amiri',serif] mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Star Rating Overview (Clicking switches to reviews tab) */}
              <div 
                onClick={() => setModalTab('reviews')}
                className="flex items-center gap-2 mt-2 cursor-pointer hover:opacity-80 transition"
                title="اضغط للانتقال إلى تقييمات الزبائن"
              >
                <div className="flex items-center text-[#D4AF37]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(ratingStats.average)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#E5C378] font-mono font-bold">
                  {ratingStats.average.toFixed(1)} من 5
                </span>
                <span className="text-xs text-gray-400">
                  ({reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات'} - اضغط لكتابة رأيك)
                </span>
              </div>
            </div>

            {/* Price & Stock Display */}
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
                <span className="text-xs text-gray-400 block">التوفر بالمخزون:</span>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-400">نفدت الكمية</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400">
                    متوفر ({product.quantity} قطعة)
                  </span>
                )}
              </div>
            </div>

            {/* TAB SELECTOR: Specs vs Reviews */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setModalTab('details')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'details'
                    ? 'bg-[#D4AF37] text-black shadow-sm'
                    : 'bg-[#111726] text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>المواصفات والتفاصيل</span>
              </button>

              <button
                onClick={() => setModalTab('reviews')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'reviews'
                    ? 'bg-[#D4AF37] text-black shadow-sm'
                    : 'bg-[#111726] text-gray-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>تقييمات وآراء الزبائن ({reviews.length})</span>
              </button>
            </div>

            {/* TAB 1: DETAILS & SPECS */}
            {modalTab === 'details' && (
              <div className="space-y-4">
                {/* Specifications Grid */}
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

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-300">تفاصيل إضافية:</h4>
                  <p className="text-xs text-gray-300 leading-relaxed bg-[#111726]/60 p-3 rounded-lg border border-white/5 max-h-24 overflow-y-auto">
                    {product.description}
                  </p>
                </div>

                {/* Delivery note */}
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#121622] p-2 rounded-lg">
                  <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>توصيل لكافة المدن في ليبيا مع المعاينة قبل الدفع عند الاستلام</span>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOMER REVIEWS (STAR RATING & NOTES) */}
            {modalTab === 'reviews' && (
              <div className="space-y-4">
                
                {/* Form to submit review */}
                <div className="p-4 rounded-xl bg-[#111726] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span>أضف تقييمك ورأيك في هذه الساعة:</span>
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      رأيك وملاحظاتك تظهر مباشرة للزبائن
                    </span>
                  </div>

                  {reviewSubmittedMsg && (
                    <div className="p-2.5 bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2 animate-pulse">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{reviewSubmittedMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    
                    {/* Interactive Star Picker */}
                    <div>
                      <label className="block text-[11px] text-gray-300 mb-1">
                        حدد عدد النجوم:
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-[#161F33] p-1.5 rounded-lg border border-white/10">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= (hoverRating || newRating);
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 hover:scale-120 transition cursor-pointer"
                                title={`${star} نجوم`}
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    isFilled
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs text-[#E5C378] font-bold">
                          {ratingDescriptions[hoverRating || newRating]}
                        </span>
                      </div>
                    </div>

                    {/* Name & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">الاسم أو اللقب:</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: عبدالسلام، المهدي..."
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full bg-[#161F33] text-white p-2 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">المدينة:</label>
                        <input
                          type="text"
                          placeholder="طرابلس، بنغازي، مصراتة..."
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full bg-[#161F33] text-white p-2 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Notes / Comment */}
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        رأيك وملاحظاتك حول الساعة (Notes):
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="اكتب ملاحظاتك، رأيك في فخامة الساعة، سرعة التسليم، التعامل..."
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="w-full bg-[#161F33] text-white p-2 text-xs rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C378] text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال التقييم</span>
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-1">
                    <span>جميع التقييمات المسجلة ({reviews.length})</span>
                    <span className="text-[#D4AF37]">متوسط التقييم: {ratingStats.average.toFixed(1)} / 5</span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-6 bg-[#111726]/40 rounded-xl border border-white/5 text-xs text-gray-400 space-y-1">
                      <p>لا توجد تقييمات مكتوبة لهذه الساعة حتى الآن.</p>
                      <p className="text-[11px] text-[#D4AF37]">كن أول من يكتب تقييمه وملاحظاته في النموذج أعلاه!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3 bg-[#111726] rounded-xl border border-white/5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white flex items-center gap-1">
                                <User className="w-3 h-3 text-[#D4AF37]" />
                                {rev.userName}
                              </span>
                              {rev.userCity && (
                                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {rev.userCity}
                                </span>
                              )}
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                زبون موثق
                              </span>
                            </div>

                            <div className="flex items-center text-[#D4AF37]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= rev.rating
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          <p className="text-xs text-gray-200 leading-relaxed bg-[#161F33]/60 p-2 rounded-lg border border-white/5">
                            {rev.notes}
                          </p>

                          <div className="text-[10px] text-gray-500 text-left">
                            {new Date(rev.createdAt).toLocaleDateString('ar-LY')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Buy Action Button */}
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
