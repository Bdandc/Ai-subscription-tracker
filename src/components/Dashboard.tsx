import { Subscription } from '../types';
import { format } from 'date-fns';
import { EXCHANGE_RATES, CURRENCY_SYMBOLS } from '../constants';

interface DashboardProps {
  subscriptions: Subscription[];
}

export default function Dashboard({ subscriptions }: DashboardProps) {
  const totalMonthlyGBP = subscriptions.reduce((acc, sub) => {
    const rate = EXCHANGE_RATES[sub.currency] || 1;
    const amountInGBP = sub.amount * rate;
    const monthlyAmount = sub.billingCycle === 'yearly' ? amountInGBP / 12 : amountInGBP;
    return acc + monthlyAmount;
  }, 0);

  const upcomingBills = [...subscriptions]
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="card p-8 bg-white border-slate-200 shadow-sm flex flex-col items-center text-center">
        <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">Total Monthly Burn</p>
        <h3 className="text-6xl font-black mt-4 text-slate-900 tracking-tighter">£{totalMonthlyGBP.toFixed(2)}</h3>
        <p className="text-slate-500 text-sm mt-4 font-medium bg-slate-100 px-3 py-1 rounded-full">
          Converted to GBP • {subscriptions.length} subscriptions
        </p>
      </div>
    </div>
  );
}
