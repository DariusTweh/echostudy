import { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

export default function useQuickNotes(userId: string) {
  const [quickNotes, setQuickNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuickNote, setSelectedQuickNote] = useState<any | null>(null);


  const fetchQuickNotes = async () => {
    const { data, error } = await supabase
      .from('quick_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // newest first

    if (error) {
      console.error('Error fetching quick notes:', error);
    } else {
      setQuickNotes(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchQuickNotes();
  }, [userId]);

  const addQuickNote = async (text: string) => {
    const { data, error } = await supabase
      .from('quick_notes')
      .insert([{ user_id: userId, text }])
      .select();

    if (error) {
      console.error('Error adding quick note:', error);
    } else {
      setQuickNotes((prev) => [...(data || []), ...prev]);
    }
  };

  return { quickNotes, loading, addQuickNote, fetchQuickNotes };
}
