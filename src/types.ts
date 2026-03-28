export type SubscriptionCategory = 
  | 'Entertainment' 
  | 'Software' 
  | 'Health' 
  | 'Utilities' 
  | 'Finance' 
  | 'Education' 
  | 'Other';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  category: SubscriptionCategory;
  nextBillingDate: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'cancelled' | 'paused';
}

export interface Purchase {
  id: string;
  service: string;
  amount: number;
  currency: string;
  purchaseDate: string;
  notes?: string;
}

export interface SpendingInsight {
  title: string;
  description: string;
  type: 'warning' | 'tip' | 'positive';
}
