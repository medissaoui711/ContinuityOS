import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useBCM } from '../../context/BCMContext';

export const EmergencyModal: React.FC = () => {
  const {
    isEmergencyActive,
    emergencyReason,
    showEmergencyModal,
    setShowEmergencyModal,
    handleActivateEmergency,
    handleDeactivateEmergency,
  } = useBCM();

  const [tempReason, setTempReason] = useState('عطل طارئ في المقر الرئيسي - تحويل للعمل عن بعد');

  if (!showEmergencyModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-amber-400">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="font-bold text-lg">
              {isEmergencyActive ? 'إلغاء وضع الطوارئ الشامل' : 'تأكيد تفعيل وضع الطوارئ (BCP)'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEmergencyActive
                ? 'سيتم إلغاء حالة الطوارئ والعودة إلى النمط التشغيلي الاعتيادي.'
                : 'سيتم تحويل الصلاحيات للبدلاء وتفعيل خيار التعافي من الكوارث فوراً.'}
            </p>
          </div>
        </div>

        {!isEmergencyActive && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              سبب تفعيل الطوارئ / وصف الحدث:
            </label>
            <textarea
              value={tempReason}
              onChange={(e) => setTempReason(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500"
              placeholder="اكتب سبب الطوارئ هنا..."
            />
          </div>
        )}

        {isEmergencyActive && (
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-400">السبب الحالي الموثق:</div>
            <div>{emergencyReason || 'غير محدد'}</div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setShowEmergencyModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition-all cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              if (isEmergencyActive) {
                handleDeactivateEmergency();
              } else {
                handleActivateEmergency(tempReason);
              }
              setShowEmergencyModal(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              isEmergencyActive
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isEmergencyActive ? 'تأكيد إيقاف الطوارئ' : 'تأكيد تفعيل الطوارئ فوراً'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
