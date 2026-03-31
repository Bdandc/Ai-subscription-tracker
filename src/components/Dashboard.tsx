import { Subscription, Purchase } from '../types';
import { EXCHANGE_RATES } from '../constants';

interface DashboardProps {
  subscriptions: Subscription[];
  purchases: Purchase[];
  allView?: boolean;
}

export default function Dashboard({ subscriptions, purchases, allView }: DashboardProps) {
  const totalMonthlyGBP = subscriptions.reduce((acc, sub) => {
    const rate = EXCHANGE_RATES[sub.currency] || 1;
    const amountInGBP = sub.amount * rate;
    const monthlyAmount = sub.billingCycle === 'yearly' ? amountInGBP / 12 : amountInGBP;
    return acc + monthlyAmount;
  }, 0);

  const totalAnnualGBP = totalMonthlyGBP * 12;

  const now = new Date();
  const thisMonthTopUps = purchases
    .filter(p => {
      const d = new Date(p.purchaseDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((acc, p) => acc + (p.amount * (EXCHANGE_RATES[p.currency] || 1)), 0);

  const trueTotalThisMonth = totalMonthlyGBP + thisMonthTopUps;

  return (
    <div className="space-y-3">
      {/* Main total */}
      <div className="card p-8 flex flex-col items-center text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[--muted-foreground]">{allView ? 'Combined Monthly Burn' : 'Total Monthly Burn'}</p>
        <h3 className="text-6xl font-black mt-4 text-[--foreground] tracking-tighter">£{totalMonthlyGBP.toFixed(2)}</h3>
        <p className="text-sm mt-2 font-medium text-[--muted-foreground]">£{totalAnnualGBP.toFixed(2)} per year</p>
        <p className="text-sm mt-3 font-medium bg-[--muted] text-[--muted-foreground] px-3 py-1 rounded-full">
          Converted to GBP · {subscriptions.length} subscriptions
        </p>
      </div>

      {/* This month breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[--muted-foreground]">Subscriptions</p>
          <p className="text-2xl font-black mt-1 text-[--foreground]">£{totalMonthlyGBP.toFixed(2)}</p>
          <p className="text-[10px] text-[--muted-foreground] mt-1 uppercase tracking-wider">This month</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[--muted-foreground]">Top-ups</p>
          <p className="text-2xl font-black mt-1 text-amber-500">£{thisMonthTopUps.toFixed(2)}</p>
          <p className="text-[10px] text-[--muted-foreground] mt-1 uppercase tracking-wider">This month</p>
        </div>
      </div>

      {thisMonthTopUps > 0 && (
        <div className="card p-4 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">True cost this month</p>
          <p className="text-xl font-black text-blue-700 dark:text-blue-300">£{trueTotalThisMonth.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
