import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { MedicineCatalogItem } from '../../types';
import {
  AlertTriangle,
  Pill,
  ArrowRight,
  PackagePlus,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { GoodsReceiptModal } from '../dispensary/GoodsReceiptModal';

export const DispensaryStockAlerts: React.FC = () => {
  const {
    medicines,
    batches,
    setActiveTab,
    language,
    settings,
  } = useClinic();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'near_expiry'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate stock levels per medicine
  const inventoryStatusList = medicines.map(med => {
    // Active, valid batches
    const validBatches = batches.filter(
      b => b.medicineId === med.id &&
           b.status !== 'expired' &&
           b.status !== 'quarantined' &&
           b.status !== 'blocked' &&
           b.expiryDate >= todayStr
    );

    const totalAvailable = validBatches.reduce((acc, b) => acc + b.currentQuantity, 0);
    // Use configured threshold or fallback to 50 base units
    const threshold = med.reorderLevelBaseUnits || 50;
    const isBelowThreshold = totalAvailable < threshold;
    const isDepleted = totalAvailable === 0;
    const isCritical = totalAvailable <= threshold * 0.4;
    const percentOfTarget = Math.min(100, Math.round((totalAvailable / threshold) * 100));
    const deficitUnits = Math.max(0, threshold - totalAvailable);
    const unitsPerPack = med.unitsPerPack || 10;
    const packsNeeded = Math.ceil(deficitUnits / unitsPerPack);

    // Near expiry lots for this medicine
    const nearExpiryBatches = batches.filter(
      b => b.medicineId === med.id &&
           b.status === 'near_expiry'
    );

    return {
      medicine: med,
      totalAvailable,
      threshold,
      percentOfTarget,
      isBelowThreshold,
      isDepleted,
      isCritical,
      deficitUnits,
      packsNeeded,
      unitsPerPack,
      packagingUnit: med.packagingUnit || 'Strip (10 tabs)',
      validBatchesCount: validBatches.length,
      nearExpiryCount: nearExpiryBatches.length,
    };
  });

  const lowStockItems = inventoryStatusList.filter(item => item.isBelowThreshold);
  const criticalItems = inventoryStatusList.filter(item => item.isCritical);
  const nearExpiryBatches = batches.filter(
    b => b.status === 'near_expiry' || (b.expiryDate >= todayStr && (new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) <= 30)
  );
  const expiredBatches = batches.filter(
    b => b.status === 'expired' || b.expiryDate < todayStr
  );

  const totalWarnings = lowStockItems.length + nearExpiryBatches.length + expiredBatches.length;

  if (totalWarnings === 0 || isDismissed) {
    return null;
  }

  const displayedItems = lowStockItems.filter(item => {
    if (filterType === 'critical') return item.isCritical;
    if (filterType === 'near_expiry') return item.nearExpiryCount > 0;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden transition-all">
      {/* Top Warning Notification Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 p-4 sm:p-5 border-b border-amber-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {language === 'bn'
                    ? 'ডিসপেনসারি ইনভেন্টরি সতর্কতা: স্টক ন্যূনতম সীমার নিচে'
                    : 'Dispensary Inventory Warning: Items Below Safety Threshold'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  {lowStockItems.length} {language === 'bn' ? 'টি কম মজুত' : 'low stock'}
                </span>
                {nearExpiryBatches.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                    {nearExpiryBatches.length} {language === 'bn' ? 'টি আসন্ন মেয়াদ' : 'near expiry'}
                  </span>
                )}
                {expiredBatches.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-100 font-mono">
                    {expiredBatches.length} {language === 'bn' ? 'টি মেয়াদোত্তীর্ণ (লকড)' : 'expired locked'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {language === 'bn'
                  ? 'চেম্বার চলাকালীন প্রেসক্রিপশন হ্যান্ডওভারে ঘাটতি এড়াতে নতুন জিআরএন (GRN) এর মাধ্যমে স্টক জমা করুন।'
                  : 'Safety buffers breached. Create a Goods Receipt Note (GRN) to replenish stock and maintain consultation fulfillment.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setShowGRNModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্টক চালান (GRN) গ্রহণ' : 'Intake Stock (GRN)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('dispensary')}
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <span>{language === 'bn' ? 'ডিসপেনসারি ড্যাশবোর্ড' : 'Dispensary Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-amber-100/50 rounded-lg transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-amber-100/50 rounded-lg transition-colors"
              title="Dismiss warning for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Segmented Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Deficits ({lowStockItems.length})
              </button>
              <button
                onClick={() => setFilterType('critical')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  filterType === 'critical'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical Depletion ({criticalItems.length})
              </button>
              <button
                onClick={() => setFilterType('near_expiry')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  filterType === 'near_expiry'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Near Expiry Lots ({nearExpiryBatches.length})
              </button>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {language === 'bn'
                  ? 'FEFO অ্যালগরিদম স্বয়ংক্রিয়ভাবে মেয়াদোত্তীর্ণ ব্যাচ লক করে রাখে'
                  : 'FEFO Engine automatically hard-locks expired batches from fulfillment'}
              </span>
            </div>
          </div>

          {/* Cards Grid for Low-Stock Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedItems.map(item => {
              const isCrit = item.isCritical;
              const isDep = item.isDepleted;

              return (
                <div
                  key={item.medicine.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isDep
                      ? 'bg-rose-50/60 border-rose-300'
                      : isCrit
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-amber-50/20 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.medicine.brandName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.medicine.strength}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.medicine.genericName}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isDep
                          ? 'bg-rose-600 text-white'
                          : isCrit
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isDep ? 'Depleted (0)' : isCrit ? 'Critical' : 'Low Stock'}
                    </span>
                  </div>

                  {/* Stock Progress Gauge */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 font-semibold">
                        {language === 'bn' ? 'বর্তমান মজুত:' : 'Current Stock:'}{' '}
                        <strong className={isCrit ? 'text-rose-700' : 'text-amber-700'}>
                          {item.totalAvailable}
                        </strong>{' '}
                        / {item.threshold} units
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {item.percentOfTarget}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isDep
                            ? 'bg-rose-600'
                            : isCrit
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.max(4, item.percentOfTarget)}%` }}
                      />
                    </div>
                  </div>

                  {/* Reorder Recommendation Box */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <div className="text-slate-600">
                      <span>Deficit: </span>
                      <strong className="text-slate-900 font-mono">+{item.deficitUnits} u</strong>
                      <span className="text-slate-400 mx-1">·</span>
                      <span className="text-purple-700 font-medium">
                        ~{item.packsNeeded} {item.packagingUnit.split(' ')[0]}s
                      </span>
                    </div>

                    <button
                      onClick={() => setShowGRNModal(true)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <span>Restock</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Near Expiry / Expired Alert Mini-List */}
          {(nearExpiryBatches.length > 0 || expiredBatches.length > 0) && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 mr-2">
                    FEFO Expiry Liquidation Focus:
                  </span>
                  <span className="text-slate-600">
                    {nearExpiryBatches.map(b => `${b.brandName} (${b.lotNumber}, Exp: ${b.expiryDate})`).join(' · ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('dispensary')}
                className="text-purple-700 hover:text-purple-900 font-semibold whitespace-nowrap self-end sm:self-center"
              >
                Manage Batches →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Goods Receipt Intake Modal */}
      <GoodsReceiptModal
        isOpen={showGRNModal}
        onClose={() => setShowGRNModal(false)}
      />
    </div>
  );
};
