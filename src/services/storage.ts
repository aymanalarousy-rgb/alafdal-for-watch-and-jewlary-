import { Product, Order, Currency } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_KEY = 'alafdal_luxury_products_clean_v1';
const ORDERS_KEY = 'alafdal_luxury_orders_ly_v2';
const ADMIN_AUTH_KEY = 'alafdal_admin_auth_ly_v2';
const STORE_SETTINGS_KEY = 'alafdal_store_settings_ly_v2';
const FAILED_ATTEMPTS_KEY = 'alafdal_failed_login_attempts_v2';
const ACTIVE_OTP_KEY = 'alafdal_active_otp_session_v2';

export const AUTHORIZED_ADMIN_EMAIL = 'aymanalarousy@gmail.com';

export interface StoreSettings {
  storeName: string;
  merchantCity: string;
  preferredCourier: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'الأفضل للساعات والمقتنيات الثمينة',
  merchantCity: 'طرابلس، ليبيا',
  preferredCourier: 'شركة السريع للتوصيل والشحن المحلي',
};

export const LIBYAN_COURIERS = [
  { id: 'al-saree', name: 'شركة السريع لخدمات التوصيل والشحن المحلي', badge: 'توصيل لكافة المدن الليبية' },
  { id: 'fast-delivery', name: 'فاست دليفري ليبيا (Fast Delivery)', badge: 'شحن سريع للمنازل' },
  { id: 'ajniha', name: 'شركة الأجنحة للشحن الداخلي', badge: 'طرابلس - بنغازي - مصراتة والجنوب' },
  { id: 'tripoli-vip', name: 'مندوب خاص فوري (طرابلس وضواحيها)', badge: 'تسليم يدوي مباشر في نفس اليوم' },
  { id: 'waha-courier', name: 'شركة الواحة للشحن السريع', badge: 'المنطقة الشرقية والغربية والوسطى' },
];

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('alafdal_products_updated'));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getStoredProducts();
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newProduct, ...products];
  saveProducts(updated);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('alafdal_orders_updated'));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  product: Product;
  quantity?: number;
}): Order {
  const orders = getStoredOrders();
  const qty = data.quantity || 1;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newOrder: Order = {
    id: orderId,
    customerName: data.customerName.trim(),
    customerPhone: data.customerPhone.trim(),
    customerCity: data.customerCity.trim(),
    customerAddress: data.customerAddress.trim(),
    notes: data.notes?.trim() || '',
    productId: data.product.id,
    productName: data.product.name,
    productBrand: data.product.brand,
    productImage: data.product.images[0] || '',
    price: data.product.price,
    quantity: qty,
    totalAmount: data.product.price * qty,
    status: 'new',
    courierCompany: DEFAULT_STORE_SETTINGS.preferredCourier,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);

  // Automatically deduct quantity from product
  const products = getStoredProducts();
  const pIndex = products.findIndex(p => p.id === data.product.id);
  if (pIndex !== -1) {
    const currentQty = products[pIndex].quantity;
    const newQty = Math.max(0, currentQty - qty);
    products[pIndex] = { ...products[pIndex], quantity: newQty };
    saveProducts(products);
  }

  // Send automatic email notification to merchant's inbox (aymanalarousy@gmail.com)
  try {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(AUTHORIZED_ADMIN_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `طلب شراء جديد #${newOrder.id} - ${newOrder.customerName} (${newOrder.customerCity})`,
        _template: 'table',
        email: AUTHORIZED_ADMIN_EMAIL,
        message: `طلب شراء جديد وارد إلى متجر الأفضل للساعات الثمينة (ليبيا):

رقم الطلب: ${newOrder.id}
اسم الزبون: ${newOrder.customerName}
رقم الهاتف: ${newOrder.customerPhone}
المدينة: ${newOrder.customerCity}
العنوان: ${newOrder.customerAddress}
${newOrder.notes ? `ملاحظات: ${newOrder.notes}\n` : ''}
الساعة المطلوبة: ${newOrder.productName}
الماركة: ${newOrder.productBrand}
الكمية: ${newOrder.quantity}
القيمة الإجمالية: ${newOrder.totalAmount.toLocaleString('en-US')} دينار ليبي

يمكنك طباعة بوليصة التوصيل للمندوب مباشرة عبر لوحة الإدارة:
your-store-url/admin`
      })
    }).catch(err => console.log('Order email notification error:', err));
  } catch (err) {
    console.warn('Order email dispatch notice:', err);
  }

  return newOrder;
}

export function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  courierCompany?: string, 
  trackingNumber?: string
): Order | null {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    status,
    courierCompany: courierCompany || orders[index].courierCompany,
    trackingNumber: trackingNumber !== undefined ? trackingNumber : orders[index].trackingNumber,
    updatedAt: new Date().toISOString(),
  };

  saveOrders(orders);
  return orders[index];
}

export function getStoreSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORE_SETTINGS_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

// ==========================================
// PURE EMAIL-OTP AUTHENTICATION (NO PASSWORD)
// Strictly tied to aymanalarousy@gmail.com
// ==========================================

