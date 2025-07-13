import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function useRecentNotes(userId: string) {
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRecentNotes = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('id, title, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(10); // show latest 10

      if (error) {
        console.error('Error fetching recent notes:', error);
      } else {
        setRecentNotes(data || []);
      }

      setLoading(false);
    };

    fetchRecentNotes();
  }, [userId]);

  return { recentNotes, loading };
}
