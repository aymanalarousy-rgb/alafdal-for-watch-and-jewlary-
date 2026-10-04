import React from 'react';
import { X, Printer, Truck, ShieldCheck, Package } from 'lucide-react';
import { Order } from '../types';
import { getStoreSettings } from '../services/storage';

interface WaybillModalProps {
  order: Order | null;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const settings = getStoreSettings();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0F1420] text-gray-100 border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 bg-[#141A28] border-b border-[#D4AF37]/20 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              بوليصة شحن وتوصيل الطلب #{order.id}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C378] text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة البوليصة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-waybill" className="p-6 bg-white text-black font-['Cairo',sans-serif] space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <h1 className="text-xl font-bold font-['Amiri',serif] tracking-wider text-black">
                بوتيك الأفضل للساعات الثمينة
              </h1>
              <p className="text-xs text-gray-600">
                بوليصة شحن وتوصيل داخلي - ليبيا
              </p>
            </div>

            <div className="text-left font-mono">
              <div className="text-xs font-bold text-black bg-gray-100 px-3 py-1 rounded border border-gray-300">
                رقم الشحنة: {order.id}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-LY')}
              </div>
            </div>
          </div>

          {/* Courier Banner */}
          <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-black" />
              <div>
                <span className="text-[10px] text-gray-500 block">شركة التوصيل / المندوب:</span>
                <span className="font-bold text-black">{order.courierCompany || settings.preferredCourier}</span>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="text-left">
                <span className="text-[10px] text-gray-500 block">رقم الإرسالية:</span>
                <span className="font-mono font-bold text-blue-700">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Receiver Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 space-y-1">
              <div className="font-bold text-gray-800 border-b pb-1 mb-1">المرسل:</div>
              <p><span className="text-gray-500">المتجر:</span> بوتيك الأفضل للساعات</p>
              <p><span className="text-gray-500">الموقع:</span> {settings.merchantCity}</p>
            </div>

            <div className="p-3 rounded-lg border-2 border-black bg-amber-50/20 space-y-1">
              <div className="font-bold text-black border-b border-gray-300 pb-1 mb-1">
                المستلم (الزبون):
              </div>
              <p className="font-bold text-sm text-black">{order.customerName}</p>
              <p className="font-bold text-blue-800 text-sm font-mono dir-ltr text-right">{order.customerPhone}</p>
              <p><span className="text-gray-600">المدينة:</span> <strong className="text-black">{order.customerCity}</strong></p>
              <p><span className="text-gray-600">العنوان:</span> {order.customerAddress}</p>
              {order.notes && (
                <p className="text-[11px] text-amber-800 bg-amber-100 p-1 rounded mt-1">
                  ملاحظة: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                <tr>
                  <th className="p-2">الساعة</th>
                  <th className="p-2">الماركة</th>
                  <th className="p-2 text-center">الكمية</th>
                  <th className="p-2 text-left">المبلغ المطلوب تحصيله</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2 font-bold text-black">{order.productName}</td>
                  <td className="p-2 font-mono">{order.productBrand}</td>
                  <td className="p-2 text-center font-bold">{order.quantity}</td>
                  <td className="p-2 text-left font-mono font-bold text-sm text-black">
                    {order.totalAmount.toLocaleString('en-US')} د.ل
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Courier Instructions */}
          <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600 pt-1">
            <div className="p-2 border rounded bg-gray-50 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>فحص ومعاينة ميكانيكية وعلبة أصلية مؤمنة</span>
            </div>

            <div className="p-2 border rounded bg-gray-50 text-center flex flex-col justify-center">
              <span className="text-[10px] text-gray-500">توقيع المستلم عند الاستلام:</span>
              <span className="border-b border-gray-400 mt-3 block"></span>
            </div>
          </div>

          {/* Barcode */}
          <div className="text-center pt-2 border-t border-dashed border-gray-300">
            <div className="inline-block font-mono text-xl tracking-[0.25em] font-bold text-black">
              ||||||||| | ||||| |||| | ||||||| |||
            </div>
            <div className="text-[10px] font-mono text-gray-500 tracking-wider">
              *{order.id}*
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
