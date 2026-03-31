import { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard, Moon, Sun, Zap, Pencil, Trash2, LayoutList } from 'lucide-react';
import { Subscription, Purchase, TrackerList } from './types';
import {
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from './services/subscriptionService';
import { fetchPurchases, createPurchase, deletePurchase } from './services/purchaseService';
import { fetchLists, createList, updateList, deleteList } from './services/listService';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import PurchaseList from './components/PurchaseList';
import PurchaseForm from './components/PurchaseForm';
import ListForm from './components/ListForm';

export default function App() {
  const [lists, setLists] = useState<TrackerList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubFormOpen, setIsSubFormOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | undefined>();
  const [isListFormOpen, setIsListFormOpen] = useState(false);
  const [editingList, setEditingList] = useState<TrackerList | undefined>();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadData = useCallback(async () => {
    try {
      const [loadedLists, subs, purch] = await Promise.all([
        fetchLists(),
        fetchSubscriptions(),
        fetchPurchases(),
      ]);
      setLists(loadedLists);
      setSubscriptions(subs);
      setPurchases(purch);
      if (loadedLists.length > 0) {
        setActiveListId(prev => prev ?? loadedLists[0].id);
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const activeList = lists.find(l => l.id === activeListId);
  const activeSubs = subscriptions.filter(s => s.listId === activeListId);

  // --- List handlers ---
  const handleSaveList = async (list: TrackerList) => {
    try {
      if (editingList) {
        const updated = await updateList(list);
        setLists(prev => prev.map(l => l.id === updated.id ? updated : l));
      } else {
        const created = await createList(list);
        setLists(prev => [...prev, created]);
        setActiveListId(created.id);
      }
    } catch (e) { console.error('Failed to save list', e); }
    setIsListFormOpen(false);
    setEditingList(undefined);
  };

  const handleDeleteList = async (id: string) => {
    if (!window.confirm('Delete this list and all its subscriptions?')) return;
    try {
      await deleteList(id);
      setLists(prev => {
        const remaining = prev.filter(l => l.id !== id);
        if (activeListId === id) setActiveListId(remaining[0]?.id ?? null);
        return remaining;
      });
      setSubscriptions(prev => prev.filter(s => s.listId !== id));
    } catch (e) { console.error('Failed to delete list', e); }
  };

  // --- Subscription handlers ---
  const handleSaveSubscription = async (sub: Subscription) => {
    const subWithList = { ...sub, listId: activeListId! };
    try {
      if (editingSub) {
        const updated = await updateSubscription(subWithList);
        setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await createSubscription(subWithList);
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

  // --- Purchase handlers ---
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

  const isAiList = activeList?.name.toLowerCase().includes('ai');

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
            {isAiList && (
              <button
                onClick={() => setIsPurchaseFormOpen(true)}
                className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-xl font-semibold hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-200/50"
                title="Log a top-up"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Top-up</span>
              </button>
            )}
            {activeListId && (
              <button
                onClick={() => { setEditingSub(undefined); setIsSubFormOpen(true); }}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                style={{ backgroundColor: activeList?.color ?? '#3B82F6' }}
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Lists tab bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 border-2"
              style={
                activeListId === list.id
                  ? { backgroundColor: list.color, color: '#fff', borderColor: list.color }
                  : { backgroundColor: 'transparent', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
              }
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: activeListId === list.id ? 'rgba(255,255,255,0.6)' : list.color }}
              />
              {list.name}
            </button>
          ))}
          <button
            onClick={() => { setEditingList(undefined); setIsListFormOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 border-2 border-dashed border-[--border] text-[--muted-foreground] hover:border-blue-400 hover:text-blue-500"
          >
            <Plus className="w-3.5 h-3.5" />
            New List
          </button>
        </div>

        {loading ? (
          <div className="card p-12 text-center text-[--muted-foreground] text-sm">Loading…</div>
        ) : !activeList ? (
          <div className="card p-12 flex flex-col items-center text-center">
            <LayoutList className="w-10 h-10 text-[--muted-foreground] mb-3" />
            <h3 className="text-lg font-semibold text-[--foreground]">No lists yet</h3>
            <p className="text-[--muted-foreground] mt-1 text-sm">Create a list to start tracking expenses.</p>
            <button
              onClick={() => { setEditingList(undefined); setIsListFormOpen(true); }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <>
            {/* Active list header with edit/delete */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeList.color }} />
                <h2 className="text-base font-bold text-[--foreground]">{activeList.name}</h2>
                <span className="text-xs text-[--muted-foreground] font-medium">
                  {activeSubs.length} subscription{activeSubs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditingList(activeList); setIsListFormOpen(true); }}
                  className="p-1.5 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-blue-500 transition-colors"
                  title="Edit list"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {lists.length > 1 && (
                  <button
                    onClick={() => handleDeleteList(activeList.id)}
                    className="p-1.5 hover:bg-[--muted] rounded-lg text-[--muted-foreground] hover:text-red-500 transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <Dashboard subscriptions={activeSubs} purchases={isAiList ? purchases : []} />

            {/* Subscriptions */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-[--muted-foreground] uppercase tracking-widest px-1">Subscriptions</h2>
              <SubscriptionList
                subscriptions={activeSubs}
                onEdit={(sub) => { setEditingSub(sub); setIsSubFormOpen(true); }}
                onDelete={handleDeleteSubscription}
              />
            </div>

            {/* Credit Top-ups — AI list only */}
            {isAiList && (
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
                <PurchaseList purchases={purchases} onDelete={handleDeletePurchase} />
              </div>
            )}
          </>
        )}
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

      {isListFormOpen && (
        <ListForm
          onSave={handleSaveList}
          onClose={() => { setIsListFormOpen(false); setEditingList(undefined); }}
          initialData={editingList}
        />
      )}
    </div>
  );
}
