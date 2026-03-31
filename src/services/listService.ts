import { supabase } from '../lib/supabase';
import { TrackerList } from '../types';

function fromRow(row: Record<string, unknown>): TrackerList {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
  };
}

export async function fetchLists(): Promise<TrackerList[]> {
  const { data, error } = await supabase
    .from('tracker_lists')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createList(list: Omit<TrackerList, 'id'>): Promise<TrackerList> {
  const { data, error } = await supabase
    .from('tracker_lists')
    .insert({ name: list.name, color: list.color })
    .select()
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function updateList(list: TrackerList): Promise<TrackerList> {
  const { data, error } = await supabase
    .from('tracker_lists')
    .update({ name: list.name, color: list.color })
    .eq('id', list.id)
    .select()
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteList(id: string): Promise<void> {
  const { error } = await supabase
    .from('tracker_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
