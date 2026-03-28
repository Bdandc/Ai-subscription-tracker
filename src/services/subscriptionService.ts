import { supabase } from '../lib/supabase';
import { Subscription } from '../types';

function toRow(sub: Subscription) {
  return {
    id: sub.id,
    name: sub.name,
    amount: sub.amount,
    currency: sub.currency,
    billing_cycle: sub.billingCycle,
    category: sub.category,
    next_billing_date: sub.nextBillingDate || null,
    description: sub.description || null,
    status: sub.status ?? 'active',
  };
}

function fromRow(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    name: row.name as string,
    amount: Number(row.amount),
    currency: row.currency as string,
    billingCycle: row.billing_cycle as 'monthly' | 'yearly',
    category: row.category as Subscription['category'],
    nextBillingDate: row.next_billing_date as string,
    description: row.description as string | undefined,
    status: row.status as 'active' | 'cancelled' | 'paused',
  };
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('ai_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createSubscription(sub: Subscription): Promise<Subscription> {
  const { data, error } = await supabase
    .from('ai_subscriptions')
    .insert(toRow(sub))
    .select()
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function updateSubscription(sub: Subscription): Promise<Subscription> {
  const { data, error } = await supabase
    .from('ai_subscriptions')
    .update(toRow(sub))
    .eq('id', sub.id)
    .select()
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteSubscription(id: string): Promise<void> {
  const { error } = await supabase
    .from('ai_subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
