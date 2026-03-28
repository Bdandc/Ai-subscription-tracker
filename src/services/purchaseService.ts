import { supabase } from '../lib/supabase';
import { Purchase } from '../types';

function toRow(p: Purchase) {
  return {
    id: p.id,
    service: p.service,
    amount: p.amount,
    currency: p.currency,
    purchase_date: p.purchaseDate,
    notes: p.notes || null,
  };
}

function fromRow(row: Record<string, unknown>): Purchase {
  return {
    id: row.id as string,
    service: row.service as string,
    amount: Number(row.amount),
    currency: row.currency as string,
    purchaseDate: row.purchase_date as string,
    notes: row.notes as string | undefined,
  };
}

export async function fetchPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('ai_purchases')
    .select('*')
    .order('purchase_date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createPurchase(p: Purchase): Promise<Purchase> {
  const { data, error } = await supabase
    .from('ai_purchases')
    .insert(toRow(p))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deletePurchase(id: string): Promise<void> {
  const { error } = await supabase.from('ai_purchases').delete().eq('id', id);
  if (error) throw error;
}
