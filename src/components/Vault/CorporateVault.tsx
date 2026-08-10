import React, { useState } from 'react';
import { CorporateSecret, VaultCategory } from '../../types';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertOctagon,
  Plus,
  Key,
  Globe,
  CreditCard,
  FileCode,
  ShieldAlert,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface CorporateVaultProps {
  secrets: CorporateSecret[];
  activeRole: string;
  onAddSecret: (secret: CorporateSecret) => void;
}

export const CorporateVault: React.FC<CorporateVaultProps> = ({
  secrets,
  activeRole,
  onAddSecret,
}) => {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Secret Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultCategory>('API_KEYS');
  const [serviceProvider, setServiceProvider] = useState('');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [emergencyProtocol, setEmergencyProtocol] = useState('');

  const toggleSecretReveal = (id: string, secret: CorporateSecret) => {
    // Check if active user role has access
    const hasPermission = secret.allowedRoles.some(
      (role) => activeRole.includes(role) || activeRole.includes('الرئيس التنفيذي') || activeRole.includes('صاحب الشركة')
    );

    if (!hasPermission) {
      alert(`عذراً، هذا السر حساس ومقتصر حصرياً على: ${secret.allowedRoles.join(' ، ')}`);
      return;
    }

    setRevealedSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accountIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: VaultCategory) => {
    switch (cat) {
      case 'DOMAINS_HOSTING':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'BANK_SIGNATORIES':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'API_KEYS':
        return <Key className="w-4 h-4 text-amber-600" />;
      default:
        return <FileCode className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleSaveSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !secretValue) return;

    const newSecret: CorporateSecret = {
      id: `sec-${Date.now()}`,
      title,
      category,
      serviceProvider: serviceProvider || 'مزود خدمة داخلي',
      accountIdentifier: accountIdentifier || 'حساب مؤسسي',
      maskedSecret: '••••••••••••••••',
      unmaskedValue: secretValue,
      allowedRoles: ['الرئيس التنفيذي وصاحب الشركة', 'مدير الأنظمة والنسخ الاحتياطي (IT)'],
      emergencyAccessProtocol: emergencyProtocol || 'بروتوكول الطوارئ القياسي المعتمد بالخزنة',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    onAddSecret(newSecret);
    setIsAddModalOpen(false);
    setTitle('');
    setSecretValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            <span>خزينة أسرار الشركة والأصول الحساسة (Corporate Vault)</span>
          </h2>
          <p className="text-xs text-slate-500">
            حفظ واسترجاع بيانات الاستضافة، مفاتيح API، الحسابات البنكية، وشهادات التشفير وفق بروتوكولات الوصول الطارئ (Break-Glass Access).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة أصول/أسرار للخزينة</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'DOMAINS_HOSTING', 'API_KEYS', 'BANK_SIGNATORIES', 'ENCRYPTION_KEYS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL'
                ? 'جميع الأسرار'
                : cat === 'DOMAINS_HOSTING'
                ? 'الاستضافة والنطاقات'
                : cat === 'API_KEYS'
                ? 'مفاتيح API'
                : cat === 'BANK_SIGNATORIES'
                ? 'التفويضات البنكية'
                : 'مفاتيح التشفير'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في الخزينة المشفّرة..."
            className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Secrets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSecrets.map((secret) => {
          const isRevealed = !!revealedSecrets[secret.id];

          return (
            <div
              key={secret.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all relative"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(secret.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {secret.serviceProvider}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{secret.title}</h3>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400">تم التدقيق: {secret.lastVerifiedDate}</span>
              </div>

              {/* Account ID & Secret Field */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>المعرّف / الحساب:</span>
                  <span className="font-mono text-slate-800 font-bold">{secret.accountIdentifier}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-bold text-amber-800 tracking-wider">
                    {isRevealed ? secret.unmaskedValue || secret.maskedSecret : secret.maskedSecret}
                  </span>

                  <button
                    onClick={() => toggleSecretReveal(secret.id, secret)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer font-medium"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isRevealed ? 'إخفاء' : 'كشف المشفّر'}</span>
                  </button>
                </div>
              </div>

              {/* Roles allowed */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 text-[11px] block">الأدوار المسموح لها بالوصول:</span>
                <div className="flex flex-wrap gap-1.5">
                  {secret.allowedRoles.map((r, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Access Protocol */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  إجراء الوصول الطارئ (Break-Glass Protocol):
                </span>
                <p className="text-slate-700 leading-relaxed">{secret.emergencyAccessProtocol}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Secret Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSecret}
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              إضافة أصل / سر جديد للخزينة المؤسسية
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">اسم الأصل أو الحساب:*</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: حساب استضافة المبيعات السحابية"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">التصنيف:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VaultCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  >
                    <option value="DOMAINS_HOSTING">نطاقات واستضافة</option>
                    <option value="API_KEYS">مفاتيح API</option>
                    <option value="BANK_SIGNATORIES">توقيعات وبنوك</option>
                    <option value="ENCRYPTION_KEYS">مفاتيح تشفير</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">مزود الخدمة:</label>
                  <input
                    type="text"
                    value={serviceProvider}
                    onChange={(e) => setServiceProvider(e.target.value)}
                    placeholder="اسم المزود"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">المعرّف أو البريد المخصص:</label>
                <input
                  type="text"
                  value={accountIdentifier}
                  onChange={(e) => setAccountIdentifier(e.target.value)}
                  placeholder="admin@company.qa"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">السر أو كلمة المرور/المفتاح المشفّر:*</label>
                <input
                  type="password"
                  required
                  value={secretValue}
                  onChange={(e) => setSecretValue(e.target.value)}
                  placeholder="أدخل السر المشفّر..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">بروتوكول الوصول الطارئ:</label>
                <textarea
                  rows={2}
                  value={emergencyProtocol}
                  onChange={(e) => setEmergencyProtocol(e.target.value)}
                  placeholder="كيف يتم الوصول للسر عند غياب المسؤول الأصيل..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                حفظ وحماية السر
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