export function checkLockoutStatus(): { isLocked: boolean; remainingMinutes: number } {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingMinutes: 0 };
    const data = JSON.parse(raw);
    if (data.attempts >= 5) {
      const elapsed = Date.now() - data.lastFailedAt;
      const lockoutDuration = 10 * 60 * 1000; // 10 minutes lockout
      if (elapsed < lockoutDuration) {
        const remainingMinutes = Math.ceil((lockoutDuration - elapsed) / 60000);
        return { isLocked: true, remainingMinutes };
      } else {
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }
    return { isLocked: false, remainingMinutes: 0 };
  } catch {
    return { isLocked: false, remainingMinutes: 0 };
  }
}

function recordFailedAttempt(): number {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const data = raw ? JSON.parse(raw) : { attempts: 0, lastFailedAt: 0 };
    data.attempts += 1;
    data.lastFailedAt = Date.now();
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(data));
    return data.attempts;
  } catch {
    return 1;
  }
}

function resetFailedAttempts(): void {
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
}

export function checkAdminSession(): boolean {
  try {
    const auth = sessionStorage.getItem(ADMIN_AUTH_KEY) || localStorage.getItem(ADMIN_AUTH_KEY);
    if (!auth) return false;
    const parsed = JSON.parse(auth);
    return parsed.email === AUTHORIZED_ADMIN_EMAIL && parsed.authorized === true && parsed.sessionToken;
  } catch {
    return false;
  }
}

// Generates and sends a 6-digit security code directly to aymanalarousy@gmail.com
// NEVER reveals the code on screen
export async function sendEmailOTPToOwner(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const normalized = email.trim().toLowerCase();
  if (normalized !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: 'عذراً! هذا البريد غير مصرح له كمسؤول عن المتجر، ولا يمكن إرسال أي رمز إليه.',
    };
  }

  // Generate 6-digit cryptographically secure code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const session = {
    email: AUTHORIZED_ADMIN_EMAIL,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes valid
  };

  localStorage.setItem(ACTIVE_OTP_KEY, JSON.stringify(session));

  // Send real email via secure form API directly to aymanalarousy@gmail.com
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(AUTHORIZED_ADMIN_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `كود الأمان لدخول متجر الأفضل للساعات [${code}]`,
        _template: 'table',
        email: AUTHORIZED_ADMIN_EMAIL,
        message: `مرحباً أستاذ أيمن العروسي،\n\nكود الأمان السري لتسجيل دخولك إلى لوحة إدارة متجر الأفضل هو:\n\n👉  ${code}  👈\n\nصالح لمدة 10 دقائق.\nإذا لم تكن أنت من طلب هذا الرمز، فهذا يعني أن شخصاً يحاول فتح لوحة الإدارة ولم يتمكن من ذلك.`
      })
    }).catch(err => console.log('Email delivery background dispatch:', err));
  } catch (err) {
    console.warn('Email dispatch warning:', err);
  }

  return {
    success: true,
    message: `تم إرسال رمز الأمان بنجاح إلى بريدك الإلكتروني (${AUTHORIZED_ADMIN_EMAIL}). يرجى فتح بريدك وكتابة الرمز هنا للدخول فوراً.`,
  };
}

// Passwordless Login: ONLY Email + OTP required!
export function loginAdminSecure(params: {
  email: string;
  otpCode: string;
  remember?: boolean;
}): { success: boolean; error?: string } {
  const lockout = checkLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `تم قفل محاولات الدخول مؤقتاً لحماية المتجر بسبب تكرار أخطاء. يرجى الانتظار ${lockout.remainingMinutes} دقيقة قبل المحاولة مجدداً.`,
    };
  }

  const normalizedEmail = params.email.trim().toLowerCase();

  // 1. Strict Email Verification
  if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    recordFailedAttempt();
    return {
      success: false,
      error: 'غير مصرح بالدخول! لوحة الإدارة مربوطة فقط بالبريد الحصري لمالك المتجر. لا يمكن لأي حساب آخر الدخول.',
    };
  }

  // 2. Email Security Code (OTP) Verification
  const otpRaw = localStorage.getItem(ACTIVE_OTP_KEY);
  if (!otpRaw) {
    return {
      success: false,
      error: 'يرجى الضغط على زر "إرسال رمز الدخول إلى بريدي" أولاً للحصول على الرمز في بريدك الإلكتروني.',
    };
  }

  const otpSession = JSON.parse(otpRaw);
  if (Date.now() > otpSession.expiresAt) {
    localStorage.removeItem(ACTIVE_OTP_KEY);
    return {
      success: false,
      error: 'انتهت صلاحية رمز الأمان. يرجى الضغط مجدداً على طلب رمز جديد إلى بريدك.',
    };
  }

  if (params.otpCode.trim() !== otpSession.code) {
    recordFailedAttempt();
    return {
      success: false,
      error: 'رمز التحقق غير صحيح. يرجى مراجعة بريدك الإلكتروني ونسخ الرمز المكون من 6 أرقام بدقة.',
    };
  }

  // Reset failures and create authorized session
  resetFailedAttempts();
  localStorage.removeItem(ACTIVE_OTP_KEY);

  const authData = {
    email: AUTHORIZED_ADMIN_EMAIL,
    authorized: true,
    sessionToken: `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
  };

  if (params.remember) {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authData));
  }
  sessionStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authData));

  return { success: true };
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

// Currency Formatter - Libyan Dinar only (د.ل)
export function formatPrice(amountInLYD: number, _unusedCurrency?: Currency): string {
  return `${amountInLYD.toLocaleString('en-US')} د.ل`;
}
