import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function usePinnedNotes(userId: string) {
  const [pinnedNotes, setPinnedNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPinnedNotes = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('pinned', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching pinned notes:', error);
      } else {
        setPinnedNotes(data || []);
      }

      setLoading(false);
    };

    fetchPinnedNotes();
  }, [userId]);

  return { pinnedNotes, loading };
}
