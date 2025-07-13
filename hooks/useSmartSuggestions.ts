import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function useSmartSuggestions(userId: string) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('smart_suggestions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching smart suggestions:', error);
      } else {
        setSuggestions(data || []);
      }

      setLoading(false);
    };

    fetchSuggestions();
  }, [userId]);

  return { suggestions, loading };
}
