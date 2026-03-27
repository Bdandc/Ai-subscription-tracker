import { useState, useEffect } from 'react';
import { Plus, Sparkles, LayoutDashboard, List, RefreshCw, CreditCard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Subscription } from './types';
import { getSpendingInsights } from './services/geminiService';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import { cn } from './lib/utils';

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | undefined>();
  const [insights, setInsights] = useState<string>('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('subtrack_subscriptions');
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse subscriptions", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('subtrack_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const handleSaveSubscription = (sub: Subscription) => {
    if (editingSub) {
      setSubscriptions(prev => prev.map(s => s.id === sub.id ? sub : s));
    } else {
      setSubscriptions(prev => [...prev, sub]);
    }
    setIsFormOpen(false);
    setEditingSub(undefined);
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    const result = await getSpendingInsights(subscriptions);
    setInsights(result);
    setIsGeneratingInsights(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SubTrack AI</h1>
          </div>
          <button
            onClick={() => {
              setEditingSub(undefined);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Total Burn Section */}
        <Dashboard subscriptions={subscriptions} />

        {/* Subscriptions List Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest px-1">All Subscriptions</h2>
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={(sub) => {
              setEditingSub(sub);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteSubscription}
          />
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && (
        <SubscriptionForm
          onSave={handleSaveSubscription}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSub(undefined);
          }}
          initialData={editingSub}
        />
      )}
    </div>
  );
}

