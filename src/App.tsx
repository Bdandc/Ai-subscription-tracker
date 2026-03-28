import { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard, Moon, Sun, Zap } from 'lucide-react';
import { Subscription, Purchase } from './types';
import {
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from './services/subscriptionService';
import { fetchPurchases, createPurchase, deletePurchase } from './services/purchaseService';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import PurchaseList from './components/PurchaseList';
import PurchaseForm from './components/PurchaseForm';

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubFormOpen, setIsSubFormOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | undefined>();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadData = useCallback(async () => {
    try {
      const [subs, purch] = await Promise.all([fetchSubscriptions(), fetchPurchases()]);
      setSubscriptions(subs);
      setPurchases(purch);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveSubscription = async (sub: Subscription) => {
    try {
      if (editingSub) {
        const updated = await updateSubscription(sub);
        setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await createSubscription(sub);
        setSubscriptions(prev => [created, ...prev]);
      }
    } catch (e) { console.error('Failed to save subscription', e); }
    setIsSubFormOpen(false);
    setEditingSub(undefined);
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    } catch (e) { console.error('Failed to delete', e); }
  };

  const handleSavePurchase = async (p: Purchase) => {
    try {
      const created = await createPurchase(p);
      setPurchases(prev => [created, ...prev]);
    } catch (e) { console.error('Failed to log purchase', e); }
    setIsPurchaseFormOpen(false);
  };

  const handleDeletePurchase = async (id: string) => {
    if (!window.confirm('Delete this purchase?')) return;
    try {
      await deletePurchase(id);
      setPurchases(prev => prev.filter(p => p.id !== id));
    } catch (e) { console.error('Failed to delete purchase', e); }
  };

  return (
    <div className="min-h-screen bg-[--background] pb-20 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[--foreground] tracking-tight">SubTrack AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(d => !d)}
              className="p-2 rounded-xl text-[--muted-foreground] hover:bg-[--muted] transition-colors"
              title="Toggle dark mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsPurchaseFormOpen(true)}
              className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-xl font-semibold hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-200/50"
              title="Log a top-up"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Top-up</span>
            </button>
            <button
              onClick={() => { setEditingSub(undefined); setIsSubFormOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <Dashboard subscriptions={subscriptions} purchases={purchases} />

        {/* Subscriptions */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[--muted-foreground] uppercase tracking-widest px-1">Subscriptions</h2>
          {loading ? (
            <div className="card p-12 text-center text-[--muted-foreground] text-sm">Loading...</div>
          ) : (
            <SubscriptionList
              subscriptions={subscriptions}
              onEdit={(sub) => { setEditingSub(sub); setIsSubFormOpen(true); }}
              onDelete={handleDeleteSubscription}
            />
          )}
        </div>

        {/* Top-ups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[--muted-foreground] uppercase tracking-widest">Credit Top-ups</h2>
            <button
              onClick={() => setIsPurchaseFormOpen(true)}
              className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
            >
              + Log purchase
            </button>
          </div>
          {!loading && <PurchaseList purchases={purchases} onDelete={handleDeletePurchase} />}
        </div>
      </main>

      {isSubFormOpen && (
        <SubscriptionForm
          onSave={handleSaveSubscription}
          onClose={() => { setIsSubFormOpen(false); setEditingSub(undefined); }}
          initialData={editingSub}
        />
      )}

      {isPurchaseFormOpen && (
        <PurchaseForm
          onSave={handleSavePurchase}
          onClose={() => setIsPurchaseFormOpen(false)}
        />
      )}
    </div>
  );
}
