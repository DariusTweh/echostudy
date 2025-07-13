import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { useFocusEffect } from '@react-navigation/native';

export default function useNotebookNotes(userId: string, notebookId: string) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
// This goes inside the component

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('notebook_id', notebookId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notebook notes:', error);
    } else {
      setNotes(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId && notebookId) {
      fetchNotes();
    }
  }, [userId, notebookId]);

  return { notes, loading, refetch: fetchNotes };
}
