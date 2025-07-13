import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function useNotebooks(userId: string) {
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotebooks = async () => {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notebooks:', error);
    } else {
      setNotebooks(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchNotebooks();
  }, [userId]);

  const addNotebook = async (newNotebook: { title: string; color: string; icon: string }) => {
    const { data, error } = await supabase
      .from('notebooks')
      .insert([{ ...newNotebook, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding notebook:', error);
    } else if (data) {
      setNotebooks((prev) => [data, ...prev]);
    }
  };

  return { notebooks, loading, addNotebook, fetchNotebooks };
}
